interface FormInputProps {
    label: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    min?: string
    max?: string
    icon?: React.ReactNode
}

export default function FormInput({ label, type, value, onChange, placeholder, min, max, icon }: FormInputProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {icon}
                {label}
            </label>
            <input
                type={type}
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
                placeholder={placeholder}
            />
        </div>
    )
}
