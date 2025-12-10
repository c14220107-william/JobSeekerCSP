import FormInput from './FormInput'
import FileUpload from './FileUpload'

interface ProfileFormCardProps {
    age: string
    qualifications: string
    onAgeChange: (value: string) => void
    onQualificationsChange: (value: string) => void
    cvFile: File | null
    existingCv?: string | null
    onCvChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ProfileFormCard({ age, qualifications, onAgeChange, onQualificationsChange, cvFile, existingCv, onCvChange }: ProfileFormCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Profile & Personal Information</h3>
                    <p className="text-sm text-gray-500">Update your details</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => onAgeChange(e.target.value)}
                    placeholder="Enter your age"
                    min="17"
                    max="100"
                    icon={
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />

                <FileUpload
                    file={cvFile}
                    existingFile={existingCv}
                    onFileChange={onCvChange}
                    label="Resume / CV"
                    accept=".pdf"
                    placeholder="Choose PDF"
                />

                <div className="md:col-span-2">
                    <FormInput
                        label="Qualifications"
                        type="text"
                        value={qualifications}
                        onChange={(e) => onQualificationsChange(e.target.value)}
                        placeholder="e.g., Bachelor's Degree in Computer Science, AWS Certified"
                        icon={
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>
    )
}
