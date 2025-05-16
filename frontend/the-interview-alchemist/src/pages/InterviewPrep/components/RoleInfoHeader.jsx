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
            <div className="container mx-auto px-10 md:px-0">
                <div className="h-[200px] flex flex-col justify-center relative">
                    {/* Blob elements - always behind content */}
                    <div className="w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-center overflow-hidden absolute top-0 right-0 -z-10 pointer-events-none">
                        <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1" />
                        <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2" />
                        <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3" />
                        <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1" />
                    </div>
                    {/* Glassy content */}
                    <div className="relative z-10 rounded-xl bg-white/40 backdrop-blur-md border border-white/30 shadow-lg p-6">
                        <div className="flex items-start">
                            <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-medium">{role}</h2>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {topicsToFocus}
                                        </p> 
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="text-[10px] font-semibold text-white bg-black/70 px-3 py-1 rounded-full">
                                Experience: {experience} {experience > 1 ? "years" : "year"}
                            </div>
                            <div className="text-[10px] font-semibold text-white bg-black/70 px-3 py-1 rounded-full">
                                {questions} Q&amp;A
                            </div>
                            <div className="text-[10px] font-semibold text-white bg-black/70 px-3 py-1 rounded-full">
                                Last Updated: {lastUpdated}
                            </div>            
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default RoleInfoHeader;