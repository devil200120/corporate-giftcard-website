const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set upload directory based on file type
    let uploadPath = 'uploads/';
    
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

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files
  }
});

// Different upload configurations
const uploadMiddleware = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files with same field name
  array: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Multiple fields with different names
  fields: (fields) => upload.fields(fields),
  
  // Product images upload (multiple files)
  productImages: upload.array('productImages', 10),
  
  // User avatar upload (single file)
  avatar: upload.single('avatar'),
  
  // Category image upload (single file)
  categoryImage: upload.single('categoryImage'),
  
  // Customization files (multiple files)
  customizationFiles: upload.array('customizationFiles', 5),
  
  // Mixed upload for products (images + documents)
  productMixed: upload.fields([
    { name: 'productImages', maxCount: 10 },
    { name: 'productDocuments', maxCount: 3 }
  ])
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