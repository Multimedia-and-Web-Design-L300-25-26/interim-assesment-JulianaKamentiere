const express = require('express');
const router = express.Router();
const { register, login, profile, logout, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/change-password', auth, changePassword);

// Protected routes
router.get('/profile', auth, profile);
router.get('/me', auth, profile); // Alias for frontend compatibility

module.exports = router;