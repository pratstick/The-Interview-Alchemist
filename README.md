# The Interview Alchemist

A web app to help you prepare for technical interviews. Generate questions, manage study sessions, and track your progress.

## About

This project started as a way to practice for coding interviews without having to manually search for questions or remember what I've already covered. It uses Google's Gemini AI to generate relevant interview questions based on the role and experience level you're targeting.

You can create different sessions for different types of interviews (frontend, backend, data structures, etc.), pin important questions, and get explanations for concepts you're struggling with.

## What it does

The app lets you create interview prep sessions where you specify:
- What role you're preparing for
- Your experience level  
- Topics you want to focus on

It then generates a set of relevant questions with answers. You can pin questions you want to review later, and click "Learn More" on any question to get a deeper explanation of the concepts involved.

There's also a dashboard that shows your recent sessions and some basic stats.

## Tech Stack

Frontend: React, Tailwind CSS, React Router  
Backend: Node.js, Express, MongoDB  
AI: Google Gemini API

## Setup

Clone the repo:
```bash
git clone https://github.com/pratstick/The-Interview-Alchemist.git
cd The-Interview-Alchemist
```

You'll need to set up environment variables. Copy the `.env.example` files in both `backend` and `frontend` directories and fill in your MongoDB URI, JWT secret, and Google Gemini API key.

Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend/the-interview-alchemist
npm install
```

Run both servers:
```bash
# Backend (in backend directory)
npm run dev

# Frontend (in frontend/the-interview-alchemist directory)  
npm run dev
```

The frontend should be available at http://localhost:5173.

## Project Structure

```
backend/
  controllers/    # API route handlers
  models/        # MongoDB schemas  
  routes/        # Express routes
  utils/         # Helper functions
  server.js      # Main server file

frontend/the-interview-alchemist/
  src/
    components/  # Reusable React components
    pages/       # Main page components
    utils/       # Frontend utilities
    context/     # React context for state
```

## Contributing

Feel free to open issues or submit pull requests. I'm particularly interested in:
- UI/UX improvements
- Better question generation prompts  
- Mobile responsiveness fixes
- Performance optimizations

## License

GPL-3.0 License - see LICENSE file

---

Built during my own interview prep journey. Hope it helps with yours too!
