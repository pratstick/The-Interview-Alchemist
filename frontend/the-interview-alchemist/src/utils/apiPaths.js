export const BASE_URL = 'http://localhost:8000';

export const API_PATHS = {
    AUTH: {
        LOGIN: `/api/auth/login`,
        REGISTER: `/api/auth/register`,
        GET_PROFILE: `/api/auth/profile`,
    },

    IMAGE:  {
        UPLOAD_IMAGE: `/api/auth/upload-image`, // Upload image 
    },
    
    AI: {
        GENERATE_QUESTIONS: `/api/ai/generate-questions`,
        GENERATE_EXPLANATION: `/api/ai/generate-explanation`,
    },

    SESSION: {
        CREATE: `/api/sessions/create`, // Create a new session with questions
        GET_ALL: `/api/sessions/my-sessions`, // Get all sessions
        GET_ONE: (id) => `/api/sessions/${id}`, // Get a specific session by ID
        DELETE: (id) => `/api/sessions/${id}`, // Delete a specific session by ID
    },

    QUESTION: {
        ADD_TO_SESSION: "/api/questions/pin", // Add a question to a session
        PIN: (id) => `/api/questions/${id}/pin`, // Pin a question
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update a question's note
    },
};    
