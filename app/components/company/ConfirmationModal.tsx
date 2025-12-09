'use client'

// Reusable Modal Component - Demonstrasi Conditional Rendering & Event Handling
interface ConfirmationModalProps {
  isOpen: boolean; // State untuk show/hide modal
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void; // Callback function
  onCancel: () => void; // Callback function
  type?: 'danger' | 'warning' | 'info'; // Variant types
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmationModalProps) {
  // Conditional Rendering - tidak render apa-apa jika modal tidak open
  if (!isOpen) return null;

  // Conditional styling berdasarkan type
  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  // Event handler untuk backdrop click (close modal)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Hanya close jika klik pada backdrop, bukan pada modal content
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    // Portal-like overlay dengan conditional rendering
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-xl font-bold text-black font-sora mb-4">
          {title}
        </h3>
        <p className="text-gray-600 font-sans mb-6">
          {message}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-sans font-semibold rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white font-sans font-semibold rounded-md hover:scale-105 transition-all duration-200 ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
