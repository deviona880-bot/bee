const Team = require('../models/Team');

exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membre non trouvé' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, image, email, phone, expertise } = req.body;
    const member = new Team({ name, role, bio, image, email, phone, expertise });
    await member.save();
    res.status(201).json({ message: 'Membre créé', member });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Membre mis à jour', member });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Membre supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};
