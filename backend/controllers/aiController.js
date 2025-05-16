const { GoogleGenAI } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

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
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        // Clean the response text: Remove ``` json and ``` from the response
        const cleanedText = rawText
           .replace(/^\s*```(?:json)?\s*/i, "")   // Remove starting ``` or ```json (case-insensitive)
           .replace(/\s*```\s*$/i, "")            // Remove ending ```
           .trim();

        // Now parse the cleaned text as JSON
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate questions', error: error.message });
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

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });
        let rawText = response.text;
        // Clean the response text: Remove ``` json and ``` from the response
        const cleanedText = rawText
            .replace(/^\s*```(?:json)?\s*/i, "")   // Remove starting ``` or ```json (case-insensitive)
            .replace(/\s*```\s*$/i, "")            // Remove ending ```
            .trim();
        const data = JSON.parse(cleanedText);
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate explanation', error: error.message });
    }
}




module.exports = { generateInterviewQuestions, generateConceptExplanation };
