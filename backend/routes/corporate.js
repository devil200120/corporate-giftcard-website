const express = require('express');
const { body } = require('express-validator');
const {
  getCorporateDashboard,
  getCompanyEmployees,
  getCompanyOrders,
  approveOrder,
  getSpendingReports,
  updateCorporateSettings,
  sendEmployeeNotification
} = require('../controllers/corporateController');
const { protect, corporateAdmin, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Notification validation middleware
const notificationValidation = [
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('targetDepartments')
    .optional()
    .isArray()
    .withMessage('Target departments must be an array'),
  body('targetEmployees')
    .optional()
    .isArray()
    .withMessage('Target employees must be an array')
];

const approveOrderValidation = [
  body('approved')
    .isBoolean()
    .withMessage('Approved status is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const settingsValidation = [
  body('approvalRequired')
    .optional()
    .isBoolean()
    .withMessage('Approval required must be boolean'),
  body('budgetLimits')
    .optional()
    .isObject()
    .withMessage('Budget limits must be an object'),
  body('budgetLimits.monthly')
    .optional()
    .isNumeric()
    .withMessage('Monthly budget limit must be a number'),
  body('budgetLimits.perOrder')
    .optional()
    .isNumeric()
    .withMessage('Per order budget limit must be a number'),
  body('allowedCategories')
    .optional()
    .isArray()
    .withMessage('Allowed categories must be an array'),
  body('notifications')
    .optional()
    .isObject()
    .withMessage('Notifications settings must be an object')
];

// All corporate routes require authentication
router.use(protect);

// Corporate admin routes
router.get('/dashboard', corporateAdmin, getCorporateDashboard);
router.get('/employees', corporateAdmin, getCompanyEmployees);
router.get('/orders', corporateAdmin, getCompanyOrders);
router.patch('/orders/:id/approve', corporateAdmin, approveOrderValidation, approveOrder);
router.get('/reports/spending', corporateAdmin, getSpendingReports);
router.put('/settings', corporateAdmin, settingsValidation, updateCorporateSettings);
router.post('/notify', corporateAdmin, notificationValidation, sendEmployeeNotification);

module.exports = router;
