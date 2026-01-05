const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  loginValidation,
  registerValidation,
} = require('../middleware/validator');

// --- Hardcoded admin for dev ---
const adminUser = {
  email: '0057kalamahmmed@gmail.com',
  password: '123456', // plain text for dev only
  name: 'Admin',
  role: 'admin',
};

// POST /login
router.post('/login', loginValidation, async (req, res, next) => {
  const { email, password } = req.body;

  if (email === adminUser.email && password === adminUser.password) {
    // fake JWT token (you can generate a real one if needed)
    const token = 'fake-admin-token-123456';
    return res.json({
      user: { name: adminUser.name, email: adminUser.email, role: adminUser.role },
      token,
    });
  } else {
    // fallback to normal login controller
    return login(req, res, next);
  }
});

// Keep other routes as is
router.post('/register', registerValidation, register);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
