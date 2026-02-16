import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { dashboardService } from '@/services/dashboardService';
import { complaintService } from '@/services/complaintService';
import type { DashboardStats, Complaint } from '@/types';
import { getStatusConfig, getPriorityConfig, formatRelativeTime, formatDate } from '@/utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* 
   * Updated to handle Officer role:
   * - If officer, fetch assigned complaints
   * - If citizen, fetch recent (public/own)
   */
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const promises: Promise<any>[] = [
        dashboardService.getStats('30days')
      ];

      // If officer, fetch assigned complaints. If citizen, fetch general recent.
      if (user?.role === 'officer') {
        promises.push(complaintService.getComplaints({
          limit: 5,
          sortBy: 'updatedAt',
          order: 'desc',
          assignedToMe: true // New filter
        }));
      } else {
        promises.push(complaintService.getComplaints({
          limit: 5,
          sortBy: 'createdAt',
          order: 'desc'
        }));
      }

      const [statsData, complaintsData] = await Promise.all(promises);

      setStats(statsData);
      setRecentComplaints(complaintsData.complaints || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats?.overview.total || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending',
      value: stats?.overview.pending || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'In Progress',
      value: stats?.overview.inProgress || 0,
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Resolved',
      value: stats?.overview.resolved || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
  ];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      pothole: 'Pothole',
      garbage: 'Garbage',
      water_leakage: 'Water Leakage',
      street_light: 'Street Light',
      electricity: 'Electricity',
      drainage: 'Drainage',
      road_damage: 'Road Damage',
      illegal_construction: 'Illegal Construction',
      noise_pollution: 'Noise Pollution',
      other: 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Complaints */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {user?.role === 'officer' ? 'Assigned to Me' : 'Recent Complaints'}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/complaints')}
                  >
                    View All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/report')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : recentComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No complaints yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/report')}
                    >
                      Report your first issue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => {
                      const statusConfig = getStatusConfig(complaint.status);
                      const priorityConfig = getPriorityConfig(complaint.priority);

                      return (
                        <div
                          key={complaint._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/complaint/${complaint._id}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                #{complaint.complaintId}
                              </span>
                              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} text-xs`}>
                                {statusConfig.label}
                              </Badge>
                              <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color} text-xs`}>
                                {priorityConfig.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 truncate">{complaint.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getCategoryLabel(complaint.category)} • {formatRelativeTime(complaint.createdAt)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => navigate('/report')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Report New Issue
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/complaints')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View All Complaints
                </Button>
              </CardContent>
            </Card>

            {/* Categories Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">By Category</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : stats?.byCategory && stats.byCategory.length > 0 ? (
                  <div className="space-y-3">
                    {stats.byCategory.slice(0, 5).map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {getCategoryLabel(item.category)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Average Resolution Time */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Resolution Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '-' : `${stats?.avgResolutionTime || 0} days`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
