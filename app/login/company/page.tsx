'use client'

import Image from "next/image"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loginUser, registerCompany, saveUserData } from "@/app/apiServices"
import Toast from "@/app/components/Toast"

function UserLoginPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({
        company_name: '',
        email: '',
        password: '',
        description: '',
        address: '',
        photo_url: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
        show: false,
        message: '',
        type: 'success'
    })

    useEffect(() => {
        // Check if register parameter is present
        if (searchParams.get('register') === 'true') {
            setIsLogin(false)
        }
    }, [searchParams])

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const validateLoginForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!loginData.email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(loginData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required'
        } else if (loginData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateRegisterForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!registerData.company_name) {
            newErrors.company_name = 'Company name is required'
        } else if (registerData.company_name.length < 2) {
            newErrors.company_name = 'Company name must be at least 2 characters'
        }

        if (!registerData.email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(registerData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!registerData.password) {
            newErrors.password = 'Password is required'
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateLoginForm()) {
            setIsLoading(true)
            setErrors({}) // Clear previous errors
            try {
                const response = await loginUser(loginData.email, loginData.password)

                console.log('Login response:', response)

                // Extract data from response
                const userData = response.data || response
                const user = userData.user
                const company = user?.company
                const token = userData.access_token || response.access_token
                const isApproved = userData.is_approved

                // Validate that this is a company account (not regular user)
                if (user?.role !== 'company') {
                    throw new Error('This email is not registered as a company account. Please use the user login page.')
                }

                // Check if company is approved (backend returns 403 if not approved)
                // This check is redundant as backend already blocks, but keeping for UI feedback
                if (isApproved === false) {
                    setToast({
                        show: true,
                        message: 'Your company account is pending approval from admin. Please wait for approval.',
                        type: 'warning'

                    })
                    setIsLoading(false)
                    return
                }

                // Save company data to localStorage
                saveUserData({
                    full_name: company?.name || '',
                    email: user?.email || '',
                    token: token,
                    user_id: user?.id,
                    role: user?.role || 'company'
                })

                // Show success toast
                setToast({
                    show: true,
                    message: 'Login successful! Welcome back.',
                    type: 'success'
                })

                // Redirect to company dashboard after delay to show toast
                setTimeout(() => {
                    router.push('/company/profile/edit')
                }, 1500)
            } catch (error: any) {
                // Handle 403 response for unapproved company
                if (error.message && error.message.includes('pending approval')) {
                    setToast({
                        show: true,
                        message: 'Your company account is pending approval from admin. Please wait for approval.',
                        type: 'warning'
                    })
                } else {
                    setToast({
                        show: true,
                        message: error instanceof Error ? error.message : 'Login failed. Please try again.',
                        type: 'error'
                    })
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateRegisterForm()) {
            setIsLoading(true)
            setErrors({}) // Clear previous errors
            try {
                const response = await registerCompany(
                    registerData.company_name,
                    registerData.email,
                    registerData.password,
                )

                console.log('Register response:', response)

                // Extract data from response
                const userData = response.data || response
                const company = userData.company
                const user = userData.user
                const token = userData.access_token || response.access_token
                const status = userData.status

                // Only save data and redirect if approved, otherwise show pending message
                if (status === 'pending_approval') {
                    // Show pending approval message - don't save data or redirect
                    setToast({
                        show: true,
                        message: 'Registration successful! Your company account is pending approval. You will be notified once approved.',
                        type: 'warning'
                    })

                    // Clear form
                    setRegisterData({
                        company_name: '',
                        email: '',
                        password: '',
                        description: '',
                        address: '',
                        photo_url: ''
                    })

                    // Switch back to login mode after delay
                    setTimeout(() => {
                        setIsLogin(true)
                    }, 3000)
                } else {
                    // Save company data to localStorage only if approved
                    saveUserData({
                        full_name: company?.name || registerData.company_name,
                        email: user?.email || registerData.email,
                        token: token,
                        user_id: user?.id,
                        role: 'company'
                    })

                    // Show success toast
                    setToast({
                        show: true,
                        message: 'Registration successful! Welcome to JobSeeker.',
                        type: 'success'
                    })

                    // Redirect to company dashboard after delay to show toast
                    setTimeout(() => {
                        router.push('/company/dashboard')
                    }, 1500)
                }
            } catch (error) {
                setToast({
                    show: true,
                    message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
                    type: 'error'
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const switchToRegister = () => {
        setIsLogin(false)
        setErrors({})
        setLoginData({ email: '', password: '' })
    }

    const switchToLogin = () => {
        setIsLogin(true)
        setErrors({})
        setRegisterData({
            company_name: '',
            email: '',
            password: '',
            description: '',
            address: '',
            photo_url: ''
        })
    }

    return <div className="company-bg min-h-screen grid grid-cols-2 place-items-center">
        {/* Toast Notification */}
        <Toast
            key={toast.show ? Date.now() : 'toast'}
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
        />

        <div className="flex flex-col justify-center mt-[100px] w-full max-w-md px-8">
            {/* Login/Register Icon - Static, tidak ikut animasi */}
            <div className="mb-8 flex justify-center">
                <Image
                    src="/icon-white.png"
                    alt="Login Icon"
                    width={150}
                    height={150}
                />
            </div>

            {/* Forms Container with slide animation */}
            <div className="relative overflow-hidden min-h-[500px] ">
                {/* Login Form */}
                <div
                    className={`transition-all duration-700 ease-in-out ${isLogin
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-full absolute inset-0'
                        }`}
                >

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-white mb-2 font-medium">
                                Company Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-600 font-medium text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-white mb-2 font-medium">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-red-600 font-medium text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>

                        <p className="text-center text-white/70 mt-4">
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                onClick={switchToRegister}
                                className="text-white font-bold hover:underline"
                            >
                                Register
                            </button>
                        </p>
                        <p className="text-center text-white/70 -mt-1">
                            Switch to user page?{' '}
                            <a
                                href="/login/user"
                                className="text-white font-bold hover:underline"
                            >
                                Click here
                            </a>
                        </p>
                    </form>
                </div>

                {/* Register Form */}
                <div
                    className={`transition-all duration-700 ease-in-out ${!isLogin
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-full absolute inset-0'
                        }`}
                >

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="register-name" className="block text-white mb-2 font-medium">
                                Company Name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                value={registerData.company_name}
                                onChange={(e) => setRegisterData({ ...registerData, company_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your company name"
                            />
                            {errors.company_name && <p className="text-red-600 font-medium text-sm mt-1">{errors.company_name}</p>}
                        </div>

                        <div>
                            <label htmlFor="register-email" className="block text-white mb-2 font-medium">
                                Company Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-600 font-medium text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="register-password" className="block text-white mb-2 font-medium">
                                Password
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-red-600 font-medium text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>

                        <p className="text-center text-white/70 mt-4">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={switchToLogin}
                                className="text-white font-bold hover:underline"
                            >
                                Log In
                            </button>
                        </p>
                        <p className="text-center text-white/70 -mt-1">
                            Switch to user page?{' '}
                            <a
                                href="/login/user"
                                className="text-white font-bold hover:underline"
                            >
                                Click here
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>

        <div>
            <div className="mb-8 mt-23">
                <Image
                    src="/logcomp.png"
                    alt="Login Icon"
                    width={240}
                    height={240}
                    className="w-[530px]"
                />
            </div>
        </div>
    </div>
}

export default function UserLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserLoginPageContent />
        </Suspense>
    )
}