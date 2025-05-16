const Question = require('../models/Question');
const Session = require('../models/Session');

// @desc Add additional questions to an existing session
// @route POST /api/questions/add
// @access Private
exports.addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body;

        if(!sessionId || !questions || questions.length === 0 || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: 'Session ID and questions are required' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Create new questions and associate them with the session

        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                question: q.question,
                answer: q.answer,
                session: sessionId,
            }))
        );
        //Update the session with the new questions ids
        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();
        res.status(201).json({ success: true, questions: createdQuestions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Pin or unpin a question
// @route POST /api/questions/:id/pin
// @access Private
exports.togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question.isPinned = !question.isPinned;
        await question.save();
        res.status(200).json({ success: true, question });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Update notes for a question
// @route POST /api/questions/:id/note
// @access Private
exports.updateQuestionNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question.note = note || "";
        await question.save();
        res.status(200).json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}; 