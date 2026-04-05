const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', teamController.getAllTeamMembers);
router.get('/:id', teamController.getTeamMemberById);
router.post('/', authMiddleware, adminMiddleware, teamController.createTeamMember);
router.put('/:id', authMiddleware, adminMiddleware, teamController.updateTeamMember);
router.delete('/:id', authMiddleware, adminMiddleware, teamController.deleteTeamMember);

module.exports = router;
