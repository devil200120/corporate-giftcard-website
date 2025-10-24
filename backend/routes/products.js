const express = require('express');
const { body, query } = require('express-validator');
const {
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
} = require('../controllers/productController');
const { 
  protect, 
  admin, 
  corporateAdmin,
  authorize,
  corporateAccess,
  optionalAuth
} = require('../middleware/authMiddleware');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation middleware
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('price.regular')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Regular price must be a positive number'),
  body('inventory.stockQuantity')
    .isNumeric()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review comment cannot exceed 1000 characters')
];

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/search', optionalAuth, searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/corporate', getCorporateProducts);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);
router.get('/:id/bulk-pricing', getBulkPricing);

// Protected routes for customers
router.post('/:id/reviews', protect, reviewValidation, createProductReview);
router.put('/reviews/:reviewId', protect, reviewValidation, updateProductReview);
router.delete('/reviews/:reviewId', protect, deleteProductReview);

// Admin routes
router.post('/', protect, admin, uploadMiddleware.productImages, productValidation, createProduct);
router.put('/:id', protect, admin, uploadMiddleware.productImages, productValidation, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, uploadMiddleware.productImages, uploadProductImages);
router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);
router.patch('/:id/stock', protect, authorize('super_admin', 'corporate_admin'), updateStock);

module.exports = router;