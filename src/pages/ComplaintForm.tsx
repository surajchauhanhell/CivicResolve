import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Camera,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { complaintService } from '@/services/complaintService';
import { CATEGORIES, MAX_FILE_SIZE, MAX_FILES, ALLOWED_FILE_TYPES } from '@/utils/constants';
import type { ComplaintCategory } from '@/types';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ComplaintCategory | '',
    location: {
      address: '',
      lat: 0,
      lng: 0,
      landmark: ''
    },
    images: [] as File[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as ComplaintCategory }));
    setError('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (formData.images.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach(file => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG and WebP images are allowed');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Each image must be less than 5MB');
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setImagePreviews(prev => [...prev, ...previews]);
    setError('');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          setError('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.description.length < 3) {
      setError('Description must be at least 3 characters');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.location.address.trim()) {
      setError('Location address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!formData.category) return;

    setIsLoading(true);
    setError('');

    try {
      // Use default coordinates if not set
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: {
          address: formData.location.address,
          lat: formData.location.lat || 40.7128,
          lng: formData.location.lng || -74.0060,
          landmark: formData.location.landmark
        },
        images: formData.images
      };

      const response = await complaintService.createComplaint(submitData);
      setComplaintId(response.id);
      setSuccess(true);
    } catch (err: any) {
      console.error('Submission Error:', err);
      setError(err.message || err.error_description || 'Failed to submit complaint. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complaint Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-2">
                Your complaint has been registered with ID:
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-6">
                #{complaintId}
              </p>
              <p className="text-gray-600 mb-8">
                You can track the status of your complaint in your dashboard.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/complaints')}>
                  View My Complaints
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report a Civic Issue</h1>
          <p className="text-gray-600 mt-1">
            Fill out the form below to report an issue in your area.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Issue Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Large pothole on Main Street"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Provide a brief, descriptive title
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue in detail. Include any relevant information that might help authorities understand and resolve the problem."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Minimum 3 characters
                </p>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label>
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="location.address"
                      placeholder="Enter the address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <Input
                    name="location.landmark"
                    placeholder="Nearby landmark (optional)"
                    value={formData.location.landmark}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <Label>Upload Images (Optional)</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG or WebP (max 5MB each, up to 5 images)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isLoading}
                  />
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          disabled={isLoading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintForm;
