const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const { period = '30days' } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  // Build match query
  const matchQuery = {
    createdAt: { $gte: startDate, $lte: now }
  };

  // If citizen, only show their own stats
  if (req.user.role === 'citizen') {
    matchQuery.reportedBy = req.user._id;
  }

  // Get overview statistics
  const overview = await Complaint.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        closed: {
          $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get complaints by category
  const byCategory = await Complaint.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get complaints by priority
  const byPriority = await Complaint.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get daily trend
  const dailyTrend = await Complaint.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        complaints: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);

  // Calculate average resolution time (for resolved complaints)
  const avgResolutionTime = await Complaint.aggregate([
    {
      $match: {
        ...matchQuery,
        status: 'resolved',
        resolvedAt: { $exists: true }
      }
    },
    {
      $project: {
        resolutionTime: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60 * 24 // Convert to days
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgDays: { $avg: '$resolutionTime' }
      }
    }
  ]);

  // Get recent complaints
  const recentComplaints = await Complaint.find(matchQuery)
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name')
    .select('complaintId title category status priority createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get top reporters (admin only)
  let topReporters = [];
  if (req.user.role !== 'citizen') {
    topReporters = await Complaint.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$reportedBy',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$user.name', 0] },
          count: 1
        }
      }
    ]);
  }

  // Get officer workload (admin only)
  let officerWorkload = [];
  if (req.user.role !== 'citizen') {
    officerWorkload = await Complaint.aggregate([
      {
        $match: {
          assignedTo: { $exists: true, $ne: null },
          status: { $in: ['pending', 'in_progress'] }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'officer'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$officer.name', 0] },
          count: 1
        }
      }
    ]);
  }

  res.json({
    success: true,
    data: {
      overview: overview[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        rejected: 0
      },
      byCategory: byCategory.map(item => ({
        category: item._id,
        count: item.count
      })),
      byPriority: byPriority.map(item => ({
        priority: item._id,
        count: item.count
      })),
      dailyTrend: dailyTrend.map(item => ({
        date: item._id,
        complaints: item.complaints,
        resolved: item.resolved
      })),
      avgResolutionTime: avgResolutionTime[0]?.avgDays?.toFixed(1) || 0,
      recentComplaints,
      topReporters,
      officerWorkload
    }
  });
});

// @desc    Get map data for complaints
// @route   GET /api/dashboard/map-data
// @access  Private
const getMapData = asyncHandler(async (req, res) => {
  const { status, category, bounds } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  // If citizen, only show their own complaints
  if (req.user.role === 'citizen') {
    query.reportedBy = req.user._id;
  }

  // If bounds provided, filter by location
  if (bounds) {
    const [north, east, south, west] = bounds.split(',').map(Number);
    query['location.coordinates'] = {
      $geoWithin: {
        $box: [
          [west, south],
          [east, north]
        ]
      }
    };
  }

  const complaints = await Complaint.find(query)
    .select('complaintId title category status priority location coordinates')
    .populate('reportedBy', 'name')
    .limit(500);

  res.json({
    success: true,
    data: {
      complaints: complaints.map(c => ({
        id: c._id,
        complaintId: c.complaintId,
        title: c.title,
        category: c.category,
        status: c.status,
        priority: c.priority,
        coordinates: c.location.coordinates,
        address: c.location.address
      }))
    }
  });
});

// @desc    Get performance metrics
// @route   GET /api/dashboard/performance
// @access  Private (Admin/Officer)
const getPerformanceMetrics = asyncHandler(async (req, res) => {
  if (req.user.role === 'citizen') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  const { officerId } = req.query;

  const matchQuery = {};
  if (officerId) {
    matchQuery.assignedTo = officerId;
  }

  // Get resolution time by officer
  const resolutionTimeByOfficer = await Complaint.aggregate([
    {
      $match: {
        assignedTo: { $exists: true, $ne: null },
        status: 'resolved',
        resolvedAt: { $exists: true }
      }
    },
    {
      $project: {
        assignedTo: 1,
        resolutionTime: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    {
      $group: {
        _id: '$assignedTo',
        avgResolutionTime: { $avg: '$resolutionTime' },
        totalResolved: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'officer'
      }
    },
    {
      $project: {
        name: { $arrayElemAt: ['$officer.name', 0] },
        avgResolutionTime: { $round: ['$avgResolutionTime', 1] },
        totalResolved: 1
      }
    },
    { $sort: { avgResolutionTime: 1 } }
  ]);

  // Get complaints by department
  const byDepartment = await Complaint.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'officer'
      }
    },
    {
      $group: {
        _id: { $arrayElemAt: ['$officer.department', 0] },
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
        }
      }
    },
    { $match: { _id: { $ne: null } } },
    { $sort: { total: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      resolutionTimeByOfficer,
      byDepartment: byDepartment.map(d => ({
        department: d._id,
        total: d.total,
        resolved: d.resolved,
        pending: d.pending,
        inProgress: d.inProgress,
        resolutionRate: ((d.resolved / d.total) * 100).toFixed(1)
      }))
    }
  });
});

module.exports = {
  getDashboardStats,
  getMapData,
  getPerformanceMetrics
};
