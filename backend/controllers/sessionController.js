const Session = require('../models/Session');
const Question = require('../models/Question');

// @desc Create a new session and linked questions
// @route POST /api/session/create
// @access Private
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;
        const userId = req.user._id;

        const session = await Session.create({
            role,
            experience,
            topicsToFocus,
            description,
            user: userId,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    question: q.question,
                    answer: q.answer,
                    session: session._id,
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }   
};

// @desc Get all sessions for the logged-in user
// @route GET /api/session/my-sessions
// @access Private

exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('questions');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Get a session by ID with populated questions
// @route GET /api/session/:id
// @access Private
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate({
            path: 'questions',
            options: { sort: { isPinned: -1 , createdAt: -1 } },
        }
        ).exec();
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Delete a session and its linked questions
// @route DELETE /api/session/:id
// @access Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        //check if the session belongs to the logged-in user
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this session' });
        }
        //First delete all questions linked to the session
        await Question.deleteMany({ session: session._id });
        //Then delete the session
        await session.deleteOne();

        res.status(200).json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};