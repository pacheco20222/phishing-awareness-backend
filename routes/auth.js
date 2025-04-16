const express = require('express');
const router = express.Router();

const { signupUser, loginUser, getProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// Update user route
router.put('/update/:id', verifyToken, updateUser);

// Delete user route
router.delete('/delete/:id', verifyToken, deleteUser);

// Protected route
router.get('/profile', verifyToken, getProfile);

module.exports = router;