const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlistStatus
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Cart validation middleware
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  body('customization')
    .optional()
    .isObject()
    .withMessage('Customization must be an object')
];

const updateCartValidation = [
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  body('customization')
    .optional()
    .isObject()
    .withMessage('Customization must be an object')
];

const couponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
];

const wishlistValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required')
];

// ========================
// CART ROUTES
// ========================

// All cart routes require authentication
router.use(protect);

// Cart management
router.get('/cart', getCart);
router.post('/cart/items', addToCartValidation, addToCart);
router.put('/cart/items/:itemId', updateCartValidation, updateCartItem);
router.delete('/cart/items/:itemId', removeFromCart);
router.delete('/cart', clearCart);

// Coupon management
router.post('/cart/coupon', couponValidation, applyCoupon);
router.delete('/cart/coupon', removeCoupon);

// ========================
// WISHLIST ROUTES
// ========================

// Wishlist management
router.get('/wishlist', getWishlist);
router.post('/wishlist/items', wishlistValidation, addToWishlist);
router.delete('/wishlist/items/:itemId', removeFromWishlist);
router.delete('/wishlist', clearWishlist);
router.post('/wishlist/items/:itemId/move-to-cart', moveToCart);
router.get('/wishlist/check/:productId', checkWishlistStatus);

module.exports = router;