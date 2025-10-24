const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  name: {
    type: String,
    default: 'My Wishlist',
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total products count
wishlistSchema.virtual('totalProducts').get(function() {
  return this.products.length;
});

// Method to add product to wishlist
wishlistSchema.methods.addProduct = function(productId, notes, priority = 'medium') {
  const existingProduct = this.products.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingProduct) {
    // Update existing product
    existingProduct.notes = notes;
    existingProduct.priority = priority;
    existingProduct.addedAt = new Date();
  } else {
    // Add new product
    this.products.push({
      product: productId,
      notes,
      priority,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove product from wishlist
wishlistSchema.methods.removeProduct = function(productId) {
  this.products = this.products.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to check if product exists in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(item => 
    item.product.toString() === productId.toString()
  );
};

// Method to generate share token
wishlistSchema.methods.generateShareToken = function() {
  if (this.isPublic && !this.shareToken) {
    this.shareToken = require('crypto').randomBytes(16).toString('hex');
  }
  return this.save();
};

// Pre-save middleware to handle share token
wishlistSchema.pre('save', function(next) {
  if (this.isModified('isPublic')) {
    if (this.isPublic && !this.shareToken) {
      this.shareToken = require('crypto').randomBytes(16).toString('hex');
    } else if (!this.isPublic) {
      this.shareToken = undefined;
    }
  }
  next();
});

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'products.product': 1 });
wishlistSchema.index({ shareToken: 1 });
wishlistSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);