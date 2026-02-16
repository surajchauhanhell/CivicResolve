// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'officer' | 'admin' | 'superadmin';
  avatar?: string;
  address?: Address;
  department?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Complaint Types
export interface Complaint {
  _id: string;
  complaintId: string;
  originalId?: string; // Original UUID
  readableId?: string; // 7-digit ID
  title: string;
  description: string;
  category: ComplaintCategory;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    landmark?: string;
  };
  images: ComplaintImage[];
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reportedBy: User | string;
  assignedTo?: User | string;
  assignedAt?: string;
  resolvedAt?: string;
  resolution?: {
    notes: string;
    images: ComplaintImage[];
    resolvedBy?: User | string;
  };
  votes: {
    upvotes: number;
    downvotes: number;
  };
  viewCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  statusHistory?: StatusUpdate[];
}

export type ComplaintCategory =
  | 'pothole'
  | 'garbage'
  | 'water_leakage'
  | 'street_light'
  | 'electricity'
  | 'drainage'
  | 'road_damage'
  | 'illegal_construction'
  | 'noise_pollution'
  | 'other';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ComplaintImage {
  url: string;
  publicId: string;
  uploadedAt?: string;
}

export interface StatusUpdate {
  _id: string;
  complaintId: string;
  status: ComplaintStatus;
  previousStatus?: ComplaintStatus;
  comment: string;
  updatedBy: User;
  images?: ComplaintImage[];
  createdAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: ComplaintCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  estimatedResolutionDays: number;
  departments: string[];
  isActive: boolean;
  order: number;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: 'status_update' | 'assignment' | 'reminder' | 'system' | 'mention';
  title: string;
  message: string;
  complaintId?: string;
  complaintIdString?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  overview: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    rejected: number;
  };
  byCategory: { category: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  dailyTrend: { date: string; complaints: number; resolved: number }[];
  avgResolutionTime: number;
  recentComplaints: Complaint[];
  topReporters?: { name: string; count: number }[];
  officerWorkload?: { name: string; count: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  complaints?: T[];
  users?: T[];
  data?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface ComplaintFormData {
  title: string;
  description: string;
  category: ComplaintCategory;
  location: {
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
  };
  images: File[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Filter Types
export interface ComplaintFilters {
  status?: ComplaintStatus | 'all';
  category?: ComplaintCategory | 'all';
  priority?: ComplaintPriority | 'all';
  search?: string;
  myComplaints?: boolean;
  assignedToMe?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  dateRange?: 'today' | 'yesterday' | 'week' | 'all';
}
