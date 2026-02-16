import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { complaintService } from '@/services/complaintService';
import { useAuthStore } from '@/store/authStore';
import type { Complaint, StatusUpdate } from '@/types';
import { getStatusConfig, getPriorityConfig, formatDate, formatRelativeTime, getInitials } from '@/utils/helpers';

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Status Update State
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setIsLoading(true);
      const data = await complaintService.getComplaintById(id!);
      setComplaint(data);
      setNewStatus(data.status); // Initialize status
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!complaint || !newStatus) return;

    setIsSubmitting(true);
    try {
      const updatedComplaint = await complaintService.updateStatus(
        complaint.originalId || complaint._id,
        newStatus,
        statusComment
      );
      setComplaint(updatedComplaint);
      toast.success('Status updated successfully');
      setIsStatusDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (vote: 'up' | 'down') => {
    try {
      const result = await complaintService.voteComplaint(id!, vote);
      setComplaint(prev => prev ? {
        ...prev,
        votes: {
          ...prev.votes,
          upvotes: result.upvotes,
          downvotes: result.downvotes
        }
      } : null);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Complaint not found'}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/complaints')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Complaints
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(complaint.status);
  const priorityConfig = getPriorityConfig(complaint.priority);
  const reportedBy = typeof complaint.reportedBy === 'object' ? complaint.reportedBy : null;
  const assignedTo = typeof complaint.assignedTo === 'object' ? complaint.assignedTo : null;

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/complaints')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">#{complaint.complaintId}</span>
            <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
            <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color}`}>
              {priorityConfig.label}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {complaint.title}
          </h1>

          {/* Action Buttons for Officer/Admin */}
          {(user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && (typeof complaint.assignedTo === 'object' ? complaint.assignedTo?.id === user.id : complaint.assignedTo === user.id))) && (
            <div className="mt-4">
              <Button onClick={() => setIsStatusDialogOpen(true)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          )}
        </div>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
              <DialogDescription>
                Update the status for complaint #{complaint.complaintId}
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </CardContent>
            </Card>

            {/* Images */}
            {complaint.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.images.map((image, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(image.url)}
                          >
                            <img
                              src={image.url}
                              alt={`Complaint image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Image {index + 1}</DialogTitle>
                          </DialogHeader>
                          <img
                            src={image.url}
                            alt={`Complaint image ${index + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status History */}
            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaint.statusHistory.map((update: StatusUpdate, index: number) => {
                      const updateStatusConfig = getStatusConfig(update.status);
                      const updater = typeof update.updatedBy === 'object' ? update.updatedBy : null;

                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${updateStatusConfig.bgColor.replace('bg-', 'bg-').replace('100', '500')}`} />
                            {index < complaint.statusHistory!.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${updateStatusConfig.bgColor} ${updateStatusConfig.color} text-xs`}>
                                {updateStatusConfig.label}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatRelativeTime(update.createdAt)}
                              </span>
                            </div>
                            {update.comment && (
                              <p className="text-sm text-gray-700">{update.comment}</p>
                            )}
                            {updater && (
                              <p className="text-xs text-gray-500 mt-1">
                                by {updater.name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resolution */}
            {complaint.resolution && complaint.resolution.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                    Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{complaint.resolution.notes}</p>
                  {complaint.resolution.resolvedBy && (
                    <p className="text-sm text-gray-500 mt-2">
                      Resolved by: {typeof complaint.resolution.resolvedBy === 'object'
                        ? complaint.resolution.resolvedBy.name
                        : 'Unknown'}
                    </p>
                  )}
                  {complaint.resolution.images && complaint.resolution.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {complaint.resolution.images.map((image, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div className="aspect-square rounded-lg overflow-hidden cursor-pointer">
                              <img
                                src={image.url}
                                alt={`Resolution image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <img
                              src={image.url}
                              alt={`Resolution image ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{getCategoryLabel(complaint.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reported By</p>
                  <div className="flex items-center mt-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-sm font-medium text-blue-600">
                        {getInitials(reportedBy?.name || 'Unknown')}
                      </span>
                    </div>
                    <span className="font-medium">{reportedBy?.name || 'Unknown'}</span>
                  </div>
                </div>
                {assignedTo && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <div className="flex items-center mt-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-sm font-medium text-purple-600">
                          {getInitials(assignedTo.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{assignedTo.name}</p>
                        {assignedTo.department && (
                          <p className="text-xs text-gray-500">{assignedTo.department}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Reported On</p>
                  <p className="font-medium">{formatDate(complaint.createdAt)}</p>
                </div>
                {complaint.resolvedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Resolved On</p>
                    <p className="font-medium">{formatDate(complaint.resolvedAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{complaint.location.address}</p>
                  {complaint.location.landmark && (
                    <p className="text-sm text-gray-500">Near: {complaint.location.landmark}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Votes Card */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-3">Was this complaint helpful?</p>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleVote('up')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {complaint.votes.upvotes}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleVote('down')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {complaint.votes.downvotes}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
