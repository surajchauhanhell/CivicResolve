import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    FileText,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    Archive,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { complaintService } from '@/services/complaintService';
import type { Complaint, ComplaintFilters } from '@/types';
import { getStatusConfig, getPriorityConfig, formatDate, formatCategoryName } from '@/utils/helpers';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

const OfficerPanel = () => {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ComplaintFilters>({
        page: 1,
        limit: 10,
        status: 'all',
        category: 'all',
        priority: 'all',
        sortBy: 'updatedAt', // Sort by updated to see recent assignments/changes
        order: 'desc',
        assignedToMe: true // Enforce assigned to me
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Dialog states
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusComment, setStatusComment] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        rejected: 0
    });

    const fetchStats = async () => {
        try {
            const data = await complaintService.getOfficerStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchComplaints = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await complaintService.getComplaints({
                ...filters,
                search: debouncedSearch || undefined
            });
            setComplaints(response.complaints || []);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            toast.error('Failed to load complaints');
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
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedComplaint || !newStatus) return;

        setIsSubmitting(true);
        try {
            await complaintService.updateStatus(
                selectedComplaint.originalId || selectedComplaint._id,
                newStatus,
                statusComment
            );
            toast.success('Status updated successfully');
            setIsStatusDialogOpen(false);
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openStatusDialog = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.status);
        setStatusComment('');
        setIsStatusDialogOpen(true);
    };

    const statusOptions = [
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Officer Panel</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your assigned complaints
                        </p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-2">
                                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pending</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-2">
                                <RotateCcw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.inProgress}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">In Progress</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full mb-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.resolved}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Resolved</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                                <Archive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.closed}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Closed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full mb-2">
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.rejected}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rejected</p>
                        </CardContent>
                    </Card>
                </div>

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
                                        <SelectItem value="all">All Statuses</SelectItem>
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

                                <Select
                                    value={filters.dateRange || 'all'}
                                    onValueChange={(value) => handleFilterChange('dateRange', value)}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Date Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Dates</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="yesterday">Yesterday</SelectItem>
                                        <SelectItem value="week">Last 7 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Complaints Table */}
                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="text-center py-16">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No assigned complaints found
                                </h3>
                                <p className="text-gray-500">
                                    You have no pending assignments matching these filters
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Priority
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Reported By
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {complaints.map((complaint) => {
                                                const statusConfig = getStatusConfig(complaint.status);
                                                const priorityConfig = getPriorityConfig(complaint.priority);
                                                const reportedBy = typeof complaint.reportedBy === 'object' ? complaint.reportedBy : null;

                                                return (
                                                    <tr key={complaint._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{complaint.complaintId}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                            {complaint.title}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {formatCategoryName(complaint.category)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color}`}>
                                                                {priorityConfig.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {reportedBy ? reportedBy.name : 'Unknown User'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {formatDate(complaint.updatedAt || complaint.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => navigate(`/complaint/${complaint._id}`)}>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openStatusDialog(complaint)}>
                                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                        Update Status
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
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

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status</DialogTitle>
                        <DialogDescription>
                            Update the status for complaint #{selectedComplaint?.complaintId}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Comment (Optional)</Label>
                            <Textarea
                                placeholder="Add a comment about this status change..."
                                value={statusComment}
                                onChange={(e) => setStatusComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Status'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default OfficerPanel;
