const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getProfile,
  changePassword,
  getDashboardData,
  toggleUserStatus,
  getUserActivity
} = require('../controllers/userController');
const { protect, admin, authorize } = require('../middleware/authMiddleware');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Profile validation middleware
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  body('address.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const updateUserValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['customer', 'corporate_admin', 'super_admin'])
    .withMessage('Valid role is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be boolean')
];

// Protected routes - User profile management
router.use(protect);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', uploadMiddleware.avatar, updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);
router.get('/dashboard', getDashboardData);

// Admin routes - User management
router.get('/', admin, getUsers);
router.get('/:id', admin, getUserById);
router.put('/:id', admin, updateUserValidation, updateUser);
router.delete('/:id', admin, deleteUser);
router.patch('/:id/toggle-status', admin, toggleUserStatus);
router.get('/:id/activity', admin, getUserActivity);

module.exports = router;
