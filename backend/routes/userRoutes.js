const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getOfficers,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, adminOnly, officerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['citizen', 'officer', 'admin'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department cannot exceed 50 characters')
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['citizen', 'officer', 'admin'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department cannot exceed 50 characters')
];

// Routes
router.get('/', protect, adminOnly, getUsers);
router.get('/officers', protect, officerOrAdmin, getOfficers);
router.post('/', protect, adminOnly, createUserValidation, createUser);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUserValidation, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/:id/toggle-status', protect, adminOnly, toggleUserStatus);

module.exports = router;
