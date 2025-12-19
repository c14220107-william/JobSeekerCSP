'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData, getUserProfile, updateUserProfile } from '@/app/apiServices'
import Toast from '@/app/components/Toast'
import UserInfoCard from '@/app/components/profile/UserInfoCard'
import ProfileFormCard from '@/app/components/profile/ProfileFormCard'
import BioCard from '@/app/components/profile/BioCard'

export default function EditProfilePage() {
    const router = useRouter()
    const [profileData, setProfileData] = useState({ age: '', bio: ''})
    const [originalData, setOriginalData] = useState({ age: '', bio: ''})
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
    const getStorageUrl = (path: string | undefined | null): string | null => {
        if (!path) return null;
        // If already full URL, return as is
        if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
        }
        // Convert storage path to URL
        return `http://127.0.0.1:8000${path}`;
    };

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
                      
                    }
                    setProfileData(data)
                    setOriginalData(data)
                    setExistingAvatar(profile.avatar_url || null)
                    setExistingCv(profile.cv_url || null)
                    setStats({
                        totalApplied: response.data.total_applied || 0,
                        activeApplications: response.data.total_active || 0
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

    const handleDataChange = (field: 'age' | 'bio' , value: string) => {
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
                            <UserInfoCard
                                name={userInfo.name}
                                email={userInfo.email}
                                totalApplied={stats.totalApplied}
                                activeApplications={stats.activeApplications}
                                avatarPreview={avatarPreview}
                                existingAvatar={existingAvatar}
                                onAvatarChange={handleAvatarChange}
                            />
                        </div>

                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <ProfileFormCard
                                    age={profileData.age}
                                    onAgeChange={(value) => handleDataChange('age', value)}
                                    cvFile={cvFile}
                                    existingCv={existingCv}
                                    onCvChange={handleCvChange}
                                />

                                <BioCard
                                    bio={profileData.bio}
                                    onBioChange={(value) => handleDataChange('bio', value)}
                                />

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
