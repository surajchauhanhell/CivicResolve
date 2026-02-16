
import { supabase } from '@/lib/supabase';
import type { User, PaginatedResponse } from '@/types';

// Helper to calculate time since creation (mocking virtual field)
// In a real app we might do this in the UI
const addVirtualFields = (user: any) => {
  // ... logic if needed
  return user;
};

export const userService = {
  // Get all users
  getUsers: async (params?: {
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply Filters
    if (params?.role) {
      query = query.eq('role', params.role);
    }
    // Handle boolean correctly
    if (params?.isActive !== undefined) {
      query = query.eq('is_active', params.isActive);
    }

    // Search 
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    // We can't easily get complaint count in the same query without a view or joined count
    // For now, we return users without dynamic stats or fetch them separately if critical
    const usersWithStats = (data || []).map(user => ({
      ...user,
      _id: user.id, // Mongo compatibility
      createdAt: user.created_at, // Map for frontend
      updatedAt: user.updated_at,
      complaintCount: 0 // Placeholder
    }));

    return {
      data: usersWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Get single user
  getUserById: async (id: string): Promise<any> => {
    // 1. Get User
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    // 2. Get Complaints reported by user
    const { data: complaints, error: complaintsError } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (complaintsError) throw complaintsError;

    // 3. Calculate stats
    // This is a simple aggregation on the client side for the single user view
    const stats = [
      { _id: 'total', count: complaints.length },
      { _id: 'pending', count: complaints.filter((c: any) => c.status === 'pending').length },
      { _id: 'resolved', count: complaints.filter((c: any) => c.status === 'resolved').length }
    ];

    return {
      user: {
        ...user,
        _id: user.id, // Mongo compatibility
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      complaints,
      complaintStats: stats
    };
  },

  // Create user (admin only)
  createUser: async (data: Partial<User> & { password: string }): Promise<User> => {
    // Client-side admin creation is not secure/possible without Service Key.
    // We can use signUp but it logs the current user out.
    // Ideally this should be an Edge Function.
    // For this migration, we will throw an error or log a warning.
    console.warn("Client-side user creation by admin is not fully supported in this migration without Edge Functions.");
    throw new Error("Please use the Sign Up page to create new accounts.");
  },

  // Update user (admin only)
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name: data.name,
        phone: data.phone,
        address: data.address,
        role: data.role,
        department: data.department,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...updatedUser,
      _id: updatedUser.id,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at
    } as unknown as User;
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    // Deleting from public.users is enough, trigger should handle auth.users if set up, 
    // but usually we can't delete from auth.users from client.
    // We can only delete from public.users. Auth user remains but is "orphaned" or we rely on cascading if we could delete auth user.
    // Actually, we can't delete auth user from client. We can only set is_active = false.
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Get officers list
  getOfficers: async (): Promise<Array<{ _id: string; name: string; email: string; department?: string }>> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, department, role')
      .in('role', ['officer', 'admin', 'superadmin'])
      .eq('is_active', true);

    if (error) throw error;

    // Map id to _id for compatibility
    return data.map(u => ({ ...u, _id: u.id }));
  },

  // Toggle user status
  toggleUserStatus: async (id: string): Promise<{ id: string; isActive: boolean }> => {
    // Fetch current status first
    const { data: user } = await supabase.from('users').select('is_active').eq('id', id).single();

    const { data, error } = await supabase
      .from('users')
      .update({ is_active: !user?.is_active })
      .eq('id', id)
      .select('id, is_active')
      .single();

    if (error) throw error;
    return { id: data.id, isActive: data.is_active };
  }
};
