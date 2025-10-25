const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to cloudinary from file path
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      folder: 'corporate-gifting',
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);
    
    // Delete the local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    // Clean up local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

// Upload image to cloudinary from buffer (for memory uploads)
const uploadBufferToCloudinary = async (buffer, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      folder: 'corporate-gifting',
      ...options
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image to cloud storage'));
          } else {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              url: result.url,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

// Upload multiple images to cloudinary
const uploadMultipleToCloudinary = async (filePaths, options = {}) => {
  try {
    const uploadPromises = filePaths.map(filePath => 
      uploadToCloudinary(filePath, options)
    );
    
    const results = await Promise.allSettled(uploadPromises);
    
    const successful = [];
    const failed = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push({
          file: filePaths[index],
          error: result.reason.message
        });
        
        // Clean up failed file
        if (fs.existsSync(filePaths[index])) {
          fs.unlinkSync(filePaths[index]);
        }
      }
    });
    
    return {
      successful,
      failed,
      total: filePaths.length,
      successCount: successful.length,
      failureCount: failed.length
    };
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

// Delete image from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from cloud storage');
  }
};

// Delete multiple images from cloudinary
const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Cloudinary multiple delete error:', error);
    throw new Error('Failed to delete multiple images from cloud storage');
  }
};

// Get image transformation URL
const getTransformedUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true
    });
  } catch (error) {
    console.error('Cloudinary transformation error:', error);
    return null;
  }
};

// Generate optimized image variants for different use cases
const generateImageVariants = async (publicId) => {
  try {
    const variants = {
      thumbnail: getTransformedUrl(publicId, {
        width: 150,
        height: 150,
        crop: 'fill',
        quality: 'auto'
      }),
      medium: getTransformedUrl(publicId, {
        width: 400,
        height: 400,
        crop: 'limit',
        quality: 'auto'
      }),
      large: getTransformedUrl(publicId, {
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto'
      }),
      webp: getTransformedUrl(publicId, {
        width: 800,
        height: 800,
        crop: 'limit',
        format: 'webp',
        quality: 'auto'
      })
    };

    return variants;
  } catch (error) {
    console.error('Image variants generation error:', error);
    return null;
  }
};

// Upload image from URL (useful for bulk imports)
const uploadFromUrl = async (imageUrl, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      folder: 'corporate-gifting',
      ...options
    };

    const result = await cloudinary.uploader.upload(imageUrl, defaultOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw new Error('Failed to upload image from URL');
  }
};

// Create ZIP archive of images (useful for bulk downloads)
const createImageArchive = async (publicIds, archiveName = 'images') => {
  try {
    const result = await cloudinary.uploader.create_archive({
      resource_type: 'image',
      type: 'upload',
      public_ids: publicIds,
      target_format: 'zip'
    });

    return {
      secure_url: result.secure_url,
      url: result.url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Archive creation error:', error);
    throw new Error('Failed to create image archive');
  }
};

// Get folder contents (useful for organizing images)
const getFolderContents = async (folderPath, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'image',
      type: 'upload',
      prefix: folderPath,
      max_results: 500,
      ...options
    };

    const result = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by([['created_at', 'desc']])
      .max_results(defaultOptions.max_results)
      .execute();

    return {
      resources: result.resources,
      total_count: result.total_count,
      next_cursor: result.next_cursor
    };
  } catch (error) {
    console.error('Get folder contents error:', error);
    throw new Error('Failed to get folder contents');
  }
};

module.exports = {
  uploadToCloudinary,
  uploadBufferToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  getTransformedUrl,
  generateImageVariants,
  uploadFromUrl,
  createImageArchive,
  getFolderContents
};