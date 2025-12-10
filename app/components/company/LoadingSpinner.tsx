'use client'

// Reusable Loading Component
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'; // Props dengan default value
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = '#FF851A' 
}: LoadingSpinnerProps) {
  // Conditional logic untuk ukuran spinner
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]}`}
        style={{ borderColor: color }}
      ></div>
    </div>
  );
}
