interface BioCardProps {
    bio: string
    onBioChange: (value: string) => void
}

export default function BioCard({ bio, onBioChange }: BioCardProps) {
    return (
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
                value={bio}
                onChange={(e) => onBioChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition resize-none"
                placeholder="Write a brief introduction about yourself, your experience, skills, and what you're looking for..."
            />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: A compelling bio increases your chances of getting noticed by employers</p>
        </div>
    )
}
