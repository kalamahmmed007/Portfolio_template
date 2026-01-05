const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

module.exports = router;