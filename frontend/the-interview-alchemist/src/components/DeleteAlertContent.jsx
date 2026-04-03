const DeleteAlertContent = ({ content, onDelete, onClose }) => {
  return (
    <div className="w-full min-w-[250px] max-w-md sm:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-gray-100">Delete Alert</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      <p className="text-[15px] text-gray-700 dark:text-gray-300 break-words">{content}</p>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="btn-small bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded transition"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;