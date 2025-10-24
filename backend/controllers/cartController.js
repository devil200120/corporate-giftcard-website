const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const { createError } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// ========================
// CART CONTROLLERS
// ========================

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name sku price images inventory bulkPricing isActive',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);

    // Recalculate cart totals
    await cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, customization = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(createError('Product not found or inactive', 404));
    }

    // Check stock availability
    if (product.inventory.stockQuantity < quantity) {
      return next(createError(
        `Only ${product.inventory.stockQuantity} items available in stock`,
        400
      ));
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.inventory.stockQuantity < newQuantity) {
        return next(createError(
          `Only ${product.inventory.stockQuantity} items available in stock`,
          400
        ));
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        customization
      });
    }

    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name sku price images inventory bulkPricing',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity, customization } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createError('Invalid item ID', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(createError('Cart not found', 404));
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return next(createError('Item not found in cart', 404));
    }

    // Check stock if quantity is being updated
    if (quantity !== undefined) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return next(createError('Product not found or inactive', 404));
      }

      if (product.inventory.stockQuantity < quantity) {
        return next(createError(
          `Only ${product.inventory.stockQuantity} items available in stock`,
          400
        ));
      }

      item.quantity = quantity;
    }

    if (customization !== undefined) {
      item.customization = customization;
    }

    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name sku price images inventory bulkPricing',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createError('Invalid item ID', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(createError('Cart not found', 404));
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return next(createError('Item not found in cart', 404));
    }

    cart.items.pull(itemId);
    await cart.calculateTotals();
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name sku price images inventory bulkPricing',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(createError('Cart not found', 404));
    }

    cart.items = [];
    await cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(createError('Coupon code is required', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'price category');

    if (!cart || cart.items.length === 0) {
      return next(createError('Cart is empty', 400));
    }

    // Find and validate coupon
    const Coupon = require('../models/Coupon');
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return next(createError('Invalid or expired coupon code', 400));
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return next(createError('Coupon usage limit exceeded', 400));
    }

    if (coupon.userUsageLimit) {
      const userUsage = coupon.usedBy.filter(usage => 
        usage.user.toString() === req.user.id
      ).length;
      
      if (userUsage >= coupon.userUsageLimit) {
        return next(createError('You have exceeded the usage limit for this coupon', 400));
      }
    }

    // Check minimum order value
    if (coupon.minOrderValue && cart.subtotal < coupon.minOrderValue) {
      return next(createError(
        `Minimum order value of $${coupon.minOrderValue} required for this coupon`,
        400
      ));
    }

    // Apply coupon
    cart.appliedCoupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount
    };

    await cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(createError('Cart not found', 404));
    }

    cart.appliedCoupon = undefined;
    await cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Coupon removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// WISHLIST CONTROLLERS
// ========================

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name sku price images inventory averageRating totalReviews isActive',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    // Filter out inactive products
    wishlist.items = wishlist.items.filter(item => item.product && item.product.isActive);
    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/items
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError('Invalid product ID', 400));
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(createError('Product not found or inactive', 404));
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return next(createError('Product already in wishlist', 400));
    }

    // Add item
    wishlist.items.push({ product: productId });
    await wishlist.save();
    
    await wishlist.populate({
      path: 'items.product',
      select: 'name sku price images inventory averageRating totalReviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: wishlist,
      message: 'Item added to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/items/:itemId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createError('Invalid item ID', 400));
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return next(createError('Wishlist not found', 404));
    }

    const item = wishlist.items.id(itemId);
    if (!item) {
      return next(createError('Item not found in wishlist', 404));
    }

    wishlist.items.pull(itemId);
    await wishlist.save();

    await wishlist.populate({
      path: 'items.product',
      select: 'name sku price images inventory averageRating totalReviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: wishlist,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return next(createError('Wishlist not found', 404));
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/items/:itemId/move-to-cart
// @access  Private
const moveToCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createError('Invalid item ID', 400));
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return next(createError('Wishlist not found', 404));
    }

    const wishlistItem = wishlist.items.id(itemId);
    if (!wishlistItem) {
      return next(createError('Item not found in wishlist', 404));
    }

    const product = await Product.findById(wishlistItem.product);
    if (!product || !product.isActive) {
      return next(createError('Product not found or inactive', 404));
    }

    // Check stock availability
    if (product.inventory.stockQuantity < quantity) {
      return next(createError(
        `Only ${product.inventory.stockQuantity} items available in stock`,
        400
      ));
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingCartItem = cart.items.find(
      item => item.product.toString() === wishlistItem.product.toString()
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.items.push({
        product: wishlistItem.product,
        quantity
      });
    }

    // Remove from wishlist
    wishlist.items.pull(itemId);

    // Save both
    await cart.calculateTotals();
    await Promise.all([cart.save(), wishlist.save()]);

    res.status(200).json({
      success: true,
      message: 'Item moved to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError('Invalid product ID', 400));
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    let isInWishlist = false;
    if (wishlist) {
      isInWishlist = wishlist.items.some(
        item => item.product.toString() === productId
      );
    }

    res.status(200).json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Cart controllers
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  
  // Wishlist controllers
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlistStatus
};