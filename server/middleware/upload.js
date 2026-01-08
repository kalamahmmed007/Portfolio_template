const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration for local file system
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create category-based folders
    let folder = 'uploads/';
    
    if (file.fieldname === 'projectImage') {
      folder = 'uploads/projects/';
    } else if (file.fieldname === 'skillIcon') {
      folder = 'uploads/skills/';
    } else if (file.fieldname === 'avatar') {
      folder = 'uploads/avatars/';
    }

    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

// Memory storage for cloud upload (Cloudinary)
const memoryStorage = multer.memoryStorage();

// File filter - accept only images
const imageFileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  
  // Check extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// File filter - accept documents
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  const mimetype = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|text\/plain/.test(
    file.mimetype
  );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (pdf, doc, docx, txt)'));
  }
};

// File filter - accept any file type
const anyFileFilter = (req, file, cb) => {
  cb(null, true);
};

// Configure multer for local storage with image filter
const uploadLocal = multer({
  storage: localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFileFilter,
});

// Configure multer for memory storage (for Cloudinary)
const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for cloud uploads
  },
  fileFilter: imageFileFilter,
});

// Configure multer for documents
const uploadDocument = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: documentFileFilter,
});

// Upload single image (local storage)
const uploadSingleImage = uploadLocal.single('image');

// Upload multiple images (local storage)
const uploadMultipleImages = uploadLocal.array('images', 10);

// Upload single image to memory (for Cloudinary)
const uploadSingleToMemory = uploadMemory.single('image');

// Upload multiple images to memory (for Cloudinary)
const uploadMultipleToMemory = uploadMemory.array('images', 10);

// Upload with custom field names
const uploadFields = uploadLocal.fields([
  { name: 'projectImage', maxCount: 1 },
  { name: 'skillIcon', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);

// Upload single document
const uploadSingleDocument = uploadDocument.single('document');

// Error handling wrapper for multer
const handleUploadError = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        let message = 'File upload error';
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          message = 'File too large. Maximum size is 5MB for images and 10MB for documents';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          message = 'Too many files. Maximum is 10 files';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          message = 'Unexpected file field';
        } else if (err.code === 'LIMIT_PART_COUNT') {
          message = 'Too many parts';
        } else if (err.code === 'LIMIT_FIELD_KEY') {
          message = 'Field name too long';
        } else if (err.code === 'LIMIT_FIELD_VALUE') {
          message = 'Field value too long';
        } else if (err.code === 'LIMIT_FIELD_COUNT') {
          message = 'Too many fields';
        }
        
        return res.status(400).json({
          success: false,
          message,
          code: err.code,
        });
      } else if (err) {
        // Other errors (like file type validation)
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      
      // No error, proceed to next middleware
      next();
    });
  };
};

// Delete file helper function
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Delete multiple files helper function
const deleteFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    deleteFile(filePath);
  });
};

// Validate image dimensions (optional middleware)
const validateImageDimensions = (minWidth, minHeight, maxWidth, maxHeight) => {
  return async (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    try {
      const sharp = require('sharp');
      const files = req.files || [req.file];

      for (const file of files) {
        const metadata = await sharp(file.path || file.buffer).metadata();

        if (minWidth && metadata.width < minWidth) {
          if (file.path) deleteFile(file.path);
          return res.status(400).json({
            success: false,
            message: `Image width must be at least ${minWidth}px`,
          });
        }

        if (minHeight && metadata.height < minHeight) {
          if (file.path) deleteFile(file.path);
          return res.status(400).json({
            success: false,
            message: `Image height must be at least ${minHeight}px`,
          });
        }

        if (maxWidth && metadata.width > maxWidth) {
          if (file.path) deleteFile(file.path);
          return res.status(400).json({
            success: false,
            message: `Image width must not exceed ${maxWidth}px`,
          });
        }

        if (maxHeight && metadata.height > maxHeight) {
          if (file.path) deleteFile(file.path);
          return res.status(400).json({
            success: false,
            message: `Image height must not exceed ${maxHeight}px`,
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Export upload middleware
module.exports = {
  // Local storage uploads
  uploadSingleImage: handleUploadError(uploadSingleImage),
  uploadMultipleImages: handleUploadError(uploadMultipleImages),
  uploadFields: handleUploadError(uploadFields),
  uploadSingleDocument: handleUploadError(uploadSingleDocument),
  
  // Memory storage uploads (for Cloudinary)
  uploadSingleToMemory: handleUploadError(uploadSingleToMemory),
  uploadMultipleToMemory: handleUploadError(uploadMultipleToMemory),
  
  // Raw multer instances (use with caution)
  uploadLocal,
  uploadMemory,
  uploadDocument,
  
  // Helper functions
  deleteFile,
  deleteFiles,
  validateImageDimensions,
  
  // File filters
  imageFileFilter,
  documentFileFilter,
  anyFileFilter,
};