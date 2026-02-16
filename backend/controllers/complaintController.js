const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const StatusUpdate = require('../models/StatusUpdate');
const Notification = require('../models/Notification');
const generateComplaintId = require('../utils/generateComplaintId');
const { asyncHandler } = require('../middleware/errorHandler');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { title, description, category, location } = req.body;

  // Generate unique complaint ID
  const complaintId = await generateComplaintId();

  // Handle image uploads
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'civic-resolve/complaints',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' }
          ]
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });

        // Remove temp file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }
  }

  // Create complaint
  const complaint = await Complaint.create({
    complaintId,
    title,
    description,
    category,
    location: {
      address: location.address,
      coordinates: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng)
      },
      landmark: location.landmark || ''
    },
    images,
    reportedBy: req.user._id,
    status: 'pending',
    priority: calculatePriority(category)
  });

  // Create initial status update
  await StatusUpdate.create({
    complaintId: complaint._id,
    status: 'pending',
    comment: 'Complaint received and is being reviewed.',
    updatedBy: req.user._id
  });

  // Create notification for user
  await Notification.create({
    userId: req.user._id,
    type: 'status_update',
    title: 'Complaint Submitted',
    message: `Your complaint #${complaintId} has been submitted successfully.`,
    complaintId: complaint._id,
    complaintIdString: complaintId,
    actionUrl: `/complaint/${complaint._id}`
  });

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully',
    data: {
      complaintId: complaint.complaintId,
      title: complaint.title,
      status: complaint.status,
      createdAt: complaint.createdAt
    }
  });
});

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    priority,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    search,
    myComplaints
  } = req.query;

  // Build query
  const query = {};

  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }

  // Filter by category
  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by priority
  if (priority && priority !== 'all') {
    query.priority = priority;
  }

  // Filter by user's own complaints (for citizens)
  if (myComplaints === 'true' || req.user.role === 'citizen') {
    query.reportedBy = req.user._id;
  }

  // Search by title or complaint ID
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { complaintId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort
  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const complaints = await Complaint.find(query)
    .populate('reportedBy', 'name email avatar')
    .populate('assignedTo', 'name email department')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Complaint.countDocuments(query);

  res.json({
    success: true,
    data: {
      complaints,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('reportedBy', 'name email phone avatar')
    .populate('assignedTo', 'name email phone department avatar')
    .populate('resolution.resolvedBy', 'name email');

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Check if user has permission to view
  if (
    req.user.role === 'citizen' &&
    complaint.reportedBy._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this complaint'
    });
  }

  // Get status history
  const statusHistory = await StatusUpdate.getHistory(complaint._id);

  // Increment view count
  complaint.viewCount += 1;
  await complaint.save();

  res.json({
    success: true,
    data: {
      ...complaint.toObject(),
      statusHistory
    }
  });
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Officer/Admin)
const updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { status, comment, priority } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  const previousStatus = complaint.status;

  // Update status
  complaint.status = status;
  
  // Update priority if provided
  if (priority) {
    complaint.priority = priority;
  }

  // Handle resolution
  if (status === 'resolved') {
    complaint.resolvedAt = Date.now();
    complaint.resolution.resolvedBy = req.user._id;
    complaint.resolution.notes = comment || '';

    // Handle resolution images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'civic-resolve/resolutions',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' }
            ]
          });

          complaint.resolution.images.push({
            url: result.secure_url,
            publicId: result.public_id
          });

          fs.unlinkSync(file.path);
        } catch (error) {
          console.error('Image upload error:', error);
        }
      }
    }
  }

  await complaint.save();

  // Create status update record
  await StatusUpdate.create({
    complaintId: complaint._id,
    status,
    previousStatus,
    comment: comment || `Status updated to ${status}`,
    updatedBy: req.user._id
  });

  // Create notification for the reporter
  await Notification.create({
    userId: complaint.reportedBy,
    type: 'status_update',
    title: 'Complaint Status Updated',
    message: `Your complaint #${complaint.complaintId} status has been updated to ${status}.`,
    complaintId: complaint._id,
    complaintIdString: complaint.complaintId,
    actionUrl: `/complaint/${complaint._id}`
  });

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: {
      id: complaint._id,
      complaintId: complaint.complaintId,
      status: complaint.status,
      priority: complaint.priority,
      updatedAt: complaint.updatedAt
    }
  });
});

// @desc    Assign complaint to officer
// @route   POST /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { officerId } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Update assignment
  complaint.assignedTo = officerId;
  complaint.assignedAt = Date.now();
  
  // Auto-change status to in_progress if pending
  if (complaint.status === 'pending') {
    complaint.status = 'in_progress';
  }

  await complaint.save();

  // Create status update
  await StatusUpdate.create({
    complaintId: complaint._id,
    status: complaint.status,
    comment: `Complaint assigned to officer`,
    updatedBy: req.user._id
  });

  // Notify the officer
  await Notification.create({
    userId: officerId,
    type: 'assignment',
    title: 'New Complaint Assigned',
    message: `You have been assigned complaint #${complaint.complaintId}.`,
    complaintId: complaint._id,
    complaintIdString: complaint.complaintId,
    actionUrl: `/complaint/${complaint._id}`
  });

  // Notify the reporter
  await Notification.create({
    userId: complaint.reportedBy,
    type: 'status_update',
    title: 'Complaint Assigned',
    message: `Your complaint #${complaint.complaintId} has been assigned to an officer.`,
    complaintId: complaint._id,
    complaintIdString: complaint.complaintId,
    actionUrl: `/complaint/${complaint._id}`
  });

  res.json({
    success: true,
    message: 'Complaint assigned successfully',
    data: {
      id: complaint._id,
      complaintId: complaint.complaintId,
      assignedTo: officerId,
      assignedAt: complaint.assignedAt,
      status: complaint.status
    }
  });
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Delete images from Cloudinary
  if (complaint.images && complaint.images.length > 0) {
    for (const image of complaint.images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  }

  // Delete resolution images
  if (complaint.resolution.images && complaint.resolution.images.length > 0) {
    for (const image of complaint.resolution.images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        console.error('Error deleting resolution image:', error);
      }
    }
  }

  // Delete status updates
  await StatusUpdate.deleteMany({ complaintId: complaint._id });

  // Delete notifications
  await Notification.deleteMany({ complaintId: complaint._id });

  // Delete complaint
  await Complaint.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Complaint deleted successfully'
  });
});

// @desc    Vote on complaint
// @route   POST /api/complaints/:id/vote
// @access  Private
const voteComplaint = asyncHandler(async (req, res) => {
  const { vote } = req.body; // 'up' or 'down'

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Check if user already voted
  const existingVoteIndex = complaint.votes.voters.findIndex(
    v => v.user.toString() === req.user._id.toString()
  );

  if (existingVoteIndex > -1) {
    // Update existing vote
    const existingVote = complaint.votes.voters[existingVoteIndex];
    
    if (existingVote.vote === vote) {
      // Remove vote if same
      complaint.votes.voters.splice(existingVoteIndex, 1);
      if (vote === 'up') {
        complaint.votes.upvotes -= 1;
      } else {
        complaint.votes.downvotes -= 1;
      }
    } else {
      // Change vote
      if (vote === 'up') {
        complaint.votes.upvotes += 1;
        complaint.votes.downvotes -= 1;
      } else {
        complaint.votes.upvotes -= 1;
        complaint.votes.downvotes += 1;
      }
      existingVote.vote = vote;
    }
  } else {
    // Add new vote
    complaint.votes.voters.push({
      user: req.user._id,
      vote
    });
    if (vote === 'up') {
      complaint.votes.upvotes += 1;
    } else {
      complaint.votes.downvotes += 1;
    }
  }

  await complaint.save();

  res.json({
    success: true,
    message: 'Vote recorded successfully',
    data: {
      upvotes: complaint.votes.upvotes,
      downvotes: complaint.votes.downvotes
    }
  });
});

// Helper function to calculate priority based on category
const calculatePriority = (category) => {
  const priorities = {
    'water_leakage': 'urgent',
    'electricity': 'high',
    'drainage': 'high',
    'pothole': 'high',
    'road_damage': 'high',
    'street_light': 'medium',
    'garbage': 'medium',
    'illegal_construction': 'medium',
    'noise_pollution': 'low',
    'other': 'low'
  };
  return priorities[category] || 'medium';
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateStatus,
  assignComplaint,
  deleteComplaint,
  voteComplaint
};
