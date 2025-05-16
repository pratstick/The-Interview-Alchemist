# The Interview Alchemist

A full-stack MERN application to help you prepare for technical interviews with AI-generated questions, session management, and personalized dashboards.

---

## Features

- **AI-Powered Interview Sessions:**  
  Generate custom interview questions and answers for any role, experience, and topics using Google Gemini AI.

- **Session Management:**  
  Create, view, pin/unpin, and delete interview prep sessions. Each session tracks your questions, answers, and notes.

- **Dashboard Overview:**  
  - Personalized welcome and motivational tips  
  - Quick stats: total sessions, total questions, pinned questions, recently updated  
  - Search and filter sessions by role, topic, or description  
  - Responsive empty state illustration and call-to-action

- **Question Management:**  
  - Pin/unpin important questions  
  - Add notes to questions  
  - Request AI-powered explanations for any question

- **Modern UI:**  
  - Responsive design with Tailwind CSS  
  - Clean, accessible modals and alert dialogs  
  - Mobile-friendly layouts

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router, Moment.js
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI Integration:** Google Gemini (via @google/genai)
- **Authentication:** JWT-based (with protected routes)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/The-Interview-Alchemist.git
cd The-Interview-Alchemist
```

### 2. Setup Environment Variables

- Copy `.env.example` to `.env` in both `/backend` and `/frontend` folders and fill in your values (MongoDB URI, JWT secret, Google API key, etc).

### 3. Install Dependencies

```bash
# In the root folder
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run the App

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Structure

```
/backend
  /controllers
  /models
  /routes
  /utils
  server.js
/frontend
  /src
    /components
    /pages
    /utils
    App.jsx
    main.jsx
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Credits

- [Popsy Illustrations](https://popsy.co/)
- [Google Gemini AI](https://ai.google.dev/)