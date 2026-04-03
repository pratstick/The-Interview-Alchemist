const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getProgressStats, updateGoals } = require('../controllers/progressController');

const router = express.Router();

router.get('/stats', protect, getProgressStats);
router.put('/goals', protect, updateGoals);

module.exports = router;
