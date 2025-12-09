'use client'

import { useState } from 'react';

// Reusable Search Bar Component dengan useState Hook
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void; // Callback function
}

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch 
}: SearchBarProps) {
  // useState Hook untuk local state
  const [searchQuery, setSearchQuery] = useState('');

  // Event handler untuk input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Call parent callback
  };

  // Event handler untuk clear search
  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF851A] focus:border-transparent font-sans"
      />
      
      {/* Conditional Rendering - Clear Button */}
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-600 transition-colors"
        >
          <svg 
            className="w-5 h-5 text-gray-400 hover:text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
