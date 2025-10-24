const express = require('express');
const { body } = require('express-validator');
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  bulkCreateCoupons,
  getCouponUsage,
  exportCoupons
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Coupon validation middleware
const createCouponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('Coupon code can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('discountType')
    .isIn(['percentage', 'fixed_amount', 'free_shipping'])
    .withMessage('Valid discount type is required'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumOrderValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a positive number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('validFrom')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid end date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('usageLimitPerUser')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit per user must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be boolean'),
  body('applicableCategories')
    .optional()
    .isArray()
    .withMessage('Applicable categories must be an array'),
  body('applicableProducts')
    .optional()
    .isArray()
    .withMessage('Applicable products must be an array'),
  body('excludedCategories')
    .optional()
    .isArray()
    .withMessage('Excluded categories must be an array'),
  body('excludedProducts')
    .optional()
    .isArray()
    .withMessage('Excluded products must be an array'),
  body('userTypes')
    .optional()
    .isArray()
    .withMessage('User types must be an array'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateCouponValidation = [
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('Coupon code can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed_amount', 'free_shipping'])
    .withMessage('Valid discount type is required'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumOrderValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a positive number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required')
    .custom((value, { req }) => {
      if (req.body.validFrom && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('usageLimitPerUser')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit per user must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be boolean'),
  body('applicableCategories')
    .optional()
    .isArray()
    .withMessage('Applicable categories must be an array'),
  body('applicableProducts')
    .optional()
    .isArray()
    .withMessage('Applicable products must be an array'),
  body('excludedCategories')
    .optional()
    .isArray()
    .withMessage('Excluded categories must be an array'),
  body('excludedProducts')
    .optional()
    .isArray()
    .withMessage('Excluded products must be an array'),
  body('userTypes')
    .optional()
    .isArray()
    .withMessage('User types must be an array'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const bulkCreateValidation = [
  body('template')
    .notEmpty()
    .withMessage('Coupon template is required'),
  body('template.codePrefix')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Code prefix must be between 1 and 10 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('Code prefix can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('template.discountType')
    .isIn(['percentage', 'fixed_amount', 'free_shipping'])
    .withMessage('Valid discount type is required'),
  body('template.discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('count')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Count must be between 1 and 1000'),
  body('codeLength')
    .optional()
    .isInt({ min: 6, max: 15 })
    .withMessage('Code length must be between 6 and 15 characters')
];

const validateCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required'),
  body('orderValue')
    .isFloat({ min: 0 })
    .withMessage('Order value must be a positive number'),
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array')
];

// Public routes for coupon validation
router.post('/validate', validateCouponValidation, validateCoupon);

// Protected admin routes
router.use(protect);
router.use(admin);

// Admin coupon management
router.get('/', getCoupons);
router.post('/', createCouponValidation, createCoupon);
router.get('/export', exportCoupons);
router.post('/bulk', bulkCreateValidation, bulkCreateCoupons);
router.get('/:id', getCoupon);
router.put('/:id', updateCouponValidation, updateCoupon);
router.delete('/:id', deleteCoupon);
router.get('/:id/usage', getCouponUsage);

module.exports = router;