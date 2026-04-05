const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateUpload } = require('../middleware/validation');

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../temp-uploads');
    // Create directory if it doesn't exist
    if (!require('fs').existsSync(tempDir)) {
      require('fs').mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow specific image types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non accepté'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * POST /api/upload
 * Upload single image (default endpoint)
 * Body: multipart/form-data
 * - file: image file
 * - folder: optional, default 'bees-app/general'
 */
router.post(
  '/',
  upload.single('file'),
  validateUpload,
  uploadController.uploadImage
);

/**
 * POST /api/upload/single
 * Upload single image
 * Admin only
 * Body: multipart/form-data
 * - file: image file
 * - folder: optional, default 'bees-app/general'
 */
router.post(
  '/single',
  authMiddleware,
  adminMiddleware,
  upload.single('file'),
  validateUpload,
  uploadController.uploadImage
);

/**
 * POST /api/upload/multiple
 * Upload multiple images
 * Admin only
 * Body: multipart/form-data
 * - files: image files array
 * - folder: optional, default 'bees-app/general'
 */
router.post(
  '/multiple',
  authMiddleware,
  adminMiddleware,
  upload.array('files', 10), // Max 10 files
  validateUpload,
  uploadController.uploadMultipleImages
);

/**
 * POST /api/upload/delete
 * Delete image from Cloudinary
 * Admin only
 * Body: JSON
 * - publicId: Cloudinary public ID
 */
router.post(
  '/delete',
  authMiddleware,
  adminMiddleware,
  uploadController.deleteImage
);

/**
 * GET /api/upload/metadata
 * Get image metadata
 * Query: publicId
 */
router.get(
  '/metadata',
  uploadController.getImageMetadata
);

module.exports = router;
