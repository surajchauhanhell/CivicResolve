const { validationResult } = require('express-validator');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const {
    role,
    isActive,
    page = 1,
    limit = 20,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort
  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get complaint counts for each user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const complaintCount = await Complaint.countDocuments({ reportedBy: user._id });
      return {
        ...user.toObject(),
        complaintCount
      };
    })
  );

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user's complaints
  const complaints = await Complaint.find({ reportedBy: user._id })
    .select('complaintId title status category createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get complaint statistics
  const complaintStats = await Complaint.aggregate([
    { $match: { reportedBy: user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      user,
      complaints,
      complaintStats
    }
  });
});

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { name, email, password, phone, role, department } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'citizen',
    department
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user.getPublicProfile()
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { name, phone, role, department, isActive, address } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update fields
  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.role = role || user.role;
  user.department = department || user.department;
  user.isActive = isActive !== undefined ? isActive : user.isActive;
  user.address = address || user.address;
  user.updatedAt = Date.now();

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user.getPublicProfile()
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent deleting self
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get officers list
// @route   GET /api/users/officers
// @access  Private (Admin/Officer)
const getOfficers = asyncHandler(async (req, res) => {
  const officers = await User.find({
    role: { $in: ['officer', 'admin'] },
    isActive: true
  })
    .select('name email department')
    .sort({ name: 1 });

  res.json({
    success: true,
    data: officers
  });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent deactivating self
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own status'
    });
  }

  user.isActive = !user.isActive;
  user.updatedAt = Date.now();
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      id: user._id,
      isActive: user.isActive
    }
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getOfficers,
  toggleUserStatus
};
