const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const category = new Category({ name, slug, description });
    await category.save();
    res.status(201).json({ message: 'Catégorie créée', category });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Catégorie mise à jour', category });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};
