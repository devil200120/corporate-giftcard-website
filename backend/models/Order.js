const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    name: String,
    sku: String,
    images: [{
      url: String,
      alt: String
    }],
    category: String,
    brand: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedVariants: [{
    type: String,
    name: String,
    value: String,
    priceAdjustment: Number
  }],
  customization: [{
    type: String,
    name: String,
    value: mongoose.Schema.Types.Mixed,
    additionalCost: Number
  }],
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingInfo: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true }
});

const billingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  companyName: String,
  gstNumber: String,
  panNumber: String
});

const paymentInfoSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'cod', 'bank_transfer'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'payu', 'ccavenue']
  },
  transactionId: String,
  gatewayTransactionId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paidAmount: Number,
  refundedAmount: {
    type: Number,
    default: 0
  },
  paymentDate: Date,
  failureReason: String
});

const corporateInfoSchema = new mongoose.Schema({
  isCorporateOrder: {
    type: Boolean,
    default: false
  },
  companyName: String,
  companyEmail: String,
  contactPerson: String,
  department: String,
  purchaseOrderNumber: String,
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  specialInstructions: String,
  deliveryDate: Date,
  invoiceRequired: {
    type: Boolean,
    default: false
  },
  gstTreatment: {
    type: String,
    enum: ['igst', 'cgst_sgst', 'exempt'],
    default: 'igst'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  shippingAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Applied discounts and coupons
  appliedCoupons: [{
    code: String,
    discountAmount: Number,
    discountType: String
  }],
  corporateDiscount: {
    percentage: Number,
    amount: Number
  },
  
  // Addresses
  shippingAddress: shippingAddressSchema,
  billingAddress: billingAddressSchema,
  
  // Payment
  paymentInfo: paymentInfoSchema,
  
  // Corporate features
  corporateInfo: corporateInfoSchema,
  
  // Order status and tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  
  // Status history
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  
  // Shipping and delivery
  shippingInfo: {
    method: String,
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingCost: Number
  },
  
  // Dates
  expectedDeliveryDate: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  returnedAt: Date,
  
  // Additional information
  notes: String,
  adminNotes: String,
  
  // Invoice
  invoiceNumber: String,
  invoiceDate: Date,
  invoiceUrl: String,
  
  // Cancellation and returns
  cancellationReason: String,
  returnReason: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['not_applicable', 'pending', 'processing', 'completed', 'failed'],
    default: 'not_applicable'
  },
  
  // Feedback and reviews
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  customerFeedback: String,
  
  // Flags
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  isPriority: {
    type: Boolean,
    default: false
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the latest order for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const latestOrder = await this.constructor.findOne({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    }).sort({ createdAt: -1 });
    
    let sequenceNumber = 1;
    if (latestOrder && latestOrder.orderNumber) {
      const lastSequence = parseInt(latestOrder.orderNumber.substr(-4));
      sequenceNumber = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequenceNumber.toString().padStart(4, '0')}`;
  }
  
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      updatedBy: this.updatedBy
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, notes, updatedBy) {
  this.status = newStatus;
  this.updatedBy = updatedBy;
  
  // Update specific date fields based on status
  switch (newStatus) {
    case 'delivered':
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
    case 'returned':
      this.returnedAt = new Date();
      break;
  }
  
  this.statusHistory.push({
    status: newStatus,
    date: new Date(),
    notes,
    updatedBy
  });
  
  return this.save();
};

// Method to calculate refund amount
orderSchema.methods.calculateRefundAmount = function() {
  let refundAmount = this.totalAmount;
  
  // Deduct shipping if order is not delivered
  if (this.status !== 'delivered') {
    refundAmount -= this.shippingAmount;
  }
  
  // Apply cancellation charges if applicable
  const orderAge = this.orderAge;
  if (orderAge > 1) {
    // 10% cancellation charge after 24 hours
    refundAmount *= 0.9;
  }
  
  return Math.max(0, refundAmount);
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ]);
};

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'corporateInfo.isCorporateOrder': 1 });
orderSchema.index({ 'corporateInfo.companyName': 1 });
orderSchema.index({ 'paymentInfo.paymentStatus': 1 });
orderSchema.index({ expectedDeliveryDate: 1 });

module.exports = mongoose.model('Order', orderSchema);