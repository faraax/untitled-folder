const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id, expiresIn) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ full_name, email, password });
        await user.save();

        const access = generateToken(user._id, process.env.JWT_EXPIRE);
        const refresh = generateToken(user._id, process.env.JWT_REFRESH_EXPIRE);

        res.status(201).json({
            access,
            refresh
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const access = generateToken(user._id, process.env.JWT_EXPIRE);
        const refresh = generateToken(user._id, process.env.JWT_REFRESH_EXPIRE);

        res.status(200).json({
            access,
            refresh
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh Token
exports.refreshToken = (req, res) => {
    const { refresh } = req.body;
    if (!refresh) {
        res.status(403).json({ message: 'Refresh token required' });
    }

    jwt.verify(refresh, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Invalid refresh token' });
        }
        const access = generateToken(user.id, process.env.JWT_EXPIRE);
        res.status(200).json({
            access
        });
    });
};

// Get user profile
exports.getUserProfile = (req, res) => {
    const user = req.user;
    res.status(200).json({
        id: "user._id",
        email: "user.email"
    });
};
