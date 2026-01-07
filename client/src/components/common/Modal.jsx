import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-70"
          onClick={onClose}
        ></div>

        <div className="relative z-10 w-full max-w-2xl p-6 bg-gray-900 border rounded-lg shadow-2xl border-red-600/30">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-red-600/20">
            <h3 className="text-2xl font-bold text-red-500">{title}</h3>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 transition-colors hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;