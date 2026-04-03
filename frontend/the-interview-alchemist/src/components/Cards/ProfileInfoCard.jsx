import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    };

    return user && (
        <div className="flex items-center gap-3">
            <img
                src={user.profileImageUrl || "https://picsum.photos/200"}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                {user.name || "User Name"}
            </span>
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                    src={user.profileImageUrl || "https://picsum.photos/200"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-300"
                />
                <span className="hidden md:block text-base font-medium text-gray-800">
                    {user.name || "User Name"}
                </span>
            </Link>
            <button
                className="ml-2 px-3 py-1 rounded bg-blue-600 dark:bg-blue-700 text-white text-xs font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ProfileInfoCard;