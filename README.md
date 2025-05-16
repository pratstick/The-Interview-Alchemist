# The Interview Alchemist

**Ace your next tech interview with AI-powered prep, smart dashboards, and a beautiful, modern UI.**

---

## What is The Interview Alchemist?

The Interview Alchemist is your personal interview coach. It generates custom technical interview questions, lets you manage sessions, pin and annotate questions, and gives you actionable insights—all in a slick, responsive dashboard. Powered by Google Gemini and built with the modern MERN stack.

---

## Features

- **AI-Powered Interview Sessions**  
  Instantly generate tailored interview questions and answers for any role, experience, or topic.

- **Session Management**  
  Create, view, pin/unpin, and delete interview prep sessions. Track your progress and notes.

- **Smart Dashboard**  
  - Personalized welcome and motivational tips  
  - Quick stats: sessions, questions, pinned, recently updated  
  - Search and filter by role, topic, or description  
  - Beautiful empty state illustrations and CTAs

- **Question Management**  
  - Pin/unpin important questions  
  - Add notes to any question  
  - Get AI-powered explanations for tricky concepts

- **Modern, Responsive UI**  
  - Built with Tailwind CSS  
  - Accessible modals, dialogs, and mobile-friendly layouts

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router, Moment.js  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **AI Integration:** Google Gemini (via @google/genai)  
- **Authentication:** JWT-based (with protected routes)

---

## Quickstart

### 1. Clone the repo

```bash
git clone https://github.com/pratstick/The-Interview-Alchemist.git
cd The-Interview-Alchemist
```

### 2. Configure Environment Variables

- Copy `.env.example` to `.env` in both `/backend` and `/frontend` folders.
- Fill in your MongoDB URI, JWT secret, Google API key, etc.

### 3. Install Dependencies

```bash
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

Open [http://localhost:5173](http://localhost:5173) and start prepping!

---

## Project Structure

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

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.  
Ideas for new features, UI improvements, or bug fixes are always appreciated.

---

## License

This project is licensed under the [GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.en.html).  
See the [LICENSE](LICENSE) file for details.

---

## Credits

- [Popsy Illustrations](https://popsy.co/)
- [Google Gemini AI](https://ai.google.dev/)

---

> **Made with ☕, code, and a dash of AI magic. Good luck on your interviews!**