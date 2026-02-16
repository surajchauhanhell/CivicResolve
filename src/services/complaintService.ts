
import { supabase } from '@/lib/supabase';
import type {
  Complaint,
  ComplaintFormData,
  ComplaintFilters,
  PaginatedResponse
} from '@/types';

// Helper to calculate time since creation (mocking virtual field)
// In a real app we might do this in the UI
const addVirtualFields = (complaint: any) => {
  // ... logic if needed
  return complaint;
};

export const complaintService = {
  // Create new complaint
  createComplaint: async (data: ComplaintFormData): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 0. Ensure user profile exists (Self-healing for existing auth users)
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      const { error: profileError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name || user.email?.split('@')[0] || 'User',
        role: user.email?.includes('@admin.com') ? 'admin' : 'citizen'
      });
      if (profileError) console.error('Error creating profile:', profileError);
    }

    // 1. Upload Images
    const uploadPromises = data.images.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('complaint-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('complaint-images')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        publicId: filePath,
        uploadedAt: new Date().toISOString()
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // 2. Insert Complaint Record
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        images: uploadedImages,
        user_id: user.id,
        status: 'pending',
        priority: 'medium',
        votes: { upvotes: 0, downvotes: 0, voters: [] }
      })
      .select()
      .single();

    if (error) throw error;
    return complaint;
  },

  // Get all complaints with filters
  getComplaints: async (filters: ComplaintFilters = {}): Promise<PaginatedResponse<Complaint>> => {
    let query = supabase
      .from('complaints')
      .select('*, reportedBy:users!complaints_user_id_fkey(name, avatar), assignedTo:users!complaints_assigned_to_fkey(name)', { count: 'exact' });

    // Apply Filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    if (filters.myComplaints) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('user_id', user.id);
      }
    }

    // Filter for officers to see assigned complaints
    if (filters.assignedToMe) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('assigned_to', user.id);
      }
    }

    // Search (Title, Description, Readable ID)
    if (filters.search) {
      // If search looks like a number (timestamp or readable ID), prioritize that
      if (!isNaN(Number(filters.search))) {
        query = query.or(`readable_id.eq.${filters.search},title.ilike.%${filters.search}%`);
      } else {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    // Sorting
    if (filters.sortBy) {
      const sortMap: Record<string, string> = {
        createdAt: 'created_at',
        complaintId: 'id',
        title: 'title',
        status: 'status',
        priority: 'priority'
      };
      const sortColumn = sortMap[filters.sortBy] || 'created_at';
      query = query.order(sortColumn, { ascending: filters.order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Date Range Filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00 today

      if (filters.dateRange === 'today') {
        query = query.gte('created_at', today.toISOString());
      } else if (filters.dateRange === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        query = query.gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      }
    }

    // Role-based automatic filtering (Frontend safeguard, though RLS handles it)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // If citizen, ONLY show own complaints (safeguard)
      // Admin/Officer logic is handled by filters or RLS
      const isCitizen = user.user_metadata.role === 'citizen' || (user.email && !user.email.includes('admin') && !user.email.includes('officer'));
      // Note: better to rely on public.users role but this is a quick check

      // actually, RLS will handle the visibility. 
      // But UI might want to be explicit to avoid "0 results" confusion if they select "All"
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      complaints: (data || []).map((c: any) => ({
        ...c,
        _id: c.readable_id || c.id, // Use readable ID for admin panel search/id
        originalId: c.id, // Keep UUID for internal operations if needed
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        complaintId: c.readable_id || c.id // Display readable ID
      })) as unknown as Complaint[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Get single complaint
  getComplaintById: async (id: string): Promise<Complaint> => {
    let query = supabase
      .from('complaints')
      .select('*, reportedBy:users!complaints_user_id_fkey(id, name, avatar, email), assignedTo:users!complaints_assigned_to_fkey(id, name, email)');

    // Check if id is a UUID or a readable ID (number)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let data, error;
    if (isUuid) {
      // Query by UUID
      ({ data, error } = await query.eq('id', id).single());
    } else {
      // Query by Readable ID
      ({ data, error } = await query.eq('readable_id', id).single());
    }

    if (error) throw error;

    return {
      ...data,
      _id: data.readable_id || data.id,
      originalId: data.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      complaintId: data.readable_id || data.id
    } as unknown as Complaint;
  },

  // Update complaint status
  updateStatus: async (
    id: string,
    status: string,
    comment?: string,
    priority?: string,
    images?: File[]
  ): Promise<Complaint> => {

    const updates: any = { status };
    if (priority) updates.priority = priority;

    let targetId = id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isUuid) {
      const { data } = await supabase
        .from('complaints')
        .select('id')
        .eq('readable_id', id)
        .single();
      if (data) targetId = data.id;
    }

    // Handle Image Uploads for resolution if any
    let resolutionImages: any[] = [];
    if (images && images.length > 0) {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const uploadPromises = images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `resolution/${id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('complaint-images').upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('complaint-images').getPublicUrl(fileName);
          return { url: publicUrl, publicId: fileName };
        });
        resolutionImages = await Promise.all(uploadPromises);
      }
    }

    // Prepare resolution object
    if (status === 'resolved') {
      const user = (await supabase.auth.getUser()).data.user;
      updates.resolution = {
        notes: comment || '',
        images: resolutionImages,
        resolvedBy: user?.id,
        resolvedAt: new Date().toISOString()
      };
      updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Complaint;
  },

  // Assign complaint to officer
  assignComplaint: async (id: string, officerId: string): Promise<Complaint> => {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_to: officerId,
        assigned_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Complaint;
  },

  // Delete complaint
  deleteComplaint: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Vote on complaint
  voteComplaint: async (id: string, vote: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to vote');

    // 1. Fetch current votes
    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('votes')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    let votes = complaint.votes || { upvotes: 0, downvotes: 0, voters: [] };

    // Check if user already voted
    const existingVoteIndex = votes.voters.findIndex((v: any) => v.user === user.id);

    if (existingVoteIndex !== -1) {
      // Remove existing vote stats
      const oldVote = votes.voters[existingVoteIndex].vote;
      if (oldVote === 'up') votes.upvotes--;
      if (oldVote === 'down') votes.downvotes--;

      // Remove voter
      votes.voters.splice(existingVoteIndex, 1);
    }

    // Add new vote
    if (vote === 'up') votes.upvotes++;
    if (vote === 'down') votes.downvotes++;
    votes.voters.push({ user: user.id, vote });

    // 2. Update votes
    const { error: updateError } = await supabase
      .from('complaints')
      .update({ votes })
      .eq('id', id);

    if (updateError) throw updateError;

    return { upvotes: votes.upvotes, downvotes: votes.downvotes };
  },

  // Get officer statistics
  getOfficerStats: async (): Promise<{
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    rejected: number;
  }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .select('status')
      .eq('assigned_to', user.id);

    if (error) throw error;

    const stats = {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      rejected: 0
    };

    data.forEach((c: any) => {
      if (c.status === 'pending') stats.pending++;
      if (c.status === 'in_progress') stats.inProgress++;
      if (c.status === 'resolved') stats.resolved++;
      if (c.status === 'closed') stats.closed++;
      if (c.status === 'rejected') stats.rejected++;
    });

    return stats;
  }
};
