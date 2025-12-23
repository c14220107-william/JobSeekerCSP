'use client'

interface ErrorModalProps {
    show: boolean
    message: string
    onClose: () => void
}

export default function ErrorModal({ show, message, onClose }: ErrorModalProps) {
    if (!show) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[scale-in_0.2s_ease-out]">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Connection Error
                </h3>


                <p className="text-gray-600 text-center mb-6">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    OK
                </button>
            </div>
        </div>
    )
}
