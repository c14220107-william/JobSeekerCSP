'use client'

import Link from 'next/link';

// Reusable Component untuk Empty State
interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon?: React.ReactNode; // Optional icon sebagai props
}

// Component dengan Props - mendemonstrasikan component composition
export default function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionLink,
  icon 
}: EmptyStateProps) {
  // Default icon jika tidak ada yang diberikan
  const defaultIcon = (
    <svg
      className="mx-auto h-16 w-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      {/* Conditional Rendering - gunakan icon yang diberikan atau default */}
      {icon || defaultIcon}
      
      <h3 className="text-xl font-bold text-black font-sora mb-2">{title}</h3>
      <p className="text-gray-500 font-sans mb-6">{description}</p>
      
      <Link
        href={actionLink}
        className="inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
      >
        {actionText}
      </Link>
    </div>
  );
}
