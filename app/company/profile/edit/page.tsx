'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData, getCompanyProfile, updateCompanyProfile } from '@/app/apiServices'
import Toast from '@/app/components/Toast'
import CompanyNavbar from '@/app/components/CompanyNavbar'

export default function EditCompanyProfilePage() {
    const router = useRouter()
    const [profileData, setProfileData] = useState({
        name: '',
        description: '',
        address: ''
    })
    const [originalData, setOriginalData] = useState({
        name: '',
        description: '',
        address: ''
    })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [existingPhoto, setExistingPhoto] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [hasChanges, setHasChanges] = useState(false)
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    })

    useEffect(() => {
        const user = getUserData()
        if (!user || user.role !== 'company') {
            router.push('/login/company')
            return
        }

        const fetchProfile = async () => {
            try {
                const response = await getCompanyProfile()
                if (response.data && response.data.company) {
                    const company = response.data.company
                    const data = {
                        name: company.name || '',
                        description: company.description || '',
                        address: company.address || ''
                    }
                    setProfileData(data)
                    setOriginalData(data)
                    setExistingPhoto(company.photo_url || null)
                }
            } catch (error) {
                console.error('Failed to fetch company profile:', error)
                setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to load company profile', type: 'error' })
            } finally {
                setIsFetching(false)
            }
        }

        fetchProfile()
    }, [])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setToast({ show: true, message: 'Please select an image file', type: 'error' })
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setToast({ show: true, message: 'Image size must be less than 5MB', type: 'error' })
                return
            }
            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPhotoPreview(reader.result as string)
            reader.readAsDataURL(file)
            setHasChanges(true)
        }
    }

    const handleDataChange = (field: 'name' | 'description' | 'address', value: string) => {
        const newData = { ...profileData, [field]: value }
        setProfileData(newData)
        const dataChanged = Object.keys(newData).some(key => newData[key as keyof typeof newData] !== originalData[key as keyof typeof originalData])
        setHasChanges(dataChanged || photoFile !== null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            if (profileData.name) formData.append('company_name', profileData.name)
            if (profileData.description) formData.append('description', profileData.description)
            if (profileData.address) formData.append('address', profileData.address)
            if (photoFile) formData.append('photo_url', photoFile)
    
            await updateCompanyProfile(formData)
            setToast({ show: true, message: 'Company profile updated successfully!', type: 'success' })
            setPhotoFile(null)
            setPhotoPreview(null)
            setHasChanges(false)
            
            // Refresh profile data
            const response = await getCompanyProfile()
            if (response.data && response.data.company) {
                const company = response.data.company
                const data = {
                    name: company.name || '',
                    description: company.description || '',
                    address: company.address || ''
                }
                setProfileData(data)
                setOriginalData(data)
                setExistingPhoto(company.photo_url || null)
            }
        } catch (error) {
            setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to update company profile', type: 'error' })
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
            <CompanyNavbar />
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

            <section className="bg-[url('/bg-polos.png')] bg-cover bg-center py-[100px]">
                <div className="container mx-auto px-6">
                    <div className="text-center text-white pt-[25px]">
                        <h1 className="text-5xl font-bold mb-4 font-sora">Edit Company Profile</h1>
                        <p className="text-xl mb-8 opacity-90">Update your company information</p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                

                        {/* Company Information Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
                            <div className="space-y-6">
                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => handleDataChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="Enter your company name"
                                        required
                                    />
                                </div>

                                {/* Company Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={profileData.description}
                                        onChange={(e) => handleDataChange('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-vertical"
                                        placeholder="Tell us about your company..."
                                    />
                                </div>

                                {/* Company Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={profileData.address}
                                        onChange={(e) => handleDataChange('address', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-vertical"
                                        placeholder="Enter your company address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                    <button type="button" onClick={() => router.push('/company/dashboard')} className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={!hasChanges || isLoading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl">
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

                    </form>
                </div>
            </section>
        </div>
    )
}