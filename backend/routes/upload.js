const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../utils/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/temp');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { folder = 'general' } = req.body;

  try {
    const result = await uploadToCloudinary(req.file.path, {
      folder: `corporate-gifting/${folder}`,
      quality: 'auto',
      fetch_format: 'auto'
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500);
    throw new Error('Failed to upload image');
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const { folder = 'general' } = req.body;
  const filePaths = req.files.map(file => file.path);

  try {
    const results = await uploadMultipleToCloudinary(filePaths, {
      folder: `corporate-gifting/${folder}`,
      quality: 'auto',
      fetch_format: 'auto'
    });

    const uploadedImages = results.successful.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }));

    res.json({
      success: true,
      message: `${results.successCount} images uploaded successfully`,
      data: {
        images: uploadedImages,
        totalUploaded: results.successCount,
        totalFailed: results.failureCount,
        failures: results.failed
      }
    });
  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500);
    throw new Error('Failed to upload images');
  }
});

// @desc    Upload product images
// @route   POST /api/upload/products/:productId/images
// @access  Private/Admin
const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const { productId } = req.params;
  const Product = require('../models/Product');

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const filePaths = req.files.map(file => file.path);

  try {
    const results = await uploadMultipleToCloudinary(filePaths, {
      folder: `corporate-gifting/products/${productId}`,
      quality: 'auto',
      fetch_format: 'auto'
    });

    const newImages = results.successful.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt: req.body.altTexts ? req.body.altTexts[index] : product.name,
      isPrimary: index === 0 && product.images.length === 0
    }));

    // Add new images to product
    product.images.push(...newImages);
    await product.save();

    res.json({
      success: true,
      message: `${results.successCount} product images uploaded successfully`,
      data: {
        productId,
        images: newImages,
        totalImages: product.images.length,
        totalUploaded: results.successCount,
        totalFailed: results.failureCount
      }
    });
  } catch (error) {
    console.error('Product images upload error:', error);
    res.status(500);
    throw new Error('Failed to upload product images');
  }
});

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const User = require('../models/User');

  try {
    // Delete old avatar if exists
    const user = await User.findById(req.user._id);
    if (user.avatar && user.avatar.public_id) {
      const { deleteFromCloudinary } = require('../utils/cloudinary');
      await deleteFromCloudinary(user.avatar.public_id);
    }

    // Upload new avatar
    const result = await uploadToCloudinary(req.file.path, {
      folder: `corporate-gifting/avatars/${req.user._id}`,
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Update user avatar
    user.avatar = {
      url: result.secure_url,
      public_id: result.public_id
    };
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500);
    throw new Error('Failed to upload avatar');
  }
});

// @desc    Upload document (PDF, DOC, etc.)
// @route   POST /api/upload/document
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { folder = 'documents', documentType = 'general' } = req.body;

  try {
    const result = await uploadToCloudinary(req.file.path, {
      folder: `corporate-gifting/${folder}`,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        filename: result.original_filename,
        format: result.format,
        size: result.bytes,
        documentType
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500);
    throw new Error('Failed to upload document');
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
const deleteFile = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    res.status(400);
    throw new Error('Public ID is required');
  }

  try {
    const { deleteFromCloudinary } = require('../utils/cloudinary');
    const result = await deleteFromCloudinary(publicId);

    if (!result.success) {
      res.status(400);
      throw new Error('Failed to delete file');
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: {
        publicId,
        deleted: result.result === 'ok'
      }
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500);
    throw new Error('Failed to delete file');
  }
});

// @desc    Get upload status/info
// @route   GET /api/upload/info/:publicId
// @access  Private
const getFileInfo = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  try {
    const { getImageDetails } = require('../utils/cloudinary');
    const result = await getImageDetails(publicId);

    if (!result.success) {
      res.status(404);
      throw new Error('File not found');
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500);
    throw new Error('Failed to get file information');
  }
});

// Apply middleware and routes
router.use(protect);

// Single file uploads
router.post('/image', upload.single('image'), uploadSingleImage);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/document', upload.single('document'), uploadDocument);

// Multiple file uploads
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// Admin routes
router.post('/products/:productId/images', admin, upload.array('images', 10), uploadProductImages);
router.delete('/:publicId', admin, deleteFile);

// File info
router.get('/info/:publicId', getFileInfo);

module.exports = router;