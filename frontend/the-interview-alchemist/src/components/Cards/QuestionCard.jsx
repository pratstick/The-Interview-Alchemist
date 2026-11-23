import React, { useEffect } from 'react';
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from 'react-icons/lu';
import AIResponsePreview from '../../pages/InterviewPrep/components/AIResponsePreview';

const QuestionCard = ({
    question,
    answer,
    onLearnMore,
    isPinned,
    onTogglePin,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [height, setHeight] = React.useState(0);
    const contentRef = React.useRef(null);

    useEffect(() => {
        if (isExpanded) {
            const contentHeight = contentRef.current?.scrollHeight || 0;
            setHeight(contentHeight + 10);
        } else {
            setHeight(0);
        }
    }, [isExpanded]);
    
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl py-4 px-5 mb-4 overflow-hidden shadow-sm hover:shadow-md dark:shadow-gray-900/50 border border-gray-200/80 dark:border-gray-700/80 transition-all group'>
            <div 
                className='flex items-start justify-between cursor-pointer select-none'
                onClick={toggleExpand}
            >
                <div className='flex items-start gap-3.5 flex-1 min-w-0 pr-2'>
                    <span className='flex-shrink-0 text-xs md:text-sm font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 w-6 h-6 rounded-full flex items-center justify-center mt-0.5'>
                        Q
                    </span>
                    <h3 className='text-sm md:text-[15px] font-medium text-gray-800 dark:text-gray-100 leading-snug'>
                        {question}
                    </h3>
                </div>
                <div 
                    className='flex items-center justify-end gap-1.5 ml-2 flex-shrink-0'
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        className='flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer transition-colors'
                        title={isPinned ? "Unpin question" : "Pin question"}
                        aria-label={isPinned ? "Unpin question" : "Pin question"}
                        onClick={onTogglePin}
                    >
                        {isPinned ? <LuPinOff className='text-xs text-indigo-600 dark:text-indigo-400'/> : <LuPin className='text-xs'/>}
                    </button>
                    <button
                        className='flex items-center gap-1.5 text-xs text-cyan-800 dark:text-cyan-300 font-medium bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 cursor-pointer transition-colors'
                        title="Learn more with AI explanation"
                        onClick={() => {
                            onLearnMore();
                            setIsExpanded(true);
                        }}
                    >
                        <LuSparkles size={13} />
                        <span className='hidden sm:inline'>Learn More</span>
                    </button>
                    <button
                        className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 cursor-pointer transition-colors'
                        aria-label={isExpanded ? "Collapse answer" : "Expand answer"}
                        onClick={toggleExpand}
                    >
                        <LuChevronDown
                            size={18}
                            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                        />
                    </button>    
                </div>
            </div>
            <div 
                className='overflow-hidden transition-all duration-300 ease-in-out'
                style={{ maxHeight: `${height}px` }}
            >
                <div ref={contentRef} className='mt-3.5 text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-900/60 p-4 rounded-lg border border-gray-150 dark:border-gray-750'>
                    <AIResponsePreview content={answer} />
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;