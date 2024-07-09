// controllers/authController.js
const User = require('../models/user');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');


const register = async (req, res) => {
    const { email, password, phone, name } = req.body;
    if (!email || !password || !phone || !name) {
        return res.status(400).json({ message: 'please fill all fields' });
    }
    try {
        // Check if user with email or phone already exists
        let  existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
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

// Controller function to login user with email and password
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    register,
  login
};
