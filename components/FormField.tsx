import { ReactNode } from 'react'

interface FormFieldProps {
    label: string
    required?: boolean
    children: ReactNode
    className?: string
}

export function FormField({ label, required = false, children, className = "mb-4" }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
                {label} {required && '*'}
            </label>
            {children}
        </div>
    )
}

interface TextInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: 'text' | 'url' | 'number' | 'email'
    min?: string
    max?: string
    step?: string
    maxLength?: number
}

export function TextInput({ 
    value, 
    onChange, 
    placeholder, 
    type = 'text',
    min,
    max,
    step,
    maxLength
}: TextInputProps) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
        />
    )
}

interface SelectInputProps {
    value: string
    onChange: (value: string) => void
    options: Array<{ value: string; label: string }>
    placeholder?: string
}

export function SelectInput({ value, onChange, options, placeholder = "Select option" }: SelectInputProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
            <option value="" className="bg-gray-800">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                </option>
            ))}
        </select>
    )
}

interface TextAreaProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    rows?: number
}

export function TextArea({ value, onChange, placeholder, rows = 4 }: TextAreaProps) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder={placeholder}
        />
    )
}

interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
    return (
        <label className="flex items-center text-gray-300">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mr-2 rounded"
            />
            {label}
        </label>
    )
}
