const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectsByCategory,
  toggleFeatured,
  reorderProjects,
  getProjectStats,
  bulkDelete,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { validateProject, validateObjectId } = require('../middleware/validator');

// Public routes
router.get('/', getProjects);
router.get('/featured/list', getFeaturedProjects);
router.get('/stats/summary', getProjectStats);
router.get('/category/:category', getProjectsByCategory);
router.get('/:id', validateObjectId('id'), getProject);

// Protected routes - Admin only
router.post('/', protect, authorize('admin'), validateProject, createProject);
router.put('/:id', protect, authorize('admin'), validateObjectId('id'), updateProject);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteProject);

// Special operations - Admin only
router.put('/:id/toggle-featured', protect, authorize('admin'), validateObjectId('id'), toggleFeatured);
router.put('/reorder/bulk', protect, authorize('admin'), reorderProjects);
router.delete('/bulk/delete', protect, authorize('admin'), bulkDelete);

module.exports = router;