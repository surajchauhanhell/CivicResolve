import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types';
import { CATEGORIES, STATUSES, PRIORITIES, ROLES } from './constants';

export { ROLES };

// Format date
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return 'Invalid date';
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

// Get category config
export const getCategoryConfig = (category: ComplaintCategory) => {
  return CATEGORIES[category] || CATEGORIES.other;
};

// Get status config
export const getStatusConfig = (status: ComplaintStatus) => {
  return STATUSES[status] || STATUSES.pending;
};

// Get priority config
export const getPriorityConfig = (priority: ComplaintPriority) => {
  return PRIORITIES[priority] || PRIORITIES.medium;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format category name for display
export const formatCategoryName = (category: string): string => {
  return category
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Format status for display
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Generate initials from name
export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get color based on status
export const getStatusColor = (status: ComplaintStatus): string => {
  const colors: Record<ComplaintStatus, string> = {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    resolved: '#10b981',
    closed: '#6b7280',
    rejected: '#ef4444'
  };
  return colors[status] || '#6b7280';
};

// Get color based on priority
export const getPriorityColor = (priority: ComplaintPriority): string => {
  const colors: Record<ComplaintPriority, string> = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#f97316',
    urgent: '#dc2626'
  };
  return colors[priority] || '#6b7280';
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]+$/;
  return phoneRegex.test(phone);
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate random color for avatar
export const getRandomColor = (): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Calculate resolution time in days
export const calculateResolutionTime = (createdAt: string, resolvedAt?: string): number | null => {
  if (!resolvedAt) return null;
  const created = new Date(createdAt).getTime();
  const resolved = new Date(resolvedAt).getTime();
  const diffInDays = (resolved - created) / (1000 * 60 * 60 * 24);
  return Math.round(diffInDays * 10) / 10;
};

// Get trend indicator
export const getTrend = (current: number, previous: number): { direction: 'up' | 'down' | 'same'; percentage: number } => {
  if (previous === 0) return { direction: current > 0 ? 'up' : 'same', percentage: 100 };
  const diff = current - previous;
  const percentage = Math.abs((diff / previous) * 100);
  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    percentage: Math.round(percentage * 10) / 10
  };
};

// Local storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};
