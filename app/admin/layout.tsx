'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserData, getToken } from '@/app/apiServices';
import Image from 'next/image';

/**
 * Admin Layout - Protected Route
 * 
 * This layout wraps all admin pages and ensures:
 * 1. User is authenticated (has valid token)
 * 2. User has admin role
 * 3. Shows 403 Forbidden page inline if not authorized
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authState, setAuthState] = useState<'loading' | 'authorized' | 'no-session' | 'forbidden'>('loading');

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get token from localStorage
        const token = getToken();
        
        // No token = no session, redirect to login
        if (!token) {
          console.log('No token found');
          setAuthState('no-session');
          return;
        }

        // Get user data from localStorage
        const userData = getUserData();
        
        if (!userData) {
          console.log('No user data found');
          setAuthState('no-session');
          return;
        }

        // Check if user role is admin
        if (userData.role !== 'admin') {
          console.log('User is not admin, role:', userData.role);
          setAuthState('forbidden');
          return;
        }

        // All checks passed
        console.log('Admin authorization successful');
        setAuthState('authorized');
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState('no-session');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF851A] mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // No session - show authentication required page
  if (authState === 'no-session') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 pt-24">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <Image 
              src="/icon-white.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="mx-auto mb-6 drop-shadow-2xl"
            />
            <div className="relative">
              <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                401
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              You need to be logged in as an admin to access this page.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Login Required</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.back()}
              className="px-8 py-3 rounded-xl border-2 border-gray-600 text-white font-semibold hover:bg-gray-800 transition-all duration-300 hover:border-gray-500"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/30"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wrong role - show 403 Forbidden inline (without admin layout)
  if (authState === 'forbidden') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 pt-24">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <Image 
              src="/icon-white.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="mx-auto mb-6 drop-shadow-2xl"
            />
            <div className="relative">
              <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-4">
                403
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              You don't have permission to access this admin panel. Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Restricted Access</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.back()}
              className="px-8 py-3 rounded-xl border-2 border-gray-600 text-white font-semibold hover:bg-gray-800 transition-all duration-300 hover:border-gray-500"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/30"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}
