import React, { useContext } from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
    const { user } = useContext(UserContext);
    return (
        <div className="h-16 bg-neutral-50 shadow flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <img
                        src="/logo.svg"
                        alt="The Interview Alchemist Logo"
                        className="h-8 w-8"
                    />
                    <h2 className="ext-base sm:text-lg md:text-2xl font-semibold text-neutral-900 whitespace-nowrap truncate max-w-[120px] sm:max-w-none">The Interview Alchemist</h2>
                </Link>
            </div>
            <div className="flex items-center gap-3">
                {user && (
                    <Link
                        to="/profile"
                        className="hidden sm:flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                        My Profile
                    </Link>
                )}
                <ProfileInfoCard />
            </div>
        </div>    
    );
};

export default Navbar;