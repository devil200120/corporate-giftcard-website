const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['color', 'size', 'material', 'design', 'engraving', 'custom'],
    required: true
  },
  priceAdjustment: {
    type: Number,
    default: 0
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  image: {
    public_id: String,
    url: String
  }
});

const customizationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text_engraving', 'logo_printing', 'color_customization', 'size_customization', 'packaging'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  isRequired: {
    type: Boolean,
    default: false
  },
  options: [{
    name: String,
    value: String,
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  minLength: Number,
  maxLength: Number,
  allowedFormats: [String], // For file uploads
  additionalCost: {
    type: Number,
    default: 0
  }
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  images: [{
    public_id: String,
    url: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  price: {
    regular: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: 0
    },
    sale: {
      type: Number,
      min: 0
    },
    bulk: [{
      minQuantity: {
        type: Number,
        required: true,
        min: 1
      },
      maxQuantity: Number,
      price: {
        type: Number,
        required: true,
        min: 0
      },
      discountPercentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }]
  },
  inventory: {
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorders: {
      type: Boolean,
      default: false
    }
  },
  variants: [variantSchema],
  customization: [customizationSchema],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'mm'],
      default: 'cm'
    },
    weightUnit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'g'
    }
  },
  shipping: {
    isShippable: {
      type: Boolean,
      default: true
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'fragile', 'heavy', 'oversized'],
      default: 'standard'
    },
    freeShippingThreshold: Number,
    estimatedDeliveryDays: {
      min: {
        type: Number,
        default: 3
      },
      max: {
        type: Number,
        default: 7
      }
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  reviews: [reviewSchema],
  corporateFeatures: {
    isCorporateGift: {
      type: Boolean,
      default: true
    },
    minBulkOrder: {
      type: Number,
      default: 50
    },
    bulkDiscountAvailable: {
      type: Boolean,
      default: true
    },
    customBrandingAvailable: {
      type: Boolean,
      default: false
    },
    leadTimeInDays: {
      type: Number,
      default: 7
    },
    samplesAvailable: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.price.sale || this.price.regular;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.price.sale && this.price.sale < this.price.regular) {
    return Math.round(((this.price.regular - this.price.sale) / this.price.regular) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackQuantity) return 'in_stock';
  if (this.inventory.stockQuantity === 0) return 'out_of_stock';
  if (this.inventory.stockQuantity <= this.inventory.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Method to calculate bulk price
productSchema.methods.getBulkPrice = function(quantity) {
  if (!quantity || quantity < 1) return this.price.regular;
  
  // Find applicable bulk pricing tier
  const bulkTiers = this.price.bulk.sort((a, b) => a.minQuantity - b.minQuantity);
  let applicableTier = null;
  
  for (const tier of bulkTiers) {
    if (quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
      applicableTier = tier;
    }
  }
  
  return applicableTier ? applicableTier.price : this.discountedPrice;
};

// Method to update ratings
productSchema.methods.updateRatings = function() {
  const reviews = this.reviews.filter(review => review.isApproved);
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    this.ratings.distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    return;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  this.ratings.average = Math.round((sum / totalReviews) * 10) / 10;
  this.ratings.count = totalReviews;
  
  // Update distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    distribution[review.rating]++;
  });
  this.ratings.distribution = distribution;
};

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'price.regular': 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'corporateFeatures.isCorporateGift': 1 });
productSchema.index({ tags: 1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text',
  brand: 'text'
});

module.exports = mongoose.model('Product', productSchema);