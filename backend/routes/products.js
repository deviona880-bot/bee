const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateCreateProduct, validateProductId } = require('../middleware/validation');

router.get('/', productController.getAllProducts);
router.get('/:id', validateProductId, productController.getProductById);
router.post('/', authMiddleware, adminMiddleware, validateCreateProduct, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validateProductId, validateCreateProduct, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, validateProductId, productController.deleteProduct);

module.exports = router;
