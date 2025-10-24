const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderInvoice,
  trackOrder,
  getAdminOrders,
  approveCorporateOrder
} = require('../controllers/orderController');
const { protect, admin, corporateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Order validation middleware
const createOrderValidation = [
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  body('shippingAddress.zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  body('shippingAddress.country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'])
    .withMessage('Valid payment method is required'),
  body('specialInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special instructions cannot exceed 500 characters'),
  body('isCorporateOrder')
    .optional()
    .isBoolean()
    .withMessage('Corporate order flag must be boolean'),
  body('corporateDetails.purchaseOrderNumber')
    .if(body('isCorporateOrder').equals(true))
    .notEmpty()
    .withMessage('Purchase order number is required for corporate orders'),
  body('corporateDetails.department')
    .if(body('isCorporateOrder').equals(true))
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters'),
  body('corporateDetails.budgetCode')
    .if(body('isCorporateOrder').equals(true))
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Budget code cannot exceed 50 characters')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Valid status is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
  body('carrier')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Carrier name cannot exceed 50 characters')
];

const cancelOrderValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot exceed 500 characters')
];

const approveOrderValidation = [
  body('approved')
    .isBoolean()
    .withMessage('Approved flag is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Approval notes cannot exceed 500 characters')
];

// Public routes
router.get('/track', trackOrder);

// Protected routes
router.use(protect);

// Customer order routes
router.get('/', getOrders);
router.post('/', createOrderValidation, createOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrderValidation, cancelOrder);
router.get('/:id/invoice', getOrderInvoice);

// Corporate admin routes
router.patch('/:id/approve', corporateAdmin, approveOrderValidation, approveCorporateOrder);

// Admin routes
router.get('/admin/all', admin, getAdminOrders);
router.patch('/:id/status', admin, updateStatusValidation, updateOrderStatus);

module.exports = router;