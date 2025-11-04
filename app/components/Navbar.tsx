'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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

      <div className="hidden md:flex items-center gap-2">
        <a
          href="https://github.com/Crisnanda18"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black !font-semibold px-4 py-2 rounded transition duration-300"
        >
          <span>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2045_353)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5 0C19.4037 0 25 5.73741 25 12.8162C25 18.4774 21.4225 23.2799 16.4587 24.9762C15.825 25.1024 15.6 24.7022 15.6 24.361C15.6 23.9385 15.615 22.5585 15.615 20.8435C15.615 19.6485 15.215 18.8686 14.7663 18.4711C17.55 18.1536 20.475 17.0697 20.475 12.1472C20.475 10.7472 19.99 9.60478 19.1875 8.70728C19.3175 8.38353 19.7462 7.07994 19.065 5.31494C19.065 5.31494 18.0175 4.97153 15.6312 6.62903C14.6325 6.34528 13.5625 6.20251 12.5 6.19751C11.4375 6.20251 10.3688 6.34528 9.37125 6.62903C6.9825 4.97153 5.9325 5.31494 5.9325 5.31494C5.25375 7.07994 5.6825 8.38353 5.81125 8.70728C5.0125 9.60478 4.52375 10.7472 4.52375 12.1472C4.52375 17.0572 7.4425 18.1577 10.2188 18.4814C9.86125 18.8014 9.5375 19.366 9.425 20.1947C8.7125 20.5222 6.9025 21.089 5.7875 19.1302C5.7875 19.1302 5.12625 17.8988 3.87125 17.8088C3.87125 17.8088 2.6525 17.7926 3.78625 18.5876C3.78625 18.5876 4.605 18.9814 5.17375 20.4626C5.17375 20.4626 5.9075 22.7501 9.385 21.9751C9.39125 23.0463 9.4025 24.056 9.4025 24.361C9.4025 24.6997 9.1725 25.0962 8.54875 24.9774C3.58125 23.2837 0 18.4787 0 12.8162C0 5.73741 5.5975 0 12.5 0Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_2045_353">
                  <rect width="25" height="25" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          GitHub
        </a>
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

            <div className="flex gap-2 mt-4">
              <a
                href="https://github.com/Crisnanda18"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-2 items-center !bg-[#FF851A] hover:bg-orange-600 !text-black !font-semibold px-4 py-1 rounded transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2045_353)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 0C19.4037 0 25 5.73741 25 12.8162C25 18.4774 21.4225 23.2799 16.4587 24.9762C15.825 25.1024 15.6 24.7022 15.6 24.361C15.6 23.9385 15.615 22.5585 15.615 20.8435C15.615 19.6485 15.215 18.8686 14.7663 18.4711C17.55 18.1536 20.475 17.0697 20.475 12.1472C20.475 10.7472 19.99 9.60478 19.1875 8.70728C19.3175 8.38353 19.7462 7.07994 19.065 5.31494C19.065 5.31494 18.0175 4.97153 15.6312 6.62903C14.6325 6.34528 13.5625 6.20251 12.5 6.19751C11.4375 6.20251 10.3688 6.34528 9.37125 6.62903C6.9825 4.97153 5.9325 5.31494 5.9325 5.31494C5.25375 7.07994 5.6825 8.38353 5.81125 8.70728C5.0125 9.60478 4.52375 10.7472 4.52375 12.1472C4.52375 17.0572 7.4425 18.1577 10.2188 18.4814C9.86125 18.8014 9.5375 19.366 9.425 20.1947C8.7125 20.5222 6.9025 21.089 5.7875 19.1302C5.7875 19.1302 5.12625 17.8988 3.87125 17.8088C3.87125 17.8088 2.6525 17.7926 3.78625 18.5876C3.78625 18.5876 4.605 18.9814 5.17375 20.4626C5.17375 20.4626 5.9075 22.7501 9.385 21.9751C9.39125 23.0463 9.4025 24.056 9.4025 24.361C9.4025 24.6997 9.1725 25.0962 8.54875 24.9774C3.58125 23.2837 0 18.4787 0 12.8162C0 5.73741 5.5975 0 12.5 0Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2045_353">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;