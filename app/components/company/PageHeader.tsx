'use client'

import Link from 'next/link';

// Reusable Page Header Component dengan Props
interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: { // Optional action button
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export default function PageHeader({ 
  title, 
  description, 
  actionButton 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-black font-sora">{title}</h1>
        <p className="mt-2 text-gray-600 font-sans">{description}</p>
      </div>
      
      {/* Conditional Rendering - hanya tampilkan button jika actionButton props ada */}
      {actionButton && (
        <Link
          href={actionButton.href}
          className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
        >
          {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
          {actionButton.text}
        </Link>
      )}
    </div>
  );
}
