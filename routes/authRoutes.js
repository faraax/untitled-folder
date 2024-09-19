const express = require('express');
const { registerUser, loginUser, refreshToken, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Register User
router.post('/users/', registerUser);

// Login User
router.post('/jwt/create/', loginUser);

// Refresh Access Token
router.post('/jwt/refresh/', refreshToken);

// Get User Profile
router.get('/users/me/', protect, getUserProfile);

module.exports = router;
