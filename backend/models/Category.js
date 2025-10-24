const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    public_id: String,
    url: String
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  corporateCategory: {
    type: Boolean,
    default: false
  },
  minBulkQuantity: {
    type: Number,
    default: 1
  },
  bulkDiscountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
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

// Pre-save middleware to set level based on parent
categorySchema.pre('save', async function(next) {
  if (this.parent) {
    try {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function(parentId = null) {
  const categories = await this.find({ 
    parent: parentId, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });

  const categoryTree = [];
  
  for (const category of categories) {
    const categoryObj = category.toObject();
    categoryObj.children = await this.getCategoryTree(category._id);
    categoryTree.push(categoryObj);
  }
  
  return categoryTree;
};

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ corporateCategory: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);