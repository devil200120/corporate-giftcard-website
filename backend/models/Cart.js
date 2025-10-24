const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedVariants: [{
    type: {
      type: String,
      enum: ['color', 'size', 'material', 'design', 'engraving', 'custom']
    },
    name: String,
    value: String,
    priceAdjustment: {
      type: Number,
      default: 0
    }
  }],
  customization: [{
    type: String,
    name: String,
    value: mongoose.Schema.Types.Mixed, // Can be string, number, or file URL
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  notes: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
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
    default: 0
  },
  appliedCoupons: [{
    code: String,
    discountAmount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }],
  corporateDiscount: {
    percentage: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // 30 days in seconds
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique products count
cartSchema.virtual('uniqueProducts').get(function() {
  return this.items.length;
});

// Method to calculate totals
cartSchema.methods.calculateTotals = function() {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => {
    const variantsCost = item.selectedVariants.reduce((sum, variant) => 
      sum + (variant.priceAdjustment || 0), 0
    );
    const customizationCost = item.customization.reduce((sum, custom) => 
      sum + (custom.additionalCost || 0), 0
    );
    
    const itemTotal = (item.unitPrice + variantsCost + customizationCost) * item.quantity;
    return total + itemTotal;
  }, 0);

  // Apply corporate discount
  if (this.corporateDiscount.percentage > 0) {
    this.corporateDiscount.amount = (this.subtotal * this.corporateDiscount.percentage) / 100;
  }

  // Calculate discount from coupons
  this.discountAmount = this.appliedCoupons.reduce((total, coupon) => 
    total + coupon.discountAmount, 0
  ) + this.corporateDiscount.amount;

  // Calculate tax (assuming 18% GST)
  const taxableAmount = this.subtotal - this.discountAmount;
  this.taxAmount = taxableAmount > 0 ? (taxableAmount * 0.18) : 0;

  // Calculate shipping (free shipping for orders above 1000)
  this.shippingAmount = (this.subtotal - this.discountAmount) >= 1000 ? 0 : 50;

  // Calculate total
  this.totalAmount = this.subtotal - this.discountAmount + this.taxAmount + this.shippingAmount;

  // Ensure totals are not negative
  this.totalAmount = Math.max(0, this.totalAmount);
  this.taxAmount = Math.max(0, this.taxAmount);
};

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, variants, customization, unitPrice) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(variants) &&
    JSON.stringify(item.customization) === JSON.stringify(customization)
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const variantsCost = variants.reduce((sum, variant) => 
      sum + (variant.priceAdjustment || 0), 0
    );
    const customizationCost = customization.reduce((sum, custom) => 
      sum + (custom.additionalCost || 0), 0
    );
    
    this.items.push({
      product: productId,
      quantity,
      selectedVariants: variants,
      customization,
      unitPrice,
      totalPrice: (unitPrice + variantsCost + customizationCost) * quantity
    });
  }

  this.calculateTotals();
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  this.calculateTotals();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    
    item.quantity = quantity;
    const variantsCost = item.selectedVariants.reduce((sum, variant) => 
      sum + (variant.priceAdjustment || 0), 0
    );
    const customizationCost = item.customization.reduce((sum, custom) => 
      sum + (custom.additionalCost || 0), 0
    );
    
    item.totalPrice = (item.unitPrice + variantsCost + customizationCost) * quantity;
    this.calculateTotals();
  }
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.subtotal = 0;
  this.taxAmount = 0;
  this.shippingAmount = 0;
  this.discountAmount = 0;
  this.totalAmount = 0;
  this.appliedCoupons = [];
  this.corporateDiscount = { percentage: 0, amount: 0 };
  return this.save();
};

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('appliedCoupons') || this.isModified('corporateDiscount')) {
    this.calculateTotals();
  }
  next();
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
cartSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Cart', cartSchema);