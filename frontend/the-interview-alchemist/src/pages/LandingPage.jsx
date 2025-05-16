import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import HERO_IMG from "../assets/hero-img.png";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from 'react-router-dom';
import { LuSparkles } from 'react-icons/lu';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Modal from '../components/Modal';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';

const INTERVIEW_TIPS = [
  "Practice behavioral questions as much as technical ones.",
  "Consistency and confidence are key.",
  "Review your fundamentals regularly.",
  "Simulate real interviews with a timer.",
  "Take notes on every session and review mistakes.",
  "Stay calm and ask clarifying questions if needed.",
];

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [showTip, setShowTip] = useState(0);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  // Cycle through interview tips every 7 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowTip((prev) => (prev + 1) % INTERVIEW_TIPS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Animated background blobs */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-amber-200/20 blur-[65px] top-0 left-0 animate-pulse" />
        <div className="absolute w-[350px] h-[350px] bg-blue-200/20 blur-[80px] bottom-0 right-0 animate-pulse" />
      </div>

      <div className="w-full min-h-full bg-[#FFFCEF]">
        <div className='container mx-auto px-4 pt-6 pb-[200px] relative z-10'>
          <header className='flex justify-between items-center mb-16'>
            <div className='text-xl text-black font-bold tracking-tight flex items-center gap-2'>
              <img
                src="/logo.svg"
                alt="The Interview Alchemist Logo"
                className="h-9 w-9"
              />
              {/*<img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini AI" className="w-7 h-7 mr-1" />*/}
              The Interview Alchemist
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className='bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer shadow'
                onClick={() => setOpenAuthModal(true)}
              >
                Login/SignUp
              </button>
            )}
          </header>
          <div className='flex flex-col md:flex-row items-center md:justify-between'>
            <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
              <div className='flex items-center justify-left mb-2'>
                <div className='flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-sm'>
                  <LuSparkles /> AI powered
                </div>
              </div>
              <h1 className='text-5xl text-black font-medium mb-4 leading-tight drop-shadow-sm'>
                Crack Interviews with <br />
                <span className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold'>
                  AI-Enhanced
                </span>
                <span> Preparation</span>
              </h1>
              {/* Powered by Google Gemini - prominent badge */}
              <div className="flex items-center gap-3 mb-6 mt-2 bg-white/80 px-4 py-2 rounded-full shadow border border-gray-200 w-fit">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
                  alt="Gemini AI"
                  className="w-8 h-8"
                />
                <span className="text-lg text-gray-700 font-medium tracking-wide">
                  Powered by Google Gemini
                </span>
              </div>
              <p className='text-[17px] text-gray-900 mr-0 md:mr-20 mb-6'>
                Get role-specific questions, expand concepts when you're ready, master fundamentals, and track your growth—
                your complete interview transformation starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className='bg-black text-base font-semibold text-white px-7 py-3 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer shadow'
                  onClick={handleCTA}
                >
                  Get Started
                </button>
                <button
                  className='bg-white text-base font-semibold text-black px-7 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer shadow'
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                >
                  See Features
                </button>
              </div>
              {/* Animated tip below CTA */}
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs font-semibold shadow">
                  💡 Tip
                </span>
                <span className="text-sm text-gray-700 transition-all duration-500">{INTERVIEW_TIPS[showTip]}</span>
              </div>
            </div>
            <div className='w-full md:w-1/2 flex flex-col items-center'>
              <img
                src={HERO_IMG}
                alt="Hero"
                className='w-full max-w-3xl rounded-lg shadow-lg border border-amber-100 animate-fade-in'
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='w-full min-h-full bg-[#FFFCEF] mt-10'>
        <div className='container mx-auto px-4 pt-10 pb-20'>
          <section className='mt-5'>
            <h2 className='text-2xl font-medium text-center mb-12'>
              Features that make you shine
            </h2>
            <div className='flex flex-col items-center gap-8'>
              {/*First 3 cards*/}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100 flex flex-col items-center text-center group'
                  >
                    <div className="mb-3">
                      {/* Example icon, replace with your own or from feature.icon */}
                      <span className="inline-block bg-amber-100 text-amber-600 rounded-full p-3 text-2xl group-hover:scale-110 transition-transform">
                        {feature.icon || <LuSparkles />}
                      </span>
                    </div>
                    <h3 className='text-base font-semibold mb-3'>{feature.title}</h3>
                    <p className='text-gray-600'>{feature.description}</p>
                  </div>
                ))}
              </div>
              {/*Remaining cards*/}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100 flex flex-col items-center text-center group'
                  >
                    <div className="mb-3">
                      <span className="inline-block bg-amber-100 text-amber-600 rounded-full p-3 text-2xl group-hover:scale-110 transition-transform">
                        {feature.icon || <LuSparkles />}
                      </span>
                    </div>
                    <h3 className='text-base font-semibold mb-3'>{feature.title}</h3>
                    <p className='text-gray-600'>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-amber-400 hover:bg-amber-500 text-white rounded-full p-3 shadow-lg transition-all"
        style={{ display: window.scrollY > 200 ? "block" : "none" }}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer */}
      <div className='text-sm bg-gray-50 text-secondary text-center p-5 mt-5 border-t border-gray-200'>
        <div className="flex flex-col items-center gap-1">
          <span>
            Made with ❤️...Happy Coding
          </span>
          <div className="flex items-center gap-2 mt-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
              alt="Gemini AI"
              className="w-5 h-5"
            />
            <span className="text-xs text-gray-500 font-semibold">
              Powered by Google Gemini
            </span>
          </div>
          <a
            href="https://github.com/pratstick/The-Interview-Alchemist"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-xs mt-2 transition-colors"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;