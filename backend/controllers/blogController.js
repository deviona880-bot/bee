const Blog = require('../models/Blog');

// Public - Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({ published: true })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments({ published: true });

    res.json({
      blogs,
      pagination: { current: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

// Admin - Get all blogs (published and drafts)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find()
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments();

    res.json({
      blogs,
      pagination: { current: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, category, published } = req.body;
    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      published: published || false,
      author: req.userId
    });
    await blog.save();
    res.status(201).json({ message: 'Article créé', blog });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Article mis à jour', blog });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

