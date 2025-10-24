const express = require('express');
const { body } = require('express-validator');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

const router = express.Router();

// Validation middleware
const addToWishlistValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required')
];

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({
      path: 'items.product',
      select: 'name description price images sku inStock category',
      populate: {
        path: 'category',
        select: 'name'
      }
    })
    .lean();

  if (!wishlist) {
    return res.json({
      success: true,
      data: {
        items: [],
        totalItems: 0
      },
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    });
  }

  // Apply pagination to items
  const totalItems = wishlist.items.length;
  const paginatedItems = wishlist.items.slice(skip, skip + limit);
  const pages = Math.ceil(totalItems / limit);

  res.json({
    success: true,
    data: {
      items: paginatedItems,
      totalItems,
      updatedAt: wishlist.updatedAt
    },
    pagination: {
      page,
      limit,
      total: totalItems,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Verify product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found or not available');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    // Create new wishlist
    wishlist = new Wishlist({
      user: req.user._id,
      items: [{
        product: productId,
        addedAt: new Date()
      }]
    });
  } else {
    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      res.status(400);
      throw new Error('Product is already in your wishlist');
    }

    // Add new item
    wishlist.items.push({
      product: productId,
      addedAt: new Date()
    });
  }

  await wishlist.save();

  // Populate the newly added item
  await wishlist.populate({
    path: 'items.product',
    select: 'name description price images sku',
    match: { _id: productId }
  });

  const addedItem = wishlist.items.find(item => 
    item.product._id.toString() === productId
  );

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist successfully',
    data: {
      item: addedItem,
      totalItems: wishlist.items.length
    }
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  const itemIndex = wishlist.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }

  wishlist.items.splice(itemIndex, 1);
  await wishlist.save();

  res.json({
    success: true,
    message: 'Product removed from wishlist successfully',
    data: {
      totalItems: wishlist.items.length
    }
  });
});

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found or not available');
  }

  // Check stock availability
  if (product.inventory.stockQuantity < quantity) {
    res.status(400);
    throw new Error('Insufficient stock available');
  }

  const Cart = require('../models/Cart');
  
  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if item already exists in cart
  const existingCartItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price.regular
    });
  }

  await cart.save();

  // Remove from wishlist
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    const itemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex !== -1) {
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
    }
  }

  res.json({
    success: true,
    message: 'Product moved to cart successfully',
    data: {
      cartItems: cart.items.length,
      wishlistItems: wishlist ? wishlist.items.length : 0
    }
  });
});

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({
    success: true,
    message: 'Wishlist cleared successfully',
    data: {
      totalItems: 0
    }
  });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkInWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ 
    user: req.user._id,
    'items.product': productId
  });

  const isInWishlist = !!wishlist;

  res.json({
    success: true,
    data: {
      isInWishlist,
      productId
    }
  });
});

// @desc    Get wishlist summary
// @route   GET /api/wishlist/summary
// @access  Private
const getWishlistSummary = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('items.product', 'price category');

  if (!wishlist) {
    return res.json({
      success: true,
      data: {
        totalItems: 0,
        totalValue: 0,
        categories: []
      }
    });
  }

  const totalItems = wishlist.items.length;
  const totalValue = wishlist.items.reduce((sum, item) => {
    return sum + (item.product?.price?.regular || 0);
  }, 0);

  // Group by categories
  const categoryCount = {};
  wishlist.items.forEach(item => {
    if (item.product?.category) {
      const categoryName = item.product.category.name || 'Uncategorized';
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    }
  });

  const categories = Object.entries(categoryCount).map(([name, count]) => ({
    name,
    count
  }));

  res.json({
    success: true,
    data: {
      totalItems,
      totalValue,
      categories
    }
  });
});

// Apply routes
router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlistValidation, addToWishlist);
router.delete('/clear', protect, clearWishlist);
router.get('/summary', protect, getWishlistSummary);
router.get('/check/:productId', protect, checkInWishlist);
router.delete('/:productId', protect, removeFromWishlist);
router.post('/:productId/move-to-cart', protect, moveToCart);

module.exports = router;
