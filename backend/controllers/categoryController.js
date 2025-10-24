const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const { createError } = require('../utils/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      parent,
      active = true,
      withProducts = false,
      featured = false
    } = req.query;

    // Build filter
    let filter = {};
    
    if (active !== 'all') {
      filter.isActive = active === 'true';
    }
    
    if (parent) {
      filter.parent = parent === 'null' ? null : parent;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    let query = Category.find(filter)
      .populate('parent', 'name slug')
      .sort({ order: 1, name: 1 });

    // Add product count if requested
    if (withProducts === 'true') {
      query = query.lean();
    }

    if (page && limit) {
      query = query
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    let categories = await query;

    // Add product counts and subcategories
    if (withProducts === 'true') {
      categories = await Promise.all(categories.map(async (category) => {
        // Get product count
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true
        });

        // Get subcategories
        const subcategories = await Category.find({
          parent: category._id,
          isActive: true
        }).select('name slug').lean();

        return {
          ...category,
          productCount,
          subcategories
        };
      }));
    }

    const total = await Category.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: page && limit ? {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      } : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category tree structure
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = async (req, res, next) => {
  try {
    const { active = true } = req.query;

    let filter = {};
    if (active !== 'all') {
      filter.isActive = active === 'true';
    }

    // Get all categories
    const allCategories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean();

    // Build tree structure
    const categoryMap = {};
    const rootCategories = [];

    // Create category map
    allCategories.forEach(category => {
      categoryMap[category._id] = {
        ...category,
        children: []
      };
    });

    // Build tree
    allCategories.forEach(category => {
      if (category.parent) {
        const parent = categoryMap[category.parent];
        if (parent) {
          parent.children.push(categoryMap[category._id]);
        }
      } else {
        rootCategories.push(categoryMap[category._id]);
      }
    });

    res.status(200).json({
      success: true,
      data: rootCategories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Handle both ID and slug
    let filter;
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: id };
    } else {
      filter = { slug: id };
    }

    const category = await Category.findOne(filter)
      .populate('parent', 'name slug description')
      .lean();

    if (!category) {
      return next(createError('Category not found', 404));
    }

    // Get subcategories
    const subcategories = await Category.find({
      parent: category._id,
      isActive: true
    }).select('name slug description image').lean();

    // Get product count
    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true
    });

    // Get breadcrumb
    const breadcrumb = [];
    let currentCategory = category;
    
    while (currentCategory.parent) {
      const parent = await Category.findById(currentCategory.parent)
        .select('name slug parent')
        .lean();
      if (parent) {
        breadcrumb.unshift(parent);
        currentCategory = parent;
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...category,
        subcategories,
        productCount,
        breadcrumb
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    let categoryData = { ...req.body };

    // Handle file upload for category image
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');
      categoryData.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      };
    }

    // Validate parent category if provided
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return next(createError('Parent category not found', 404));
      }
      
      // Calculate depth
      let depth = 1;
      let currentParent = parentCategory;
      while (currentParent.parent && depth < 5) { // Max 5 levels
        currentParent = await Category.findById(currentParent.parent);
        depth++;
      }
      
      if (depth >= 5) {
        return next(createError('Maximum category depth exceeded', 400));
      }
    }

    const category = await Category.create(categoryData);
    
    await category.populate('parent', 'name slug');

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Category with this name or slug already exists', 400));
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    let category = await Category.findById(id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    let updateData = { ...req.body };

    // Handle parent category change
    if (updateData.parent !== undefined) {
      if (updateData.parent) {
        // Check if trying to set self as parent
        if (updateData.parent === id) {
          return next(createError('Category cannot be its own parent', 400));
        }

        // Check if trying to set a child as parent (circular reference)
        const isChildCategory = await isChildOf(id, updateData.parent);
        if (isChildCategory) {
          return next(createError('Cannot set a child category as parent', 400));
        }

        // Validate parent exists
        const parentCategory = await Category.findById(updateData.parent);
        if (!parentCategory) {
          return next(createError('Parent category not found', 404));
        }
      }
    }

    // Handle file upload
    if (req.file) {
      // Delete old image if exists
      if (category.image && category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');
      updateData.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      };
    }

    category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Category with this name or slug already exists', 400));
    }
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    const category = await Category.findById(id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parent: id });
    if (subcategoriesCount > 0) {
      return next(createError('Cannot delete category with subcategories', 400));
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return next(createError('Cannot delete category with products', 400));
    }

    // Delete image from Cloudinary
    if (category.image && category.image.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products in category
// @route   GET /api/categories/:id/products
// @access  Public
const getCategoryProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      inStock,
      featured,
      includeSubcategories = true
    } = req.query;

    // Handle both ID and slug
    let filter;
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: id };
    } else {
      filter = { slug: id };
    }

    const category = await Category.findOne(filter);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    // Build product filter
    let categoryIds = [category._id];

    // Include subcategories if requested
    if (includeSubcategories === 'true') {
      const subcategories = await Category.find({ parent: category._id });
      categoryIds.push(...subcategories.map(sub => sub._id));
    }

    let productFilter = {
      category: { $in: categoryIds },
      isActive: true
    };

    // Apply additional filters
    if (minPrice || maxPrice) {
      productFilter['price.regular'] = {};
      if (minPrice) productFilter['price.regular'].$gte = parseFloat(minPrice);
      if (maxPrice) productFilter['price.regular'].$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      productFilter['inventory.stockQuantity'] = { $gt: 0 };
    }

    if (featured === 'true') {
      productFilter.isFeatured = true;
    }

    const products = await Product.find(productFilter)
      .populate('category', 'name slug')
      .select('-reviews')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Product.countDocuments(productFilter);

    res.status(200).json({
      success: true,
      data: {
        category: {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description
        },
        products
      },
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

// @desc    Reorder categories
// @route   PATCH /api/categories/reorder
// @access  Private/Admin
const reorderCategories = async (req, res, next) => {
  try {
    const { categoryOrders } = req.body;

    if (!Array.isArray(categoryOrders)) {
      return next(createError('Category orders must be an array', 400));
    }

    // Validate and update orders
    const updatePromises = categoryOrders.map(({ id, order }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid category ID: ${id}`);
      }
      return Category.findByIdAndUpdate(id, { order: parseInt(order) });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const categories = await Category.find({
      isActive: true,
      isFeatured: true
    })
    .select('name slug description image')
    .sort({ featuredOrder: 1, order: 1 })
    .limit(parseInt(limit))
    .lean();

    // Add product counts
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true
        });
        return { ...category, productCount };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload category image
// @route   POST /api/categories/:id/image
// @access  Private/Admin
const uploadCategoryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    const category = await Category.findById(id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    if (!req.file) {
      return next(createError('No image file provided', 400));
    }

    // Delete old image if exists
    if (category.image && category.image.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    // Upload new image
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');

    // Update category with new image
    category.image = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };

    await category.save();

    res.status(200).json({
      success: true,
      data: {
        image: category.image
      },
      message: 'Category image uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check if category is a child of another category
const isChildOf = async (categoryId, potentialParentId) => {
  const category = await Category.findById(categoryId);
  if (!category || !category.parent) {
    return false;
  }
  
  if (category.parent.toString() === potentialParentId) {
    return true;
  }
  
  return isChildOf(category.parent, potentialParentId);
};

module.exports = {
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  reorderCategories,
  getFeaturedCategories,
  uploadCategoryImage
};