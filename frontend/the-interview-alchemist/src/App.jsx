import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import UserProvider from './context/UserContext';
import ThemeProvider from './context/ThemeContext';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <div>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
            </Routes>
            <Toaster
              toastOptions={{
                className: "",
                style: {
                  fontSize: "13px",
                },
              }}
            />
          </div>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App; 