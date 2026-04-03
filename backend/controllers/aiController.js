const { GoogleGenerativeAI } = require("@google/generative-ai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const QUESTIONS_SCHEMA = {
    type: "array",
    items: {
        type: "object",
        properties: {
            question: { type: "string" },
            answer: { type: "string" },
        },
        required: ["question", "answer"],
    },
};

const EXPLANATION_SCHEMA = {
    type: "object",
    properties: {
        title: { type: "string" },
        explanation: { type: "string" },
    },
    required: ["title", "explanation"],
};

// @desc Generate interview questions and answers using Google Gemini
// @route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if (
            role === undefined ||
            experience === undefined ||
            topicsToFocus === undefined ||
            numberOfQuestions === undefined
        ) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Validate and sanitize inputs
        const sanitizedRole = String(role).replace(/[`"\\]/g, '').slice(0, 100);
        const sanitizedExperience = String(experience).replace(/[`"\\]/g, '').slice(0, 50);
        const sanitizedTopics = String(topicsToFocus).replace(/[`"\\]/g, '').slice(0, 200);
        const parsedCount = parseInt(numberOfQuestions, 10);
        if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 20) {
            return res.status(400).json({ success: false, message: 'numberOfQuestions must be between 1 and 20' });
        }

        const prompt = questionAnswerPrompt(sanitizedRole, sanitizedExperience, sanitizedTopics, parsedCount);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: QUESTIONS_SCHEMA,
            },
        });

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate questions' });
    }
};

// @desc Generate explanations for interview questions using Google Gemini
// @route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: 'Question is required' });
        }

        const sanitizedQuestion = String(question).replace(/[`"\\]/g, '').slice(0, 500);

        const prompt = conceptExplainPrompt(sanitizedQuestion);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: EXPLANATION_SCHEMA,
            },
        });

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate explanation' });
    }
};




module.exports = { generateInterviewQuestions, generateConceptExplanation };
