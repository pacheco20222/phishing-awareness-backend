const express = require('express');
const router = express.Router();

const { signupUser, loginUser, getProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// Protected route
router.get('/profile', verifyToken, getProfile);

module.exports = router;