# The Interview Alchemist

<div align="center">

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

**An AI-powered interview preparation platform that generates role-specific questions, tracks your progress, and helps you master concepts — built on Google Gemini.**

[✨ Features](#features) • [🚀 Quick Start](#quick-start) • [⚙️ Configuration](#configuration) • [📁 Project Structure](#project-structure) • [🤝 Contributing](#contributing)

</div>

---

## About

The Interview Alchemist transforms your interview preparation with Google Gemini AI. Specify a target role and experience level, get a tailored set of Q&A pairs, pin the questions that matter most, and deep-dive into any concept with AI-generated explanations — all in one place.

---

## Features

| Feature | Description |
|---|---|
| 🎯 **Role-Specific Sessions** | Generate 10 targeted interview questions based on your role, experience, and chosen topics |
| 📌 **Pin & Bookmark** | Bookmark key questions to build a personal revision list |
| 🧠 **AI Explanations** | Click "Learn More" on any question for a concept-level deep dive powered by Gemini |
| 📊 **Progress Dashboard** | Track total sessions, Q&A count, and pinned questions at a glance |
| 🔍 **Search & Filter** | Quickly find sessions by role, topic, or description |
| 🔐 **Secure Auth** | JWT in httpOnly cookies with CSRF double-submit protection |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` |
| **Auth** | JWT (httpOnly cookie) + CSRF tokens |

---

## Quick Start

### Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

### 1. Clone the repository

```bash
git clone https://github.com/pratstick/The-Interview-Alchemist.git
cd The-Interview-Alchemist
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend (from the repo root)
cd ../frontend/the-interview-alchemist && npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example backend/.env
```

Open `backend/.env` and set the variables (see [Configuration](#configuration) below).

### 4. Run the servers

Open two terminals:

```bash
# Terminal 1 — backend (from /backend)
npm run dev

# Terminal 2 — frontend (from /frontend/the-interview-alchemist)
npm run dev
```

Frontend: **http://localhost:5173** | Backend: **http://localhost:8000**

---

## Configuration

Create a `backend/.env` file with the following keys:

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string (see below) |
| `GOOGLE_API_KEY` | ✅ | Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey) |
| `JWT_SECRET` | ✅ | A long random string used to sign JWTs |
| `PORT` | ❌ | Server port (default: `8000`) |
| `ALLOWED_ORIGIN` | ❌ | CORS origin for the frontend (default: `http://localhost:5173`) |

### Getting a MongoDB Atlas URI

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a **free M0 cluster**.
2. In the cluster overview, click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
3. Replace `<username>`, `<password>`, and `<dbname>` with your credentials.
4. Under **Security → Network Access**, add your current IP address (or `0.0.0.0/0` for local development).

> **Troubleshooting** — if you see `querySrv ENOTFOUND`, the three most common causes are:
> - The cluster hostname in the URI is incorrect. Re-copy it from the Atlas dashboard.
> - Your IP is not whitelisted in **Network Access**.
> - A firewall or VPN is blocking outbound connections on port 27017.

---

## Project Structure

```
The-Interview-Alchemist/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection with diagnostic errors
│   ├── controllers/
│   │   ├── authController.js   # Register / login / logout
│   │   ├── sessionController.js
│   │   ├── questionController.js
│   │   └── aiController.js     # Gemini integration
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── uploadMiddleware.js # Multer file uploads
│   ├── models/                 # Mongoose schemas (User, Session, Question)
│   ├── routes/                 # Express routers
│   ├── utils/
│   │   └── prompts.js          # Gemini prompt templates
│   └── server.js               # App entry point
│
└── frontend/the-interview-alchemist/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── Auth/           # Login & SignUp
        │   ├── Home/           # Dashboard & CreateSessionForm
        │   └── InterviewPrep/ # Interview session view
        ├── components/
        │   ├── Cards/          # SummaryCard, QuestionCard, ProfileInfoCard
        │   ├── layouts/        # Navbar, DashboardLayout
        │   ├── Inputs/         # Input, ProfilePhotoSelector
        │   └── loader/         # SpinnerLoader, SkeletonLoader
        ├── context/
        │   └── UserContext.jsx
        └── utils/
            ├── axiosInstance.js # Axios with CSRF header injection
            ├── apiPaths.js
            ├── data.js          # Static data (features, card colours)
            └── helper.js
```

---

## API Overview

All endpoints are prefixed with `/api`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a new account |
| POST | `/auth/login` | — | Login and receive a JWT cookie |
| POST | `/auth/logout` | ✅ | Clear the session cookie |
| GET | `/sessions` | ✅ | List all sessions for the current user |
| POST | `/sessions` | ✅ | Create a new session |
| GET | `/sessions/:id` | ✅ | Get a session with its questions |
| DELETE | `/sessions/:id` | ✅ | Delete a session |
| PUT | `/questions/:id/pin` | ✅ | Toggle pin on a question |
| POST | `/ai/generate-questions` | ✅ | Generate interview Q&A via Gemini |
| POST | `/ai/generate-explanation` | ✅ | Get a concept explanation via Gemini |

---

## Contributing

Contributions are welcome! Please open an issue first to discuss significant changes.

Areas where help is especially appreciated:

- 📱 **Mobile responsiveness** — some layouts still need polish on small screens
- 🧪 **Tests** — unit tests for backend controllers, component tests for the frontend
- 🎨 **UI/UX improvements** — animations, accessibility, dark mode
- 💬 **Better prompts** — more accurate or detailed Gemini prompt engineering
- 🌐 **Internationalisation** — support for non-English users

```bash
# After making changes, lint and build to check for issues
cd frontend/the-interview-alchemist && npm run lint && npm run build
node --check backend/server.js
```

---

## License

[GPL-3.0](LICENSE) — see the LICENSE file for full details.

---

<div align="center">Built during my own interview prep journey. Hope it helps with yours too! ✨</div>
