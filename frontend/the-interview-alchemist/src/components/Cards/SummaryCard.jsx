import React from 'react'
import { LuTrash2 } from 'react-icons/lu';
import { getInitials } from '../../utils/helper';

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete
}) => {
  const bgStyle = typeof colors === 'string' ? colors : colors?.bgcolor;

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 relative group flex flex-col justify-between" 
      onClick={onSelect}
    >
      {/* Header Section */}
      <div 
        className="rounded-lg p-4 relative border border-black/5 dark:border-white/5 dark:!bg-none dark:bg-gray-750"
        style={{ background: bgStyle }}
      >
        <div className="flex items-start">
          {/* Avatar Square */}
          <div className="flex-shrink-0 w-11 h-11 bg-white/90 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3.5 shadow-sm border border-black/5 dark:border-white/10">
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">
              {getInitials(role)}
            </span>
          </div>

          {/* Content Container */}
          <div className="flex-grow min-w-0 pr-6">
            <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 truncate">{role}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">{topicsToFocus}</p>
          </div>
        </div>

        {/* Delete Button */}
        <button 
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center w-7 h-7 text-rose-500 hover:text-rose-600 bg-white/90 dark:bg-gray-800 rounded-md border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-opacity absolute top-3 right-3 shadow-sm cursor-pointer"
          title="Delete session"
          aria-label="Delete session"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 size={13} />
        </button>
      </div>

      {/* Footer Section */}
      <div className="px-1 pt-3 pb-1">
        {/* Stats Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-full">
            Exp: {experience} {experience === "1" || experience === 1 ? "yr" : "yrs"}
          </span> 

          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-full">
            {questions} Q&amp;A
          </span>

          {lastUpdated && (
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 px-2.5 py-0.5 bg-gray-50 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700 rounded-full">
              {lastUpdated}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-[12px] text-gray-500 dark:text-gray-300 font-normal line-clamp-2 mt-2.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>                       
  );
};

export default SummaryCard;