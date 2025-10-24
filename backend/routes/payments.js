const express = require('express');
const { body } = require('express-validator');
const {
  createStripePaymentIntent,
  confirmStripePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentMethods,
  processRefund,
  getPaymentHistory,
  handleStripeWebhook
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment validation middleware
const paymentIntentValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Valid amount is required'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'INR', 'GBP'])
    .withMessage('Valid currency is required'),
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Valid order ID is required')
];

const confirmPaymentValidation = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Valid order ID is required')
];

const razorpayOrderValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Valid amount is required'),
  body('currency')
    .optional()
    .isIn(['INR'])
    .withMessage('Valid currency is required'),
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Valid order ID is required')
];

const razorpayVerifyValidation = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Valid order ID is required')
];

const refundValidation = [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .optional()
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Valid refund amount is required'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Refund reason cannot exceed 500 characters')
];

// Public routes
router.get('/methods', getPaymentMethods);

// Webhook routes (no authentication required)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.use(protect);

// Stripe routes
router.post('/stripe/create-intent', paymentIntentValidation, createStripePaymentIntent);
router.post('/stripe/confirm', confirmPaymentValidation, confirmStripePayment);

// Razorpay routes
router.post('/razorpay/create-order', razorpayOrderValidation, createRazorpayOrder);
router.post('/razorpay/verify', razorpayVerifyValidation, verifyRazorpayPayment);

// Payment history
router.get('/history', getPaymentHistory);

// Admin routes
router.post('/refund', admin, refundValidation, processRefund);

module.exports = router;
