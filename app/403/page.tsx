'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NotAuthorizedPage() {
    const router = useRouter()

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
                        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
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
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </span>
                    </button>
                    <button 
                        onClick={() => router.push('/')}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Home
                        </span>
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@jobseeker.com" className="text-orange-500 hover:text-orange-400 transition-colors">
                            support@jobseeker.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
