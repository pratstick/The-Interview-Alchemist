import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="h-16 bg-neutral-50 shadow flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <Link to="/dashboard">
                    <h2 className="text-2xl font-semibold text-neutral-900">The Interview Alchemist</h2>
                </Link>
            </div>
            <ProfileInfoCard />
        </div>    
    );
};

export default Navbar;