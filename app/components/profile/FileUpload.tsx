interface FileUploadProps {
    file: File | null
    existingFile?: string | null
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label: string
    accept: string
    placeholder: string
}

export default function FileUpload({ file, existingFile, onFileChange, label, accept, placeholder }: FileUploadProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {label}
            </label>
            <input type="file" accept={accept} onChange={onFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all group">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                        {file ? file.name : existingFile ? 'File Uploaded ✓' : placeholder}
                    </span>
                </div>
                {(file || existingFile) && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )}
            </label>
        </div>
    )
}
