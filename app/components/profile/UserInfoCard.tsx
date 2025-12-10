import AvatarUpload from './AvatarUpload'

interface UserInfoCardProps {
    name: string
    email: string
    totalApplied: number
    activeApplications: number
    avatarPreview: string | null
    existingAvatar?: string | null
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function UserInfoCard({ name, email, totalApplied, activeApplications, avatarPreview, existingAvatar, onAvatarChange }: UserInfoCardProps) {
    return (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-center">
                <div className="mb-4">
                    <AvatarUpload 
                        avatarPreview={avatarPreview}
                        existingAvatar={existingAvatar}
                        onAvatarChange={onAvatarChange}
                        size="small"
                    />
                </div>
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="text-sm opacity-90 mb-4">{email}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                        <p className="text-2xl font-bold">{totalApplied}</p>
                        <p className="text-xs opacity-90">Total Applied</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                        <p className="text-2xl font-bold">{activeApplications}</p>
                        <p className="text-xs opacity-90">Active</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
