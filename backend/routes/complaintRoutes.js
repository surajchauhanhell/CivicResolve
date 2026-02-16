const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateStatus,
  assignComplaint,
  deleteComplaint,
  voteComplaint
} = require('../controllers/complaintController');
const { protect, officerOrAdmin, adminOnly } = require('../middleware/auth');
const { handleUpload, uploadMultiple } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const createComplaintValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['pothole', 'garbage', 'water_leakage', 'street_light', 'electricity', 'drainage', 'road_damage', 'illegal_construction', 'noise_pollution', 'other'])
    .withMessage('Invalid category'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat()
    .withMessage('Invalid latitude'),
  body('location.lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat()
    .withMessage('Invalid longitude')
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'in_progress', 'resolved', 'closed', 'rejected'])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

const assignValidation = [
  body('officerId')
    .notEmpty()
    .withMessage('Officer ID is required')
    .isMongoId()
    .withMessage('Invalid officer ID')
];

const voteValidation = [
  body('vote')
    .notEmpty()
    .withMessage('Vote is required')
    .isIn(['up', 'down'])
    .withMessage('Vote must be up or down')
];

// Routes
router.post(
  '/',
  protect,
  handleUpload(uploadMultiple),
  createComplaintValidation,
  createComplaint
);

router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);

router.put(
  '/:id/status',
  protect,
  officerOrAdmin,
  handleUpload(uploadMultiple),
  updateStatusValidation,
  updateStatus
);

router.post(
  '/:id/assign',
  protect,
  adminOnly,
  assignValidation,
  assignComplaint
);

router.delete('/:id', protect, adminOnly, deleteComplaint);
router.post('/:id/vote', protect, voteValidation, voteComplaint);

module.exports = router;
