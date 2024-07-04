// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controller/user');

// Route to register a new user
router.post('/register', authController.register);

// Route to login with phone number (send OTP)
router.post('/login', authController.loginWithOTP);

// Route to verify OTP and login
router.post('/login/verify', authController.verifyOTPAndLogin);

module.exports = router;
