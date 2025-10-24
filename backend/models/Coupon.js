const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    maxlength: [100, 'Coupon name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maximumDiscountAmount: {
    type: Number,
    default: null
  },
  usageLimit: {
    total: {
      type: Number,
      default: null // null means unlimited
    },
    perUser: {
      type: Number,
      default: 1
    }
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  applicableToUsers: {
    type: String,
    enum: ['all', 'new_users', 'existing_users', 'corporate_only', 'specific_users'],
    default: 'all'
  },
  specificUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  applicableToProducts: {
    type: String,
    enum: ['all', 'specific_products', 'specific_categories'],
    default: 'all'
  },
  specificProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  specificCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  excludeProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  excludeCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isAutoApply: {
    type: Boolean,
    default: false
  },
  stackable: {
    type: Boolean,
    default: false
  },
  corporateOnly: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return this.validUntil < new Date();
});

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.validFrom <= now && 
         this.validUntil >= now &&
         (this.usageLimit.total === null || this.usedCount < this.usageLimit.total);
});

// Method to check if coupon is applicable to user
couponSchema.methods.isApplicableToUser = function(userId, isNewUser, isCorporateUser) {
  switch (this.applicableToUsers) {
    case 'new_users':
      return isNewUser;
    case 'existing_users':
      return !isNewUser;
    case 'corporate_only':
      return isCorporateUser;
    case 'specific_users':
      return this.specificUsers.includes(userId);
    case 'all':
    default:
      return true;
  }
};

// Method to check if coupon is applicable to products
couponSchema.methods.isApplicableToProducts = function(productIds, categoryIds) {
  // Check if any products are excluded
  const hasExcludedProducts = this.excludeProducts.some(excludedId => 
    productIds.some(productId => productId.toString() === excludedId.toString())
  );
  
  const hasExcludedCategories = this.excludeCategories.some(excludedCatId => 
    categoryIds.some(catId => catId.toString() === excludedCatId.toString())
  );
  
  if (hasExcludedProducts || hasExcludedCategories) {
    return false;
  }
  
  // Check applicability
  switch (this.applicableToProducts) {
    case 'specific_products':
      return this.specificProducts.some(specificId => 
        productIds.some(productId => productId.toString() === specificId.toString())
      );
    case 'specific_categories':
      return this.specificCategories.some(specificCatId => 
        categoryIds.some(catId => catId.toString() === specificCatId.toString())
      );
    case 'all':
    default:
      return true;
  }
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(subtotal, items) {
  if (!this.isValid) return 0;
  
  let discountAmount = 0;
  
  switch (this.type) {
    case 'percentage':
      discountAmount = (subtotal * this.value) / 100;
      if (this.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, this.maximumDiscountAmount);
      }
      break;
    case 'fixed':
      discountAmount = this.value;
      break;
    case 'free_shipping':
      // This should be handled in shipping calculation
      discountAmount = 0;
      break;
    case 'buy_x_get_y':
      // Implement buy X get Y logic based on items
      // This is a simplified version - you might need more complex logic
      const eligibleQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const freeItems = Math.floor(eligibleQuantity / (this.value + 1));
      // Calculate discount based on cheapest items
      // This is a basic implementation
      discountAmount = 0;
      break;
  }
  
  return Math.min(discountAmount, subtotal);
};

// Method to increment usage count
couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ corporateOnly: 1 });
couponSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Coupon', couponSchema);