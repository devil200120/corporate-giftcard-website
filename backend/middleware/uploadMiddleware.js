const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure memory storage for direct cloudinary uploads
const memoryStorage = multer.memoryStorage();

// Configure disk storage for local files (if needed)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set upload directory based on file type
    let uploadPath = path.join(__dirname, '../uploads/');
    
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'productImages' || file.fieldname === 'image') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'categoryImage') {
      uploadPath += 'categories/';
    } else if (file.fieldname === 'customizationFile') {
      uploadPath += 'customizations/';
    } else {
      uploadPath += 'misc/';
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'application/pdf': true, // For documents
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer with memory storage for cloudinary uploads
const uploadWithMemory = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files
  }
});

// Configure multer with disk storage for local files
const uploadWithDisk = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files
  }
});

// Different upload configurations
const uploadMiddleware = {
  // Single file upload (memory for cloudinary)
  single: (fieldName) => uploadWithMemory.single(fieldName),
  
  // Multiple files with same field name (memory for cloudinary)
  array: (fieldName, maxCount = 5) => uploadWithMemory.array(fieldName, maxCount),
  
  // Multiple fields with different names (memory for cloudinary)
  fields: (fields) => uploadWithMemory.fields(fields),
  
  // Product images upload (multiple files) - use memory for cloudinary
  productImages: uploadWithMemory.array('productImages', 10),
  
  // User avatar upload (single file) - use memory for cloudinary
  avatar: uploadWithMemory.single('avatar'),
  
  // Category image upload (single file) - use memory for cloudinary
  categoryImage: uploadWithMemory.single('categoryImage'),
  
  // Customization files (multiple files) - use memory for cloudinary
  customizationFiles: uploadWithMemory.array('customizationFiles', 5),
  
  // Mixed upload for products (images + documents) - use memory for cloudinary
  productMixed: uploadWithMemory.fields([
    { name: 'productImages', maxCount: 10 },
    { name: 'productDocuments', maxCount: 3 }
  ]),
  
  // Disk storage versions (for local files if needed)
  diskSingle: (fieldName) => uploadWithDisk.single(fieldName),
  diskArray: (fieldName, maxCount = 5) => uploadWithDisk.array(fieldName, maxCount)
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size allowed is 10MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 10 files allowed.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name for file upload.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + error.message
        });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  uploadMiddleware,
  handleUploadError
};