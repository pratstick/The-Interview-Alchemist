const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser, uploadProfileImage } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Auth routes

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser); // Login a user
router.post('/logout', protect, logoutUser); // Logout a user (clears cookie)
router.get('/profile', protect, getUserProfile); // Get user profile (protected route)

router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);



module.exports = router;