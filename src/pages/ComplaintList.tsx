import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { complaintService } from '@/services/complaintService';
import type { Complaint, ComplaintFilters } from '@/types';
import { getStatusConfig, getPriorityConfig, formatDate, formatCategoryName } from '@/utils/helpers';
import { useDebounce } from '@/hooks/use-debounce';

const ComplaintList = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ComplaintFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    category: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchComplaints = useCallback(async () => {
    setError(null); // Clear previous errors
    try {
      setIsLoading(true);
      const response = await complaintService.getComplaints({
        ...filters,
        search: debouncedSearch || undefined
      });
      setComplaints(response.complaints || []);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      // Show actual database error if available
      setError(err.message || err.error_description || 'Failed to load complaints. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleFilterChange = (key: keyof ComplaintFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No-op effectively, as debounce handles it
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'pothole', label: 'Pothole' },
    { value: 'garbage', label: 'Garbage' },
    { value: 'water_leakage', label: 'Water Leakage' },
    { value: 'street_light', label: 'Street Light' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'drainage', label: 'Drainage' },
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'illegal_construction', label: 'Illegal Construction' },
    { value: 'noise_pollution', label: 'Noise Pollution' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <Link
            to="/report"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Report New Issue
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by title, ID, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.priority}
                  onValueChange={(value) => handleFilterChange('priority', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No complaints found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || filters.status !== 'all' || filters.category !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You haven\'t reported any issues yet'}
                </p>
                <Button onClick={() => navigate('/report')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Report an Issue
                </Button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {complaints.map((complaint) => {
                    const statusConfig = getStatusConfig(complaint.status);
                    const priorityConfig = getPriorityConfig(complaint.priority);

                    return (
                      <div
                        key={complaint._id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/complaint/${complaint._id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                #{complaint.complaintId}
                              </span>
                              <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
                                {statusConfig.label}
                              </Badge>
                              <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color}`}>
                                {priorityConfig.label}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {complaint.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span>{formatCategoryName(complaint.category)}</span>
                              <span>•</span>
                              <span>{formatDate(complaint.createdAt)}</span>
                              {complaint.images.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{complaint.images.length} image(s)</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/complaint/${complaint._id}`);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * 10) + 1} to{' '}
                      {Math.min(pagination.page * 10, pagination.total)} of{' '}
                      {pagination.total} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintList;
