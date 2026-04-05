const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, blogController.getAllBlogsAdmin);
router.post('/', authMiddleware, adminMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, adminMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, blogController.deleteBlog);

module.exports = router;
