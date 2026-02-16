import type { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types';

// Category configurations
export const CATEGORIES: Record<ComplaintCategory, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  pothole: {
    label: 'Pothole',
    icon: 'CircleDot',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Road potholes and surface damage'
  },
  garbage: {
    label: 'Garbage Collection',
    icon: 'Trash2',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Garbage accumulation and waste management'
  },
  water_leakage: {
    label: 'Water Leakage',
    icon: 'Droplets',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Water pipe leaks and supply issues'
  },
  street_light: {
    label: 'Street Light',
    icon: 'Lightbulb',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: 'Street light failures and maintenance'
  },
  electricity: {
    label: 'Electricity Issue',
    icon: 'Zap',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Power outages and electrical problems'
  },
  drainage: {
    label: 'Drainage Problem',
    icon: 'Waves',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: 'Drainage blockages and sewer issues'
  },
  road_damage: {
    label: 'Road Damage',
    icon: 'Road',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Major road damage and repairs needed'
  },
  illegal_construction: {
    label: 'Illegal Construction',
    icon: 'Building2',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    description: 'Unauthorized construction activities'
  },
  noise_pollution: {
    label: 'Noise Pollution',
    icon: 'Volume2',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'Excessive noise complaints'
  },
  other: {
    label: 'Other',
    icon: 'HelpCircle',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Other civic issues'
  }
};

// Status configurations
export const STATUSES: Record<ComplaintStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: 'Clock'
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: 'Loader2'
  },
  resolved: {
    label: 'Resolved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: 'CheckCircle2'
  },
  closed: {
    label: 'Closed',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: 'XCircle'
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: 'Ban'
  }
};

// Priority configurations
export const PRIORITIES: Record<ComplaintPriority, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  low: {
    label: 'Low',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: 'ArrowDown'
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: 'Minus'
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: 'ArrowUp'
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: 'AlertTriangle'
  }
};

// Role configurations
export const ROLES: Record<string, { label: string; color: string; bgColor: string }> = {
  citizen: {
    label: 'Citizen',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  officer: {
    label: 'Officer',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100'
  },
  admin: {
    label: 'Admin',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  },
  superadmin: {
    label: 'Super Admin',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100'
  }
};

// App constants
export const APP_NAME = 'Civic Resolve';
export const APP_TAGLINE = 'Report Civic Issues. Get Them Resolved. Make Your City Better.';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File upload constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 5;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Date formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Map defaults
export const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City
export const DEFAULT_MAP_ZOOM = 12;
