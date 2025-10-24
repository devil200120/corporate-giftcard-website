const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  reorderCategories,
  uploadCategoryImage
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Category validation middleware
const createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/)
    .withMessage('Category name contains invalid characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Valid parent category ID is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be boolean'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SEO title cannot exceed 100 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('SEO description cannot exceed 200 characters'),
  body('seoKeywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/)
    .withMessage('Category name contains invalid characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Valid parent category ID is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be boolean'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SEO title cannot exceed 100 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('SEO description cannot exceed 200 characters'),
  body('seoKeywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array')
];

const reorderValidation = [
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Categories array is required'),
  body('categories.*.id')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('categories.*.sortOrder')
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
];

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategory);

// Protected admin routes
router.use(protect);
router.use(admin);

// Admin category management
router.post('/', createCategoryValidation, createCategory);
router.put('/:id', updateCategoryValidation, updateCategory);
router.delete('/:id', deleteCategory);
router.post('/reorder', reorderValidation, reorderCategories);
router.post('/:id/image', uploadCategoryImage);

module.exports = router;