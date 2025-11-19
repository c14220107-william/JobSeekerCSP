'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-full fixed bg-black px-4 md:px-8 py-3 flex items-center justify-between z-50">
      {/* Logo & Brand */}
      <div className="flex items-center gap-2">
        <Link href="/admin/dashboard">
          <Image
            src="/icon.png"
            alt="logo"
            width={90}
            height={90}
            className="w-[90%] h-[90%] max-md:w-[75%] max-md:h-[75%]"
          />
        </Link>
        <span className="text-white font-bold font-sora text-lg hidden md:block">Admin Panel</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/admin/dashboard"
          className={`text-xl font-sans font-semibold transition-colors duration-200 ${
            isActive('/admin/dashboard')
              ? 'text-[#FF851A]'
              : 'text-white hover:text-gray-300'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/companies"
          className={`text-xl font-sans font-semibold transition-colors duration-200 ${
            isActive('/admin/companies')
              ? 'text-[#FF851A]'
              : 'text-white hover:text-gray-300'
          }`}
        >
          Companies
        </Link>
        <Link
          href="/admin/job-postings"
          className={`text-xl font-sans font-semibold transition-colors duration-200 ${
            isActive('/admin/job-postings')
              ? 'text-[#FF851A]'
              : 'text-white hover:text-gray-300'
          }`}
        >
          Job Postings
        </Link>
        <Link
          href="/admin/applications"
          className={`text-xl font-sans font-semibold transition-colors duration-200 ${
            isActive('/admin/applications')
              ? 'text-[#FF851A]'
              : 'text-white hover:text-gray-300'
          }`}
        >
          Applications
        </Link>
        
        {/* TODO: Add Logout button when auth is ready */}
        <button
          className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 py-2 rounded-lg font-sans font-semibold transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black py-4 px-4 space-y-4">
          <Link
            href="/admin/dashboard"
            className={`block text-xl font-sans font-semibold transition-colors duration-200 ${
              isActive('/admin/dashboard')
                ? 'text-[#FF851A]'
                : 'text-white hover:text-gray-300'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/companies"
            className={`block text-xl font-sans font-semibold transition-colors duration-200 ${
              isActive('/admin/companies')
                ? 'text-[#FF851A]'
                : 'text-white hover:text-gray-300'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Companies
          </Link>
          <Link
            href="/admin/job-postings"
            className={`block text-xl font-sans font-semibold transition-colors duration-200 ${
              isActive('/admin/job-postings')
                ? 'text-[#FF851A]'
                : 'text-white hover:text-gray-300'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Job Postings
          </Link>
          <Link
            href="/admin/applications"
            className={`block text-xl font-sans font-semibold transition-colors duration-200 ${
              isActive('/admin/applications')
                ? 'text-[#FF851A]'
                : 'text-white hover:text-gray-300'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Applications
          </Link>
          
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-sans font-semibold transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
