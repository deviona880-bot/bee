const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      messageEn: 'Validation error',
      errors: formattedErrors
    });
  }
  next();
};

// ==================== AUTH VALIDATION ====================

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  handleValidationErrors
];

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir des majuscules, minuscules et chiffres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),
  handleValidationErrors
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir des majuscules, minuscules et chiffres'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Les mots de passe ne correspondent pas'),
  handleValidationErrors
];

// ==================== PRODUCT VALIDATION ====================

const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du produit est requis')
    .isLength({ min: 3, max: 200 })
    .withMessage('Le nom doit avoir entre 3 et 200 caractères'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 10, max: 5000 })
    .withMessage('La description doit avoir entre 10 et 5000 caractères'),
  body('longDescription')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('La description longue ne peut pas dépasser 10000 caractères'),
  body('price')
    .notEmpty().withMessage('Le prix est requis')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être supérieur à 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La catégorie est requise')
    .isMongoId()
    .withMessage('ID de catégorie invalide'),
  body('type')
    .notEmpty().withMessage('Le type de produit est requis')
    .isIn(['travaux_forestiers', 'cosmétiques', 'apiculture'])
    .withMessage('Type de produit invalide (travaux_forestiers, cosmétiques, ou apiculture)'),
  body('image')
    .optional()
    .if((value) => value && value.length > 0) // Only validate if provided and not empty
    .trim()
    .custom((value) => {
      // Allow both http and https URLs, including localhost
      const urlPattern = /^https?:\/\/(localhost|[\w.-]+)(:\d+)?(\/[\w.\-/?%&=]*)?$/;
      if (!urlPattern.test(value)) {
        throw new Error('URL d\'image invalide');
      }
      return true;
    })
    .withMessage('URL d\'image invalide'),
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('SKU ne peut pas dépasser 50 caractères'),
  handleValidationErrors
];

const validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Le nom doit avoir entre 3 et 200 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('La description doit avoir entre 10 et 5000 caractères'),
  body('longDescription')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('La description longue ne peut pas dépasser 10000 caractères'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être supérieur à 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('ID de catégorie invalide'),
  body('type')
    .optional()
    .isIn(['travaux_forestiers', 'cosmétiques', 'apiculture'])
    .withMessage('Type de produit invalide'),
  body('image')
    .optional()
    .if((value) => value && value.length > 0) // Only validate if provided and not empty
    .trim()
    .custom((value) => {
      // Allow both http and https URLs, including localhost
      const urlPattern = /^https?:\/\/(localhost|[\w.-]+)(:\d+)?(\/[\w.\-/?%&=]*)?$/;
      if (!urlPattern.test(value)) {
        throw new Error('URL d\'image invalide');
      }
      return true;
    })
    .withMessage('URL d\'image invalide'),
  handleValidationErrors
];

const validateProductId = [
  param('id')
    .isMongoId()
    .withMessage('ID produit invalide'),
  handleValidationErrors
];

// ==================== ORDER VALIDATION ====================

const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Au moins un article est requis'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('ID produit invalide'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être au moins 1'),
  body('items.*.price')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être valide'),
  body('totalAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Le montant total doit être valide'),
  body('shippingAddress')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse de livraison est requise')
    .isLength({ min: 10, max: 500 })
    .withMessage('L\'adresse doit avoir entre 10 et 500 caractères'),
  body('paymentMethod')
    .optional()
    .isIn(['credit_card', 'paypal', 'bank_transfer', 'cash'])
    .withMessage('Méthode de paiement invalide'),
  handleValidationErrors
];

const validateUpdateOrderStatus = [
  param('id')
    .isMongoId()
    .withMessage('ID commande invalide'),
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Statut de commande invalide'),
  handleValidationErrors
];

const validateOrderId = [
  param('id')
    .isMongoId()
    .withMessage('ID commande invalide'),
  handleValidationErrors
];

// ==================== CATEGORY VALIDATION ====================

const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la catégorie est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('image')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors
];

const validateCategoryId = [
  param('id')
    .isMongoId()
    .withMessage('ID catégorie invalide'),
  handleValidationErrors
];

// ==================== BLOG VALIDATION ====================

const validateCreateBlog = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 5, max: 300 })
    .withMessage('Le titre doit avoir entre 5 et 300 caractères'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Le contenu est requis')
    .isLength({ min: 50, max: 10000 })
    .withMessage('Le contenu doit avoir entre 50 et 10000 caractères'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('L\'extrait ne peut pas dépasser 500 caractères'),
  body('author')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('L\'auteur ne peut pas dépasser 100 caractères'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Les tags doivent être un tableau'),
  body('image')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Statut invalide'),
  handleValidationErrors
];

const validateBlogId = [
  param('id')
    .isMongoId()
    .withMessage('ID blog invalide'),
  handleValidationErrors
];

// ==================== CONTACT VALIDATION ====================

const validateCreateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Le sujet est requis')
    .isLength({ min: 5, max: 200 })
    .withMessage('Le sujet doit avoir entre 5 et 200 caractères'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Le message est requis')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Le message doit avoir entre 10 et 5000 caractères'),
  handleValidationErrors
];

// ==================== TEAM VALIDATION ====================

const validateCreateTeam = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Le poste est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le poste doit avoir entre 2 et 100 caractères'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La bio ne peut pas dépasser 1000 caractères'),
  body('image')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide'),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

const validateTeamId = [
  param('id')
    .isMongoId()
    .withMessage('ID membre invalide'),
  handleValidationErrors
];

// ==================== UPLOAD VALIDATION ====================

const validateUpload = [
  (req, res, next) => {
    // Check if file or files exist
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni',
        messageEn: 'No file provided'
      });
    }

    // Validate file size
    const files = req.file ? [req.file] : (req.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let file of files) {
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'Fichier trop volumineux (max 5MB)',
          messageEn: 'File too large (max 5MB)'
        });
      }
    }

    next();
  }
];

// ==================== PAGINATION VALIDATION ====================

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page doit être un nombre positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit doit être entre 1 et 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recherche doit avoir entre 1 et 100 caractères'),
  handleValidationErrors
];

// ==================== USER VALIDATION ====================

const validateUpdateUser = [
  param('id')
    .isMongoId()
    .withMessage('ID utilisateur invalide'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit avoir entre 2 et 50 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit avoir entre 2 et 50 caractères'),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('L\'adresse ne peut pas dépasser 500 caractères'),
  handleValidationErrors
];

const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('ID utilisateur invalide'),
  handleValidationErrors
];

module.exports = {
  // Auth
  validateLogin,
  validateRegister,
  validateChangePassword,

  // Product
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,

  // Order
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateOrderId,

  // Category
  validateCreateCategory,
  validateCategoryId,

  // Blog
  validateCreateBlog,
  validateBlogId,

  // Contact
  validateCreateContact,

  // Team
  validateCreateTeam,
  validateTeamId,

  // Upload
  validateUpload,

  // Pagination
  validatePagination,

  // User
  validateUpdateUser,
  validateUserId,

  // Error handler
  handleValidationErrors
};
