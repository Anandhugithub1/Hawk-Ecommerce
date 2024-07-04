// controllers/authController.js
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator'); 


const register = async (req, res) => {
    const { email, password, phone, name } = req.body;

    try {
        // Check if user with email or phone already exists
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            email,
            password: hashedPassword,
            phone,
            name
        });

        // Save user to database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to login user with phone and OTP
const loginWithOTP = async (req, res) => {
    const { phone } = req.body;

    try {
        // Find user by phone number
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP (example: 4-digit OTP)
        const generatedOTP = otpGenerator.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        // Save OTP and OTP expiry (example: OTP valid for 5 minutes)
        user.otp = generatedOTP;
        user.otpExpiry = new Date();
        user.otpExpiry.setMinutes(user.otpExpiry.getMinutes() + 5); // OTP valid for 5 minutes
        await user.save();

        // Simulate sending OTP via SMS (replace with actual SMS sending code)
        console.log(`OTP for login: ${generatedOTP}`);

        res.json({ message: 'OTP sent to phone number' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to verify OTP and login user
const verifyOTPAndLogin = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        // Find user by phone number and OTP
        const user = await User.findOne({ phone, otp });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or phone number' });
        }

        // Check if OTP has expired
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
        }

        // Clear OTP and OTP expiry after successful login
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = {
    register,
    loginWithOTP,
    verifyOTPAndLogin
};
