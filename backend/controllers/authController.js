const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

//Generate JWT token
const generateToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);
        res.cookie('token', token, COOKIE_OPTIONS);

        //Return user data
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.cookie('token', token, COOKIE_OPTIONS);

        // Return user data
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private(requires jwt token)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Logout user (clear cookie)
// @route POST /api/auth/logout
// @access Private
const logoutUser = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc Upload / update profile image
// @route POST /api/auth/upload-image
// @access Private
const uploadProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete the old profile image if it exists and is stored locally
    const user = await User.findById(req.user._id);
    if (user && user.profileImageUrl) {
        try {
            const oldFilename = path.basename(new URL(user.profileImageUrl).pathname);
            const oldFilePath = path.join(__dirname, '..', 'uploads', oldFilename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        } catch {
            // Ignore cleanup errors — the new file has already been saved
        }
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Persist the new URL on the user document
    await User.findByIdAndUpdate(req.user._id, { profileImageUrl: imageUrl });

    res.status(200).json({ imageUrl });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    uploadProfileImage,
}; 