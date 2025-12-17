'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getUserData, logoutUser, isUserLoggedIn, getUserProfile } from '@/app/apiServices';
import UserDropdown from './UserDropdown';

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; email: string; role?: string; avatar_url?: string; photo_url?: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Helper function - Convert Laravel storage path to full URL
  const getStorageUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    // If already full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Convert storage path to URL
    return `http://172.22.83.182:8000${path}`;
  };

  useEffect(() => {
    const checkUser = async () => {
      if (isUserLoggedIn()) {
        const userData = getUserData();
        
        // Fetch fresh profile data from backend if avatar_url is missing
        if (!userData?.avatar_url && !userData?.photo_url) {
          try {
            const profileResponse = await getUserProfile();
            
            if (profileResponse.success && profileResponse.data) {
              const profile = profileResponse.data.profile || profileResponse.data;
              // Update localStorage with avatar_url
              const updatedUser = {
                ...userData,
                avatar_url: profile.avatar_url,
                photo_url: profile.photo_url,
                full_name: profile.full_name || userData.full_name
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
              return;
            }
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
        }
        
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Set up interval to check for user changes
    const interval = setInterval(checkUser, 1000);

    return () => clearInterval(interval);
  }, []);

  if (pathname == '/login/company' || pathname == '/login/user' || pathname?.startsWith('/company') || pathname?.startsWith('/admin')) {
    return null;
  }
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API fails
      setUser(null);
      router.push('/');
    }
  };

  // Function untuk scroll ke about section
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Jika bukan di homepage, redirect ke home dulu
    if (pathname && pathname !== '/') {
      window.location.href = '/#about';
      return;
    }

    // Scroll ke about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="w-full fixed bg-black px-4 md:px-8 py-3 flex items-center justify-between z-50">
      {/* Logo & Brand */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <img
            src="/icon.png"
            alt="logo"
            className="!w-[90%] !h-[90%] max-md:!w-[75%] max-md:!h-[75%]"
          />
        </Link>
      </div>

      {/* Desktop Menu - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className="!text-[#FFAD42] text-xl font-sans !font-semibold hover:text-orange-300 transition"
        >
          Home
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="!text-[#FFAD42] text-xl font-sans !font-semibold hover:text-orange-300 transition"
          >
            Jobs
          </Link>
          <span className="bg-white text-orange-400 font-bold px-2 py-0.5 rounded-full text-xs ml-1">
            NEW
          </span>
        </div>
        <a
          href="#about"
          onClick={scrollToAbout}
          className="!text-[#FFAD42] !font-sans !font-semibold hover:text-orange-300 transition cursor-pointer text-xl"
        >
          About
        </a>
      </div>

      <div className="hidden md:flex items-center gap-2 ">
        {user ? (
          <>
            <div className="relative group">
              <button className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {getStorageUrl(user.avatar_url || user.photo_url) ? (
                    <Image
                      src={getStorageUrl(user.avatar_url || user.photo_url)!}
                      alt={`${user.full_name} profile picture`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user.full_name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <span>{user.full_name}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <UserDropdown user={user} handleLogout={handleLogout} />
            </div>
          </>
        ) : (
          <>
            <Link
              href="/login/user"
              className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black  px-4 py-2 rounded transition duration-300 font-bold"
            >
              Log In
            </Link>
            <Link
              href="/login/user?register=true"
              className="flex flex-row gap-2 items-center !bg-[#ffffff] hover:bg-orange-600 !text-black  px-4 py-2 rounded transition duration-300 font-bold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>



      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-orange-400"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 md:hidden p-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="!text-[#FFAD42] !font-sans !font-semibold hover:text-orange-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/jobs"
                className="!text-[#FFAD42] font-sans !font-semibold hover:text-orange-300 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Seek jobs
              </Link>
              <span className="bg-white text-orange-400 font-bold px-2 py-0.5 rounded-full text-xs ml-1">
                NEW
              </span>
            </div>
            <a
              href="#about"
              onClick={(e) => {
                scrollToAbout(e);
                setIsMenuOpen(false);
              }}
              className="!text-[#FFAD42] !font-sans !font-semibold hover:text-orange-300 transition text-left"
            >
              About
            </a>

            <div className="flex gap-4 mt-4">
              {user ? (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {getStorageUrl(user.avatar_url || user.photo_url) ? (
                        <Image
                          src={getStorageUrl(user.avatar_url || user.photo_url)!}
                          alt={`${user.full_name} profile picture`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{user.full_name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-semibold">
                      Welcome, {user.full_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/company/dashboard"
                      className="flex items-center gap-2 text-white px-3 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href="/company/profile/edit"
                      className="flex items-center gap-2 text-white px-3 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Company Profile
                    </Link>
                    {user.role !== 'company' && (
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-2 text-white px-3 py-2 rounded hover:bg-white/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Edit Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-400 px-3 py-2 rounded hover:bg-white/10 text-left"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login/user"
                    className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black !font-semibold px-4 py-1 rounded transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/login/user?register=true"
                    className="flex flex-row gap-2 items-center !bg-[#ffffff] hover:bg-orange-600 !text-black !font-semibold px-4 py-1 rounded transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;