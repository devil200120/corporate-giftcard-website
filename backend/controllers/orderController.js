const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');
const { createError } = require('../utils/errorHandler');
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require('../utils/emailService');
const { generateInvoice } = require('../utils/invoiceGenerator');
const mongoose = require('mongoose');

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    let filter = { user: req.user.id };
    
    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('items.product', 'name sku images price')
      .populate('shippingAddress.user', 'firstName lastName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name sku images price category')
      .populate('corporateDetails.approvedBy', 'firstName lastName email')
      .populate('corporateDetails.requestedBy', 'firstName lastName email');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return next(createError('Not authorized to access this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const {
      shippingAddress,
      paymentMethod,
      specialInstructions,
      isCorporateOrder = false,
      corporateDetails = {}
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name sku price inventory bulkPricing');

    if (!cart || cart.items.length === 0) {
      return next(createError('Cart is empty', 400));
    }

    // Validate stock availability and calculate totals
    let orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return next(createError(`Product ${item.product?.name || 'unknown'} is no longer available`, 400));
      }

      if (item.product.inventory.stockQuantity < item.quantity) {
        return next(createError(
          `Insufficient stock for ${item.product.name}. Only ${item.product.inventory.stockQuantity} available`,
          400
        ));
      }

      // Calculate price (considering bulk pricing)
      let unitPrice = item.product.price.regular;
      
      if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
        const applicableBulkPrice = item.product.bulkPricing
          .sort((a, b) => b.minQuantity - a.minQuantity)
          .find(bulk => item.quantity >= bulk.minQuantity);
        
        if (applicableBulkPrice) {
          unitPrice = applicableBulkPrice.price;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: unitPrice,
        total: itemTotal,
        customization: item.customization
      });
    }

    // Apply coupon discount if present
    let discount = 0;
    let appliedCoupon = null;
    
    if (cart.appliedCoupon) {
      const coupon = await Coupon.findOne({ 
        code: cart.appliedCoupon.code,
        isActive: true 
      });
      
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min(
            (subtotal * coupon.discountValue) / 100,
            coupon.maxDiscount || Infinity
          );
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        
        appliedCoupon = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: discount
        };
      }
    }

    // Calculate taxes and total
    const taxRate = 0.08; // 8% tax rate
    const taxAmount = (subtotal - discount) * taxRate;
    const shippingCost = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal - discount + taxAmount + shippingCost;

    // Create order
    const orderData = {
      user: req.user.id,
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      specialInstructions,
      pricing: {
        subtotal,
        discount,
        taxAmount,
        shippingCost,
        total
      },
      appliedCoupon,
      status: 'pending',
      isCorporateOrder,
      corporateDetails: isCorporateOrder ? {
        ...corporateDetails,
        requestedBy: req.user.id,
        status: 'pending_approval'
      } : undefined
    };

    const order = await Order.create(orderData);

    // Update product inventory and coupon usage
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Update inventory
        for (const item of cart.items) {
          await Product.findByIdAndUpdate(
            item.product._id,
            { $inc: { 'inventory.stockQuantity': -item.quantity } },
            { session }
          );
        }

        // Update coupon usage
        if (appliedCoupon) {
          await Coupon.findOneAndUpdate(
            { code: appliedCoupon.code },
            { 
              $inc: { usedCount: 1 },
              $push: { 
                usedBy: { 
                  user: req.user.id, 
                  orderId: order._id, 
                  usedAt: new Date() 
                }
              }
            },
            { session }
          );
        }

        // Clear cart
        await Cart.findOneAndUpdate(
          { user: req.user.id },
          { $set: { items: [], appliedCoupon: undefined } },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(req.user.email, order);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    // Populate order for response
    await order.populate([
      { path: 'items.product', select: 'name sku images' },
      { path: 'user', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin/Corporate
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, trackingNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id).populate('user', 'email firstName lastName');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Check authorization
    const canUpdate = req.user.role === 'super_admin' || 
                     (order.isCorporateOrder && req.user.role === 'corporate_admin');

    if (!canUpdate) {
      return next(createError('Not authorized to update order status', 403));
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(createError('Invalid status', 400));
    }

    // Update order
    order.status = status;
    if (notes) {
      order.statusHistory.push({
        status,
        notes,
        updatedBy: req.user.id,
        timestamp: new Date()
      });
    }

    if (trackingNumber) {
      order.tracking.trackingNumber = trackingNumber;
      order.tracking.carrier = req.body.carrier || order.tracking.carrier;
    }

    // Set timestamps based on status
    switch (status) {
      case 'confirmed':
        order.timestamps.confirmed = new Date();
        break;
      case 'processing':
        order.timestamps.processing = new Date();
        break;
      case 'shipped':
        order.timestamps.shipped = new Date();
        break;
      case 'delivered':
        order.timestamps.delivered = new Date();
        break;
      case 'cancelled':
        order.timestamps.cancelled = new Date();
        // Restore inventory
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { 'inventory.stockQuantity': item.quantity } }
          );
        }
        break;
    }

    await order.save();

    // Send status update email
    try {
      await sendOrderStatusEmail(order.user.email, order);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id);

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return next(createError('Not authorized to cancel this order', 403));
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return next(createError('Order cannot be cancelled at this stage', 400));
    }

    // Update order status
    order.status = 'cancelled';
    order.timestamps.cancelled = new Date();
    order.statusHistory.push({
      status: 'cancelled',
      notes: reason || 'Cancelled by customer',
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { 'inventory.stockQuantity': item.quantity } }
      );
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
const getOrderInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name sku')
      .populate('corporateDetails.approvedBy', 'firstName lastName');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Check authorization
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return next(createError('Not authorized to access this invoice', 403));
    }

    // Generate invoice PDF
    const invoiceBuffer = await generateInvoice(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);
    res.send(invoiceBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Track order
// @route   GET /api/orders/:id/track
// @access  Public (with order number and email)
const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.query;

    if (!orderNumber || !email) {
      return next(createError('Order number and email are required', 400));
    }

    const order = await Order.findOne({ orderNumber })
      .populate('user', 'email')
      .select('orderNumber status tracking timestamps statusHistory createdAt');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Verify email matches
    if (order.user.email.toLowerCase() !== email.toLowerCase()) {
      return next(createError('Invalid order details', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        tracking: order.tracking,
        timestamps: order.timestamps,
        statusHistory: order.statusHistory,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin orders (all orders)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      startDate,
      endDate,
      isCorporateOrder
    } = req.query;

    // Build filter
    let filter = {};
    
    if (status) filter.status = status;
    if (isCorporateOrder !== undefined) filter.isCorporateOrder = isCorporateOrder === 'true';
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.firstName': { $regex: search, $options: 'i' } },
        { 'user.lastName': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name sku')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    // Calculate analytics
    const analytics = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      },
      analytics: analytics[0] || {
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve corporate order
// @route   PATCH /api/orders/:id/approve
// @access  Private/Corporate Admin
const approveCorporateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id).populate('user', 'email firstName lastName');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    if (!order.isCorporateOrder) {
      return next(createError('This is not a corporate order', 400));
    }

    if (req.user.role !== 'corporate_admin' && req.user.role !== 'super_admin') {
      return next(createError('Not authorized to approve corporate orders', 403));
    }

    // Update corporate approval status
    order.corporateDetails.status = approved ? 'approved' : 'rejected';
    order.corporateDetails.approvedBy = req.user.id;
    order.corporateDetails.approvedAt = new Date();
    order.corporateDetails.approvalNotes = notes;

    // Update order status
    if (approved) {
      order.status = 'confirmed';
      order.timestamps.confirmed = new Date();
    } else {
      order.status = 'cancelled';
      order.timestamps.cancelled = new Date();
      
      // Restore inventory for rejected orders
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { 'inventory.stockQuantity': item.quantity } }
        );
      }
    }

    // Add to status history
    order.statusHistory.push({
      status: order.status,
      notes: `Corporate order ${approved ? 'approved' : 'rejected'}${notes ? ': ' + notes : ''}`,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await order.save();

    // Send notification email
    try {
      await sendOrderStatusEmail(order.user.email, order);
    } catch (emailError) {
      console.error('Failed to send approval notification email:', emailError);
    }

    res.status(200).json({
      success: true,
      data: order,
      message: `Corporate order ${approved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderInvoice,
  trackOrder,
  getAdminOrders,
  approveCorporateOrder
};