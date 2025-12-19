interface AvatarUploadProps {
    avatarPreview: string | null
        existingAvatar?: string | null
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    size?: 'small' | 'medium' | 'large'
}

export default function AvatarUpload({ avatarPreview, existingAvatar, onAvatarChange, size = 'medium' }: AvatarUploadProps) {
    const sizeClasses = {
        small: 'w-24 h-24',
        medium: 'w-32 h-32',
        large: 'w-40 h-40'
    }

    const iconSizes = {
        small: 'w-12 h-12',
        medium: 'w-16 h-16',
        large: 'w-20 h-20'
    }

    const buttonSizes = {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12'
    }

    const buttonIconSizes = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6'
    }

    // Helper function - Convert Laravel storage path to full URL
    const getStorageUrl = (path: string | undefined | null): string | null => {
        if (!path) return null;
        // If already full URL, return as is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        // Convert storage path to URL
        return `http://127.0.0.1:8000${path}`;
    };

    return (
        <div className="relative inline-block">
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg`}>
                {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : getStorageUrl(existingAvatar) ? (
                    <img src={getStorageUrl(existingAvatar)!} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <svg className={`${iconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            <label className={`absolute bottom-0 right-0 ${buttonSizes[size]} bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg`}>
                <svg className={`${buttonIconSizes[size]} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
            </label>
        </div>
    )
}
