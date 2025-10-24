const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  corporateRegistration,
  approveCorporateAccount
} = require('../controllers/authController');
const { 
  protect, 
  admin, 
  corporateAdmin,
  sensitiveOperation,
  emailVerified 
} = require('../middleware/authMiddleware');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

// Corporate registration
router.post('/corporate/register', registerValidation, corporateRegistration);

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadMiddleware.avatar, updateProfile);
router.put('/change-password', protect, changePasswordValidation, sensitiveOperation, changePassword);
router.post('/resend-verification', protect, resendVerificationEmail);

// Admin routes for corporate account management
router.put('/corporate/approve/:userId', protect, admin, approveCorporateAccount);

module.exports = router;