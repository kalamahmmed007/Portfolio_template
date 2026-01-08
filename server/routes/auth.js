const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
  deleteAccount,
  logout,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordUpdate,
} = require('../middleware/validator');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, validatePasswordUpdate, updatePassword);
router.put('/update-profile', protect, updateProfile);
router.delete('/delete-account', protect, deleteAccount);

// Admin only routes
router.get('/users', protect, authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/role', protect, authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const { role } = req.body;
    
    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    await user.deleteOne();
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const stats = await User.getStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;