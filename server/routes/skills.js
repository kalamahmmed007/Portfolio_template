const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  getSkillsGrouped,
  updateProficiency,
  reorderSkills,
  getSkillStats,
  bulkDelete,
} = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/auth');
const { validateSkill, validateObjectId } = require('../middleware/validator');

// Public routes
router.get('/', getSkills);
router.get('/grouped/all', getSkillsGrouped);
router.get('/stats/summary', getSkillStats);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', validateObjectId('id'), getSkill);

// Protected routes - Admin only
router.post('/', protect, authorize('admin'), validateSkill, createSkill);
router.put('/:id', protect, authorize('admin'), validateObjectId('id'), updateSkill);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteSkill);

// Special operations - Admin only
router.put('/:id/proficiency', protect, authorize('admin'), validateObjectId('id'), updateProficiency);
router.put('/reorder/bulk', protect, authorize('admin'), reorderSkills);
router.delete('/bulk/delete', protect, authorize('admin'), bulkDelete);

module.exports = router;