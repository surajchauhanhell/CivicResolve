const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'help-circle'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedResolutionDays: {
    type: Number,
    default: 7
  },
  departments: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-defined categories that will be seeded
categorySchema.statics.getDefaultCategories = function() {
  return [
    {
      name: 'pothole',
      label: 'Pothole',
      description: 'Road potholes and surface damage',
      icon: 'circle-dot',
      color: '#ef4444',
      priority: 'high',
      estimatedResolutionDays: 3,
      departments: ['Road Maintenance']
    },
    {
      name: 'garbage',
      label: 'Garbage Collection',
      description: 'Garbage accumulation and waste management issues',
      icon: 'trash-2',
      color: '#22c55e',
      priority: 'medium',
      estimatedResolutionDays: 2,
      departments: ['Sanitation']
    },
    {
      name: 'water_leakage',
      label: 'Water Leakage',
      description: 'Water pipe leaks and supply issues',
      icon: 'droplets',
      color: '#3b82f6',
      priority: 'urgent',
      estimatedResolutionDays: 1,
      departments: ['Water Supply']
    },
    {
      name: 'street_light',
      label: 'Street Light',
      description: 'Street light failures and maintenance',
      icon: 'lightbulb',
      color: '#f59e0b',
      priority: 'medium',
      estimatedResolutionDays: 2,
      departments: ['Electricity']
    },
    {
      name: 'electricity',
      label: 'Electricity Issue',
      description: 'Power outages and electrical problems',
      icon: 'zap',
      color: '#f97316',
      priority: 'high',
      estimatedResolutionDays: 1,
      departments: ['Electricity']
    },
    {
      name: 'drainage',
      label: 'Drainage Problem',
      description: 'Drainage blockages and sewer issues',
      icon: 'waves',
      color: '#6366f1',
      priority: 'high',
      estimatedResolutionDays: 2,
      departments: ['Drainage']
    },
    {
      name: 'road_damage',
      label: 'Road Damage',
      description: 'Major road damage and repairs needed',
      icon: 'road',
      color: '#dc2626',
      priority: 'high',
      estimatedResolutionDays: 5,
      departments: ['Road Maintenance']
    },
    {
      name: 'illegal_construction',
      label: 'Illegal Construction',
      description: 'Unauthorized construction activities',
      icon: 'building-2',
      color: '#7c3aed',
      priority: 'medium',
      estimatedResolutionDays: 7,
      departments: ['Building Control']
    },
    {
      name: 'noise_pollution',
      label: 'Noise Pollution',
      description: 'Excessive noise complaints',
      icon: 'volume-2',
      color: '#ec4899',
      priority: 'low',
      estimatedResolutionDays: 3,
      departments: ['Environment']
    },
    {
      name: 'other',
      label: 'Other',
      description: 'Other civic issues',
      icon: 'help-circle',
      color: '#6b7280',
      priority: 'low',
      estimatedResolutionDays: 5,
      departments: ['General']
    }
  ];
};

module.exports = mongoose.model('Category', categorySchema);
