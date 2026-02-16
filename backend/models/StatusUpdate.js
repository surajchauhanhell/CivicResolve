const mongoose = require('mongoose');

const statusUpdateSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'rejected'],
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: null
  },
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
statusUpdateSchema.index({ complaintId: 1, createdAt: -1 });
statusUpdateSchema.index({ updatedBy: 1 });

// Static method to get status history for a complaint
statusUpdateSchema.statics.getHistory = async function(complaintId) {
  return await this.find({ complaintId })
    .populate('updatedBy', 'name email role avatar')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('StatusUpdate', statusUpdateSchema);
