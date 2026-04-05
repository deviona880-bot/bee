const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', contactController.createContact);
router.get('/', authMiddleware, adminMiddleware, contactController.getAllMessages);
router.put('/:id/status', authMiddleware, adminMiddleware, contactController.updateMessageStatus);
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteMessage);

module.exports = router;
