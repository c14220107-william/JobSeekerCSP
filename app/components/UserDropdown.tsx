'use client'

import Link from 'next/link';

interface UserDropdownProps {
    user: { full_name: string; email: string; role?: string; };
    handleLogout: () => void;
}

const UserDropdown = ({ user, handleLogout }: UserDropdownProps) => {
    return (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
                {user.role === 'company' ? (
                    <div className='px-4'>
                        <h1 className='bg-black p-1 text-white text-center rounded-md mb-2 font-semibold'>
                            Company User
                        </h1>
                    </div>
                ) : null}
                <Link
                    href={user.role === 'company' ? '/company/dashboard' : '/jobs'}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-gray-700 font-medium">Dashboard</span>
                </Link>
                <Link
                    href={user.role === 'company' ? '/company/profile/edit' : '/profile/edit'}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700 font-medium">
                        {user.role === 'company' ? 'Edit Company Profile' : 'Edit Profile'}
                    </span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition w-full text-left"
                >
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-red-600 font-medium">Log Out</span>
                </button>


            </div>
        </div>
    );
};

export default UserDropdown;