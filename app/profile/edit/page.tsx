'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData, getUserProfile, updateUserProfile } from '@/app/apiServices'
import Toast from '@/app/components/Toast'

export default function EditProfilePage() {
    const router = useRouter()
    const [profileData, setProfileData] = useState({ age: '', bio: '', qualifications: '' })
    const [originalData, setOriginalData] = useState({ age: '', bio: '', qualifications: '' })
    const [userInfo, setUserInfo] = useState({ name: '', email: '' })
    const [stats, setStats] = useState({ totalApplied: 0, activeApplications: 0 })
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [existingAvatar, setExistingAvatar] = useState<string | null>(null)
    const [existingCv, setExistingCv] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [hasChanges, setHasChanges] = useState(false)
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    })

    useEffect(() => {
        const user = getUserData()
        if (!user) {
            router.push('/login/user')
            return
        }

        const email = user.email || ''
        const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
        setUserInfo({ name, email })

        const fetchProfile = async () => {
            try {
                const response = await getUserProfile()
                if (response.data && response.data.profile) {
                    const profile = response.data.profile
                    const data = {
                        age: profile.age || '',
                        bio: profile.bio || '',
                        qualifications: profile.qualifications || ''
                    }
                    setProfileData(data)
                    setOriginalData(data)
                    setExistingAvatar(profile.avatar_url || null)
                    setExistingCv(profile.cv_url || null)
                    setStats({
                        totalApplied: profile.total_applied || 0,
                        activeApplications: profile.active_applications || 0
                    })
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            } finally {
                setIsFetching(false)
            }
        }

        fetchProfile()
    }, [router])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setToast({ show: true, message: 'Please select an image file', type: 'error' })
                return
            }
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setAvatarPreview(reader.result as string)
            reader.readAsDataURL(file)
            setHasChanges(true)
        }
    }

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'application/pdf') {
                setToast({ show: true, message: 'Please select a PDF file', type: 'error' })
                return
            }
            setCvFile(file)
            setHasChanges(true)
        }
    }

    const handleDataChange = (field: 'age' | 'bio' | 'qualifications', value: string) => {
        setProfileData({ ...profileData, [field]: value })
        setHasChanges(value !== originalData[field] || avatarFile !== null || cvFile !== null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            if (profileData.age) formData.append('age', profileData.age)
            if (profileData.bio) formData.append('bio', profileData.bio)
            if (profileData.qualifications) formData.append('qualifications', profileData.qualifications)
            if (cvFile) formData.append('cv', cvFile)
            if (avatarFile) formData.append('avatar', avatarFile)
            await updateUserProfile(formData)
            setToast({ show: true, message: 'Profile updated successfully!', type: 'success' })
            setTimeout(() => router.push('/jobs'), 1500)
        } catch (error) {
            setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to update profile', type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
            
            <section className="bg-[url('/bg-polos.png')] bg-cover bg-center py-[100px]">
                <div className="container mx-auto px-6">
                    <div className="text-center text-white pt-[25px]">
                        <h1 className="text-5xl font-bold mb-4 font-sora">Edit Your Profile</h1>
                        <p className="text-xl mb-8 opacity-90">Update your information to stand out</p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : existingAvatar ? (
                                            <img src={existingAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                        </label>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{userInfo.name}</h3>
                                    <p className="text-sm opacity-90 mb-4">{userInfo.email}</p>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                            <p className="text-2xl font-bold">{stats.totalApplied}</p>
                                            <p className="text-xs opacity-90">Total Applied</p>
                                        </div>
                                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                            <p className="text-2xl font-bold">{stats.activeApplications}</p>
                                            <p className="text-xs opacity-90">Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Profile & Personal Information</h3>
                                            <p className="text-sm text-gray-500">Upload photo and update your details</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                min="17"
                                                max="100"
                                                value={profileData.age}
                                                onChange={(e) => handleDataChange('age', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
                                                placeholder="Enter your age"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Resume / CV
                                            </label>
                                            <input type="file" accept=".pdf" onChange={handleCvChange} className="hidden" id="cv" />
                                            <label htmlFor="cv" className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all group">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {cvFile ? cvFile.name : existingCv ? 'CV Uploaded ✓' : 'Choose PDF'}
                                                    </span>
                                                </div>
                                                {(cvFile || existingCv) && (
                                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </label>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Qualifications
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.qualifications}
                                                onChange={(e) => handleDataChange('qualifications', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
                                                placeholder="e.g., Bachelor's Degree in Computer Science, AWS Certified"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">About You</h3>
                                            <p className="text-sm text-gray-500">Share your professional story</p>
                                        </div>
                                    </div>
                                    <textarea
                                        rows={8}
                                        value={profileData.bio}
                                        onChange={(e) => handleDataChange('bio', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition resize-none"
                                        placeholder="Write a brief introduction about yourself, your experience, skills, and what you're looking for..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2">💡 Tip: A compelling bio increases your chances of getting noticed by employers</p>
                                </div>

                                {hasChanges && (
                                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">You have unsaved changes</p>
                                                    <p className="text-sm text-gray-600">Save your changes before leaving</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => router.push('/jobs')} className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm">
                                                    Cancel
                                                </button>
                                                <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl">
                                                    {isLoading ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                            Saving...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Save Changes
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
