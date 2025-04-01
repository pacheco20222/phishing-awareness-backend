const express = require('express');
const router = express.Router();

// This controller function (Implement next)
const { signupUser, loginUser } = require('../controllers/authController');

// Post signup for User registration
router.post('/signup', signupUser);

// Post login for User login
router.post('/login', loginUser);

module.exports = router;