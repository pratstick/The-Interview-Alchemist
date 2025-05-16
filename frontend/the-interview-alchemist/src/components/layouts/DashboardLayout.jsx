import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
    const { user } = useContext(UserContext);
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
                {user && children}
            </div>
            {/* Footer */}
            <div className='text-sm bg-gray-50 text-secondary text-center p-5 border-t border-gray-200'>
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
        </div>
    );
};

export default DashboardLayout;