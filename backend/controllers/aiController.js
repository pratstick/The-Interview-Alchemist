const { GoogleGenerativeAI, GoogleGenerativeAIResponseError, GoogleGenerativeAIFetchError } = require("@google/generative-ai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const QUESTIONS_SCHEMA = {
    type: "object",
    properties: {
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "answer"],
            },
        },
    },
    required: ["questions"],
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
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: QUESTIONS_SCHEMA,
            },
        });

        const result = await model.generateContent(prompt);

        let responseText;
        try {
            responseText = result.response.text();
        } catch (responseError) {
            console.error('generateInterviewQuestions: AI response error:', responseError.message);
            return res.status(503).json({ success: false, message: 'AI response was blocked or unavailable' });
        }

        if (!responseText) {
            console.error('generateInterviewQuestions: Empty response from AI');
            return res.status(503).json({ success: false, message: 'AI returned an empty response' });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('generateInterviewQuestions: JSON parse error:', parseError.message, '| Response preview:', responseText.slice(0, 200));
            return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
        }

        if (!Array.isArray(data.questions)) {
            console.error('generateInterviewQuestions: Unexpected response structure:', JSON.stringify(data).slice(0, 200));
            return res.status(500).json({ success: false, message: 'AI returned unexpected response format' });
        }

        res.status(200).json(data.questions);
    } catch (error) {
        console.error('generateInterviewQuestions error:', error.name, error.message);
        if (error instanceof GoogleGenerativeAIFetchError) {
            return res.status(503).json({ success: false, message: 'AI service request failed' });
        }
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
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: EXPLANATION_SCHEMA,
            },
        });

        const result = await model.generateContent(prompt);

        let responseText;
        try {
            responseText = result.response.text();
        } catch (responseError) {
            console.error('generateConceptExplanation: AI response error:', responseError.message);
            return res.status(503).json({ success: false, message: 'AI response was blocked or unavailable' });
        }

        if (!responseText) {
            console.error('generateConceptExplanation: Empty response from AI');
            return res.status(503).json({ success: false, message: 'AI returned an empty response' });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('generateConceptExplanation: JSON parse error:', parseError.message, '| Response preview:', responseText.slice(0, 200));
            return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
        }

        if (!data.title || !data.explanation) {
            console.error('generateConceptExplanation: Missing required fields in response:', JSON.stringify(data).slice(0, 200));
            return res.status(500).json({ success: false, message: 'AI returned an incomplete response' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('generateConceptExplanation error:', error.name, error.message);
        if (error instanceof GoogleGenerativeAIResponseError) {
            return res.status(503).json({ success: false, message: 'AI response was blocked or unavailable' });
        }
        if (error instanceof GoogleGenerativeAIFetchError) {
            return res.status(503).json({ success: false, message: 'AI service request failed' });
        }
        res.status(500).json({ success: false, message: 'Failed to generate explanation' });
    }
};




module.exports = { generateInterviewQuestions, generateConceptExplanation };
