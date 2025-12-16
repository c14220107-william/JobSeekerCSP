'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/app/apiServices';

export default function CompanyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    
      router.push('/');
    }
  };

  return (
    <nav className="w-full fixed bg-black px-4 md:px-8 py-3 flex items-center justify-between z-50">
      {/* Logo & Brand */}
      <div className="flex gap-2 mt-2">
        <Link href="/company/dashboard">
          <Image
            src="/icon.png"
            alt="logo"
            width={170}
            height={170}
            className="max-md:w-[%] max-md:h-[100%]"
          />
        </Link>
      </div>

      {/* Desktop Menu - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/company/dashboard"
          className="text-[#FF851A] text-xl font-sans font-semibold hover:text-[#FBBF24] transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/company/dashboard/create"
          className="text-white text-xl font-sans font-semibold hover:text-gray-300 transition-colors duration-200"
        >
          Create Job
        </Link>

        {/* TODO: Add Logout button when auth is ready */}
        <button
          onClick={handleLogout}
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
            href="/company/dashboard"
            className="block text-[#FF851A] text-xl font-sans font-semibold hover:text-[#FBBF24] transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/company/dashboard/create"
            className="block text-white text-xl font-sans font-semibold hover:text-gray-300 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Job
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-sans font-semibold transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
