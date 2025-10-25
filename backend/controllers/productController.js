const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { uploadToCloudinary, uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { createError } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      search,
      inStock,
      featured,
      bulkOnly,
      corporateOnly,
      tags,
      rating
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    // Category filter
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (categoryDoc) {
        // Include subcategories
        const subcategories = await Category.find({ parent: category });
        const categoryIds = [category, ...subcategories.map(sub => sub._id)];
        filter.category = { $in: categoryIds };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter['price.regular'] = {};
      if (minPrice) filter['price.regular'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.regular'].$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Stock filter
    if (inStock === 'true') {
      filter['inventory.stockQuantity'] = { $gt: 0 };
    }

    // Featured filter
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Bulk only filter
    if (bulkOnly === 'true') {
      filter['bulkPricing.0'] = { $exists: true };
    }

    // Corporate only filter
    if (corporateOnly === 'true') {
      filter.isCorporateOnly = true;
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagsArray };
    }

    // Rating filter
    if (rating) {
      filter.averageRating = { $gte: parseFloat(rating) };
    }

    // Execute query with population
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .select('-reviews') // Exclude reviews for performance
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id)
      .populate('category', 'name slug description')
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName avatar'
      });

    if (!product || !product.isActive) {
      return next(createError('Product not found', 404));
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    let productData = { ...req.body };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(file =>
        uploadBufferToCloudinary(file.buffer, { folder: 'products' })
      );

      const uploadResults = await Promise.all(imageUploadPromises);
      
      productData.images = uploadResults.map((result, index) => ({
        url: result.secure_url,
        public_id: result.public_id,
        alt: req.body.imageAlts?.[index] || productData.name,
        isMain: index === 0
      }));
    }

    // Set created by
    productData.createdBy = req.user.id;

    const product = await Product.create(productData);
    
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    let product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    let updateData = { ...req.body };

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(file =>
        uploadBufferToCloudinary(file.buffer, { folder: 'products' })
      );

      const uploadResults = await Promise.all(imageUploadPromises);
      
      const newImages = uploadResults.map((result, index) => ({
        url: result.secure_url,
        public_id: result.public_id,
        alt: req.body.imageAlts?.[index] || updateData.name || product.name,
        isMain: false
      }));

      // Append to existing images
      updateData.images = [...(product.images || []), ...newImages];
    }

    // Update modified fields
    updateData.updatedBy = req.user.id;
    updateData.updatedAt = new Date();

    product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(image =>
        deleteFromCloudinary(image.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Soft delete
    product.isActive = false;
    product.deletedAt = new Date();
    product.deletedBy = req.user.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id)
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName avatar'
      });

    if (!product) {
      return next(createError('Product not found', 404));
    }

    // Paginate reviews
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const reviews = product.reviews.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: product.reviews.length,
        totalPages: Math.ceil(product.reviews.length / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const { id } = req.params;
    const { rating, title, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return next(createError('You have already reviewed this product', 400));
    }

    // Add review
    const review = {
      user: req.user.id,
      rating,
      title,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.totalReviews = product.reviews.length;

    await product.save();

    await product.populate({
      path: 'reviews.user',
      select: 'firstName lastName avatar'
    });

    // Get the created review
    const createdReview = product.reviews[product.reviews.length - 1];

    res.status(201).json({
      success: true,
      data: createdReview,
      message: 'Review created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product review
// @route   PUT /api/products/reviews/:reviewId
// @access  Private
const updateProductReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const product = await Product.findOne({ 'reviews._id': reviewId });

    if (!product) {
      return next(createError('Review not found', 404));
    }

    const review = product.reviews.id(reviewId);

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return next(createError('Not authorized to update this review', 403));
    }

    // Update review
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.updatedAt = new Date();

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const product = await Product.findOne({ 'reviews._id': reviewId });

    if (!product) {
      return next(createError('Review not found', 404));
    }

    const review = product.reviews.id(reviewId);

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return next(createError('Not authorized to delete this review', 403));
    }

    // Remove review
    product.reviews.pull(reviewId);

    // Update average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }
    
    product.totalReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
const uploadProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    if (!req.files || req.files.length === 0) {
      return next(createError('No images provided', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, 'products')
    );

    const uploadResults = await Promise.all(imageUploadPromises);
    
    const newImages = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt: req.body.imageAlts?.[index] || product.name,
      isPrimary: false
    }));

    // Add to existing images
    product.images.push(...newImages);
    await product.save();

    res.status(200).json({
      success: true,
      data: newImages,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
const deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    const image = product.images.id(imageId);

    if (!image) {
      return next(createError('Image not found', 404));
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.public_id);

    // Remove from product
    product.images.pull(imageId);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bulk pricing for product
// @route   GET /api/products/:id/bulk-pricing
// @access  Public
const getBulkPricing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id).select('bulkPricing price');

    if (!product) {
      return next(createError('Product not found', 404));
    }

    let applicablePrice = product.price.regular;

    if (quantity && product.bulkPricing && product.bulkPricing.length > 0) {
      // Find applicable bulk pricing
      const sortedBulkPricing = product.bulkPricing.sort((a, b) => b.minQuantity - a.minQuantity);
      
      for (const bulkTier of sortedBulkPricing) {
        if (parseInt(quantity) >= bulkTier.minQuantity) {
          applicablePrice = bulkTier.price;
          break;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        regularPrice: product.price.regular,
        applicablePrice,
        quantity: quantity || 1,
        bulkPricing: product.bulkPricing || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin/Corporate
const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    let newQuantity;

    switch (operation) {
      case 'add':
        newQuantity = product.inventory.stockQuantity + parseInt(quantity);
        break;
      case 'subtract':
        newQuantity = Math.max(0, product.inventory.stockQuantity - parseInt(quantity));
        break;
      case 'set':
      default:
        newQuantity = parseInt(quantity);
        break;
    }

    product.inventory.stockQuantity = newQuantity;
    product.inventory.lowStockThreshold = req.body.lowStockThreshold || product.inventory.lowStockThreshold;
    
    await product.save();

    res.status(200).json({
      success: true,
      data: {
        stockQuantity: product.inventory.stockQuantity,
        lowStockThreshold: product.inventory.lowStockThreshold
      },
      message: 'Stock updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 8 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createError('Product not found', 404));
    }

    // Find related products by category and tags
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      isActive: true,
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ]
    })
    .populate('category', 'name slug')
    .select('-reviews -description')
    .limit(parseInt(limit))
    .lean();

    res.status(200).json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      sort = 'relevance',
      category,
      minPrice,
      maxPrice,
      inStock,
      rating
    } = req.query;

    if (!q || q.trim().length < 2) {
      return next(createError('Search query must be at least 2 characters long', 400));
    }

    // Build search filter
    let filter = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { sku: { $regex: q, $options: 'i' } }
      ]
    };

    // Apply additional filters
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter['price.regular'] = {};
      if (minPrice) filter['price.regular'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.regular'].$lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') filter['inventory.stockQuantity'] = { $gt: 0 };
    if (rating) filter.averageRating = { $gte: parseFloat(rating) };

    // Determine sort order
    let sortOrder;
    switch (sort) {
      case 'price_low':
        sortOrder = { 'price.regular': 1 };
        break;
      case 'price_high':
        sortOrder = { 'price.regular': -1 };
        break;
      case 'rating':
        sortOrder = { averageRating: -1, totalReviews: -1 };
        break;
      case 'newest':
        sortOrder = { createdAt: -1 };
        break;
      case 'relevance':
      default:
        sortOrder = { score: { $meta: 'textScore' } };
        // Add text index search for relevance
        filter.$text = { $search: q };
        break;
    }

    const products = await Product.find(filter, sort === 'relevance' ? { score: { $meta: 'textScore' } } : {})
      .populate('category', 'name slug')
      .select('-reviews')
      .sort(sortOrder)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
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

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
      'inventory.stockQuantity': { $gt: 0 }
    })
    .populate('category', 'name slug')
    .select('-reviews -description')
    .sort({ featuredOrder: 1, createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get corporate products
// @route   GET /api/products/corporate
// @access  Public
const getCorporateProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const products = await Product.find({
      isActive: true,
      $or: [
        { isCorporateOnly: true },
        { 'bulkPricing.0': { $exists: true } }
      ]
    })
    .populate('category', 'name slug')
    .select('-reviews')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Product.countDocuments({
      isActive: true,
      $or: [
        { isCorporateOnly: true },
        { 'bulkPricing.0': { $exists: true } }
      ]
    });

    res.status(200).json({
      success: true,
      data: products,
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

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  uploadProductImages,
  deleteProductImage,
  getBulkPricing,
  updateStock,
  getRelatedProducts,
  searchProducts,
  getFeaturedProducts,
  getCorporateProducts
};