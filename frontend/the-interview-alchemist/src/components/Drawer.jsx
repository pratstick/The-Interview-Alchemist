import { LuX } from 'react-icons/lu'

const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <div
            className={`fixed top-[64px] right-0 z-50 h-[calc(100vh-64px)] p-4 overflow-y-auto transition-transform bg-white w-full md:w-[400px] shadow-2xl shadow-cyan-800/10 border-r border-l-gray-800 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            tabIndex="-1"
            aria-labelledby='drawer-right-label'
            style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
            {/*Header*/}
            <div className='flex items-center justify-between mb-4'>
                <h5
                    id='drawer-right-label'
                    className='text-lg font-semibold text-gray-900'>
                    {title}
                </h5>
                {/* Close Button */}
                <button
                    type="button"
                    className='text-gray-400 bg-transparent hover:bg-orange-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center'
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