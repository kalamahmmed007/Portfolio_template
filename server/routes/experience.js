const express = require('express');
const router = express.Router();
const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceStats,
  reorderExperiences,
} = require('../controllers/experienceController');
const { protect, authorize } = require('../middleware/auth');
const { validateExperience, validateObjectId } = require('../middleware/validator');

// Public routes
router.get('/', getExperiences);
router.get('/stats/summary', getExperienceStats);
router.get('/:id', validateObjectId('id'), getExperience);

// Protected routes - Admin only
router.post('/', protect, authorize('admin'), validateExperience, createExperience);
router.put('/:id', protect, authorize('admin'), validateObjectId('id'), updateExperience);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteExperience);
router.put('/reorder/bulk', protect, authorize('admin'), reorderExperiences);

module.exports = router;