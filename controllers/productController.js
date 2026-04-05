const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, type, search, limit = 12, page = 1 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('category');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, longDescription, category, price, image, stock, sku, type } = req.body;

    const product = new Product({
      name, description, longDescription, category, price, image, stock, sku, type
    });

    await product.save();
    res.status(201).json({ message: 'Produit créé avec succès', product });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du produit', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit mis à jour avec succès', product });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: err.message });
  }
};
