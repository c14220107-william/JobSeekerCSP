'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUserData, logoutUser, isUserLoggedIn } from '@/app/apiServices';

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      if (isUserLoggedIn()) {
        const userData = getUserData();
        console.log('Navbar - User data from localStorage:', userData);
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
            <span className="text-white font-semibold mr-2">
              Welcome, {user.full_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black  px-4 py-2 rounded transition duration-300 font-bold"
            >
              Log Out
            </button>
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
              href="/login/user"
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
                <>
                  <span className="text-white font-semibold">
                    Welcome, {user.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black !font-semibold px-4 py-1 rounded transition duration-300"
                  >
                    Log Out
                  </button>
                </>
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
                    href="/login/user"
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