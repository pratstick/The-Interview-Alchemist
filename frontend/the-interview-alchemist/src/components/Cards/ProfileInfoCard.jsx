import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { getProfileImageUrl } from '../../utils/helper';

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
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                    src={getProfileImageUrl(user.profileImageUrl)}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <span className="hidden md:block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user.name || "User"}
                </span>
            </Link>
            <button
                className="ml-1 px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-orange-100 dark:hover:bg-gray-600 transition cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ProfileInfoCard;