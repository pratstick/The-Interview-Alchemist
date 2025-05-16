const Question = require("../models/Question");

const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
    You are an AI assistant helping a user prepare for a job interview which generates technical interview questions and answers.

    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Topics to focus on: ${topicsToFocus}
    - Number of questions: ${numberOfQuestions}
    - For each question, provide a detailed answer and an example if applicable. (beginner friendly)
    - If the answers needs code examples, provide the code in a code block.
    - Provide the answer in a clear and concise manner.
    - keep formatting very clean
    - Return a pure JSON array like:
    [
        {
            "question": "What is the difference between a class and an object?",
            "answer": "A class is a blueprint for creating objects. An object is an instance of a class."
        },
        {
            "question": "What is polymorphism?",
            "answer": "Polymorphism allows methods to do different things based on the object it is acting upon."
        }
        // ...
    ]
    Important: Do not include any other text or explanation. Just return the valid JSON array.
`);


const conceptExplainPrompt = (question) => (`
    You are an AI assistant helping a user understand a technical concept.

    Task:
    - Explain the following interview question and it's concept in depth as if you are a teacher and teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the answer needs code examples, provide the code in a code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:
    {
        "title": "Title of the concept",
        "explanation": "Detailed explanation of the concept"
    }
    Important: Do not include any other text or explanation. Just return the valid JSON object.
`);

module.exports = {
    questionAnswerPrompt,
    conceptExplainPrompt,
};