const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone, address },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profil mis à jour', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};
