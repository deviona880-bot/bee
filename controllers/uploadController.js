const fs = require('fs');
const path = require('path');

// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload image to local storage
 * Supports: products, blogs, team, categories
 */
exports.uploadImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni',
        messageEn: 'No file provided'
      });
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erreur suppression fichier:', err);
      });

      return res.status(400).json({
        success: false,
        message: 'Format de fichier non accepté. Utilisez: JPEG, PNG, WebP ou GIF',
        messageEn: 'File format not accepted. Use: JPEG, PNG, WebP or GIF'
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erreur suppression fichier:', err);
      });

      return res.status(400).json({
        success: false,
        message: 'La taille du fichier dépasse 5MB',
        messageEn: 'File size exceeds 5MB limit'
      });
    }

    // Get folder from query or body (default to 'general')
    const folder = req.query.folder || req.body.folder || 'general';

    // Create folder if it doesn't exist
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const ext = path.extname(req.file.originalname);
    const filename = `${timestamp}_${random}${ext}`;

    // Final file path
    const finalPath = path.join(folderPath, filename);

    // Move file from temp to uploads folder
    fs.renameSync(req.file.path, finalPath);

    // Generate URL for the uploaded file
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${folder}/${filename}`;

    // Return success response with image details
    res.status(200).json({
      success: true,
      message: 'Image uploadée avec succès',
      messageEn: 'Image uploaded successfully',
      data: {
        filename: filename,
        url: fileUrl,
        path: `${folder}/${filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
        createdAt: new Date()
      }
    });

  } catch (error) {
    // Delete temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erreur suppression fichier:', err);
      });
    }

    console.error('❌ Erreur upload local:', {
      message: error.message,
      folder: req.body?.folder
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de l\'image',
      messageEn: 'Error uploading image',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Upload multiple images to local storage
 */
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni',
        messageEn: 'No files provided'
      });
    }

    const folder = req.query.folder || req.body.folder || 'general';
    const uploadedImages = [];
    const errors = [];

    // Create folder if it doesn't exist
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      try {
        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
          errors.push({
            filename: file.originalname,
            error: 'Format non accepté'
          });
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erreur suppression:', err);
          });
          continue;
        }

        // Validate file size
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          errors.push({
            filename: file.originalname,
            error: 'Taille dépasse 5MB'
          });
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erreur suppression:', err);
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}_${i}_${random}${ext}`;

        // Final file path
        const finalPath = path.join(folderPath, filename);

        // Move file
        fs.renameSync(file.path, finalPath);

        // Generate URL
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${folder}/${filename}`;

        uploadedImages.push({
          filename: filename,
          url: fileUrl,
          path: `${folder}/${filename}`,
          size: file.size,
          mimetype: file.mimetype
        });

      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erreur suppression:', err);
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Images traitées',
      messageEn: 'Images processed',
      data: {
        uploaded: uploadedImages,
        errors: errors.length > 0 ? errors : null,
        totalProcessed: req.files.length,
        totalSuccess: uploadedImages.length,
        totalFailed: errors.length
      }
    });

  } catch (error) {
    console.error('Erreur upload multiple:', error);

    // Clean up all uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erreur suppression:', err);
          });
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des images',
      messageEn: 'Error uploading images',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Delete image from local storage
 */
exports.deleteImage = async (req, res) => {
  try {
    const { path: filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Chemin du fichier requis',
        messageEn: 'File path required'
      });
    }

    // Ensure the path is safe (prevent directory traversal)
    const fullPath = path.join(uploadDir, filePath);
    if (!fullPath.startsWith(uploadDir)) {
      return res.status(400).json({
        success: false,
        message: 'Chemin invalide',
        messageEn: 'Invalid path'
      });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé',
        messageEn: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(fullPath);

    res.status(200).json({
      success: true,
      message: 'Image supprimée avec succès',
      messageEn: 'Image deleted successfully',
      data: { path: filePath }
    });

  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      messageEn: 'Error deleting image',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Get image metadata from local storage
 */
exports.getImageMetadata = async (req, res) => {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Chemin du fichier requis',
        messageEn: 'File path required'
      });
    }

    // Ensure the path is safe
    const fullPath = path.join(uploadDir, filePath);
    if (!fullPath.startsWith(uploadDir)) {
      return res.status(400).json({
        success: false,
        message: 'Chemin invalide',
        messageEn: 'Invalid path'
      });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé',
        messageEn: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(fullPath);
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filePath}`;

    res.status(200).json({
      success: true,
      message: 'Métadonnées récupérées',
      messageEn: 'Metadata retrieved',
      data: {
        path: filePath,
        url: fileUrl,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });

  } catch (error) {
    console.error('Erreur récupération métadonnées:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des métadonnées',
      messageEn: 'Error retrieving metadata',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};
