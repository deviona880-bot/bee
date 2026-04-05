const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get('/my-orders', authMiddleware, orderController.getUserOrders);
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
