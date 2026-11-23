import React from "react";

const RoleInfoHeader = ({
    role,
    topicsToFocus,
    experience,
    questions,
    description,
    lastUpdated,
}) => {
    return (
        <div className="relative">
            <div className="max-w-5xl mx-auto px-4">
                <div className="py-6 flex flex-col justify-center relative">
                    {/* Blob elements - always behind content */}
                    <div className="w-[40vw] md:w-[30vw] h-[180px] flex items-center justify-center overflow-hidden absolute top-0 right-0 -z-10 pointer-events-none">
                        <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1" />
                        <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2" />
                        <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3" />
                        <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1" />
                    </div>
                    {/* Glassy content */}
                    <div className="relative z-10 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700/50 shadow-sm p-6">
                        <div className="flex items-start">
                            <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{role}</h1>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                                            {topicsToFocus}
                                        </p> 
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 px-3 py-1 rounded-full">
                                Experience: {experience} {experience === "1" || experience === 1 ? "year" : "years"}
                            </div>
                            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 bg-blue-100/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3 py-1 rounded-full">
                                {questions} Q&amp;A
                            </div>
                            {lastUpdated && (
                                <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full">
                                    Last Updated: {lastUpdated}
                                </div>            
                            )}
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default RoleInfoHeader;