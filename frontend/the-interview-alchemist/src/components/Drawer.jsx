import { LuX } from 'react-icons/lu'

const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <div
            className={`fixed top-[64px] right-0 z-[100] h-[calc(100vh-64px)] p-5 overflow-y-auto transition-transform duration-300 bg-white dark:bg-gray-900 w-full md:w-[480px] shadow-2xl shadow-cyan-900/10 border-l border-gray-200 dark:border-gray-800 ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
            tabIndex="-1"
            aria-labelledby='drawer-right-label'
            aria-hidden={!isOpen}
        >
            {/*Header*/}
            <div className='flex items-center justify-between mb-4'>
                <h5
                    id='drawer-right-label'
                    className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    {title}
                </h5>
                {/* Close Button */}
                <button
                    type="button"
                    className='text-gray-400 dark:text-gray-500 bg-transparent hover:bg-orange-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg text-sm w-8 h-8 flex justify-center items-center'
                    onClick={onClose}
                >
                    <LuX className='' />
                </button>
            </div>
            {/* Body */}
            <div className='overflow-y-auto custom-scrollbar'>
                {children}
            </div>
        </div>
    );
};

export default Drawer;