const express = require('express');
const { togglePinQuestion, updateQuestionNotes, addQuestionsToSession } = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/add', protect, addQuestionsToSession); // Add questions to a session
router.post('/:id/pin', protect, togglePinQuestion); // Pin or unpin a question
router.post('/:id/note', protect, updateQuestionNotes); // Update notes for a question

module.exports = router;