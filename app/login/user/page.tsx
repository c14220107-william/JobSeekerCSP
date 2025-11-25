'use client'

import Image from "next/image"
import { useState } from "react"

export default function UserLoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

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

        if (!registerData.name) {
            newErrors.name = 'Name is required'
        } else if (registerData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
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

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateLoginForm()) {
            console.log('Login data:', loginData)
            // Handle login logic here
        }
    }

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateRegisterForm()) {
            console.log('Register data:', registerData)
            // Handle register logic here
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
        setRegisterData({ name: '', email: '', password: '' })
    }

    return <div className="login-bg min-h-screen grid grid-cols-2 place-items-center">
        <div className="flex flex-col justify-center mt-[100px] w-full max-w-md px-8">
            {/* Login/Register Icon - Static, tidak ikut animasi */}
            <div className="mb-8 flex justify-center">
                <Image
                    src="/icon-black.png"
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
                                Email
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
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-6"
                        >
                            Log In
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
                                Name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-600 font-medium text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="register-email" className="block text-white mb-2 font-medium">
                                Email
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
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-6"
                        >
                            Register
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
                    </form>
                </div>
            </div>
        </div>

        <div>
            <div className="mb-8 mt-23">
                <Image
                    src="/loguser.png"
                    alt="Login Icon"
                    width={240}
                    height={240}
                    className="w-[530px]"
                />
            </div>
        </div>
    </div>
}