
import { supabase } from '@/lib/supabase';
import type { DashboardStats, Complaint, ApiResponse } from '@/types';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (period: string = '30days'): Promise<DashboardStats> => {
    // Determine date range
    const startDate = new Date();
    if (period === '7days') startDate.setDate(startDate.getDate() - 7);
    if (period === '30days') startDate.setDate(startDate.getDate() - 30);
    if (period === '90days') startDate.setDate(startDate.getDate() - 90);
    if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

    // Fetch all complaints within period
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Calculate stats in JS
    const total = complaints.length;
    const pending = complaints.filter((c: any) => c.status === 'pending').length;
    const inProgress = complaints.filter((c: any) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
    const closed = complaints.filter((c: any) => c.status === 'closed').length;
    const rejected = complaints.filter((c: any) => c.status === 'rejected').length;

    // Group by Category
    const categoryMap = new Map();
    complaints.forEach((c: any) => {
      const count = categoryMap.get(c.category) || 0;
      categoryMap.set(c.category, count + 1);
    });
    const byCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));

    // Group by Priority
    const priorityMap = new Map();
    complaints.forEach((c: any) => {
      const count = priorityMap.get(c.priority) || 0;
      priorityMap.set(c.priority, count + 1);
    });
    const byPriority = Array.from(priorityMap.entries()).map(([priority, count]) => ({ priority, count }));

    // Daily Trend
    const trendMap = new Map();
    complaints.forEach((c: any) => {
      const date = c.created_at.split('T')[0];
      if (!trendMap.has(date)) trendMap.set(date, { date, complaints: 0, resolved: 0 });
      const entry = trendMap.get(date);
      entry.complaints++;
      if (c.status === 'resolved') entry.resolved++;
    });
    const dailyTrend = Array.from(trendMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date));

    // Avg Resolution Time
    const resolvedComplaints = complaints.filter((c: any) => c.status === 'resolved' && c.resolved_at);
    const totalResolutionTime = resolvedComplaints.reduce((acc: number, c: any) => {
      const start = new Date(c.created_at).getTime();
      const end = new Date(c.resolved_at).getTime();
      return acc + (end - start);
    }, 0);
    const avgResolutionTime = resolvedComplaints.length ? totalResolutionTime / resolvedComplaints.length : 0;

    return {
      overview: { total, pending, inProgress, resolved, closed, rejected },
      byCategory,
      byPriority,
      dailyTrend,
      avgResolutionTime,
      recentComplaints: complaints.slice(0, 5) // Just first 5
    };
  },

  // Get map data
  getMapData: async (
    status?: string,
    category?: string,
    bounds?: string
  ): Promise<any> => {
    let query = supabase
      .from('complaints')
      .select('id, complaintId, title, category, status, priority, location');

    if (status && status !== 'all') query = query.eq('status', status);
    if (category && category !== 'all') query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;

    return {
      complaints: data.map((c: any) => ({
        id: c.id,
        complaintId: c.complaintId || c.id, // Fallback
        title: c.title,
        category: c.category,
        status: c.status,
        priority: c.priority,
        coordinates: c.location.coordinates,
        address: c.location.address
      }))
    };
  },

  // Get performance metrics
  getPerformanceMetrics: async (officerId?: string): Promise<any> => {
    // Mocking or simple aggregation
    return {
      resolutionTimeByOfficer: [],
      byDepartment: []
    };
  }
};
