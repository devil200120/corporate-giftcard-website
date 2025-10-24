const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
const createStripePaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd', orderId, metadata = {} } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Valid amount is required');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || '',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500);
    throw new Error('Failed to create payment intent');
  }
});

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
const confirmStripePayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId) {
    res.status(400);
    throw new Error('Payment intent ID is required');
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment not successful');
    }

    // Update order if orderId is provided
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentMethod = 'stripe';
        order.paymentDetails = {
          paymentIntentId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paidAt: new Date()
        };
        await order.save();

        // Send payment confirmation email
        const user = await User.findById(order.customer);
        if (user) {
          await sendEmail({
            email: user.email,
            subject: `Payment Confirmation - Order #${order.orderNumber}`,
            message: `Your payment of ${paymentIntent.currency.toUpperCase()} ${paymentIntent.amount / 100} for order #${order.orderNumber} has been successfully processed.`
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentIntentId,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    res.status(500);
    throw new Error('Failed to confirm payment');
  }
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', orderId, notes = {} } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Valid amount is required');
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency.toUpperCase(),
      receipt: `order_${orderId || Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        orderId: orderId || '',
        ...notes
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing payment verification parameters');
  }

  try {
    // Verify signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      res.status(400);
      throw new Error('Payment not captured');
    }

    // Update order if orderId is provided
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentMethod = 'razorpay';
        order.paymentDetails = {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          paidAt: new Date()
        };
        await order.save();

        // Send payment confirmation email
        const user = await User.findById(order.customer);
        if (user) {
          await sendEmail({
            email: user.email,
            subject: `Payment Confirmation - Order #${order.orderNumber}`,
            message: `Your payment of ${payment.currency.toUpperCase()} ${payment.amount / 100} for order #${order.orderNumber} has been successfully processed.`
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency
      }
    });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(500);
    throw new Error('Failed to verify payment');
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  const methods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      enabled: !!process.env.STRIPE_SECRET_KEY,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
      fees: {
        percentage: 2.9,
        fixed: 0.30
      }
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay with UPI, Net Banking, Cards, and Wallets',
      enabled: !!process.env.RAZORPAY_KEY_ID,
      supportedCurrencies: ['INR'],
      fees: {
        percentage: 2.0,
        fixed: 0
      }
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer for corporate orders',
      enabled: true,
      supportedCurrencies: ['USD', 'EUR', 'INR'],
      fees: {
        percentage: 0,
        fixed: 0
      }
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      enabled: true,
      supportedCurrencies: ['INR'],
      fees: {
        percentage: 0,
        fixed: 25
      }
    }
  ];

  // Filter based on user preferences or order type
  const availableMethods = methods.filter(method => method.enabled);

  res.json({
    success: true,
    data: availableMethods
  });
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
const processRefund = asyncHandler(async (req, res) => {
  const { orderId, amount, reason } = req.body;

  const order = await Order.findById(orderId).populate('customer', 'email firstName lastName');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus !== 'paid') {
    res.status(400);
    throw new Error('Order payment is not in paid status');
  }

  const refundAmount = amount || order.totalAmount;

  try {
    let refundResult;

    if (order.paymentMethod === 'stripe' && order.paymentDetails.paymentIntentId) {
      // Process Stripe refund
      refundResult = await stripe.refunds.create({
        payment_intent: order.paymentDetails.paymentIntentId,
        amount: Math.round(refundAmount * 100),
        reason: 'requested_by_customer'
      });

      order.refundDetails = {
        refundId: refundResult.id,
        amount: refundAmount,
        status: refundResult.status,
        processedAt: new Date(),
        reason
      };
    } else if (order.paymentMethod === 'razorpay' && order.paymentDetails.razorpayPaymentId) {
      // Process Razorpay refund
      refundResult = await razorpay.payments.refund(order.paymentDetails.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: {
          reason,
          refundedBy: req.user._id.toString()
        }
      });

      order.refundDetails = {
        refundId: refundResult.id,
        amount: refundAmount,
        status: refundResult.status,
        processedAt: new Date(),
        reason
      };
    } else {
      // Manual refund for other payment methods
      order.refundDetails = {
        amount: refundAmount,
        status: 'manual_processing',
        processedAt: new Date(),
        reason,
        processedBy: req.user._id
      };
    }

    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    // Send refund notification email
    await sendEmail({
      email: order.customer.email,
      subject: `Refund Processed - Order #${order.orderNumber}`,
      message: `Your refund of ${refundAmount} for order #${order.orderNumber} has been processed. ${reason ? 'Reason: ' + reason : ''}`
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        orderId: order._id,
        refundAmount,
        status: order.refundDetails.status,
        refundId: order.refundDetails.refundId
      }
    });
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500);
    throw new Error('Failed to process refund');
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { customer: req.user._id };

  // Filter by payment status
  if (req.query.status) {
    filter.paymentStatus = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const orders = await Order.find(filter)
    .select('orderNumber totalAmount paymentStatus paymentMethod paymentDetails refundDetails createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
});

// @desc    Webhook handler for Stripe
// @route   POST /api/payments/stripe/webhook
// @access  Public
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = {
  createStripePaymentIntent,
  confirmStripePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentMethods,
  processRefund,
  getPaymentHistory,
  handleStripeWebhook
};