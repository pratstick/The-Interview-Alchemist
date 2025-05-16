import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="h-16 bg-neutral-50 shadow flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <img
                        src="/logo.svg"
                        alt="The Interview Alchemist Logo"
                        className="h-8 w-8"
                    />
                    <h2 className="text-lg sm:text-2xl font-semibold text-neutral-900 whitespace-nowrap">The Interview Alchemist</h2>
                </Link>
            </div>
            <ProfileInfoCard />
        </div>    
    );
};

export default Navbar;