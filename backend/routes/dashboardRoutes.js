const express = require('express');
const {
  getDashboardStats,
  getMapData,
  getPerformanceMetrics
} = require('../controllers/dashboardController');
const { protect, officerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get map data
router.get('/map-data', getMapData);

// Get performance metrics (officer/admin only)
router.get('/performance', officerOrAdmin, getPerformanceMetrics);

module.exports = router;
