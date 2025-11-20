import { ReactNode } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
    label: string
    required?: boolean
    children: ReactNode
    className?: string
    error?: FieldError
    helpText?: string
}

export function FormField({
    label,
    required = false,
    children,
    className = 'mb-6',
    error,
    helpText,
}: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-sm text-red-400">{error.message}</p>
            )}
            {helpText && !error && (
                <p className="mt-1 text-sm text-gray-400">{helpText}</p>
            )}
        </div>
    )
}

interface TextInputProps {
    registration: UseFormRegisterReturn
    placeholder?: string
    type?: 'text' | 'url' | 'number' | 'email'
    error?: FieldError
    className?: string
}

export function TextInput({
    registration,
    placeholder,
    type = 'text',
    error,
    className = '',
}: TextInputProps) {
    return (
        <input
            type={type}
            {...registration}
            className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                error ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
            } ${className}`}
            placeholder={placeholder}
        />
    )
}

interface NumberInputProps {
    registration: UseFormRegisterReturn
    placeholder?: string
    min?: number
    max?: number
    step?: number
    error?: FieldError
    className?: string
}

export function NumberInput({
    registration,
    placeholder,
    min,
    max,
    step,
    error,
    className = '',
}: NumberInputProps) {
    return (
        <input
            type="number"
            {...registration}
            className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                error ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
            } ${className}`}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
        />
    )
}

interface SelectInputProps {
    registration: UseFormRegisterReturn
    options: Array<{ value: string; label: string }>
    placeholder?: string
    error?: FieldError
    className?: string
}

export function SelectInput({
    registration,
    options,
    placeholder = 'Select option',
    error,
    className = '',
}: SelectInputProps) {
    return (
        <select
            {...registration}
            className={`w-full p-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                error ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
            } ${className}`}
        >
            <option value="" className="bg-gray-800">
                {placeholder}
            </option>
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="bg-gray-800"
                >
                    {option.label}
                </option>
            ))}
        </select>
    )
}

interface TextAreaProps {
    registration: UseFormRegisterReturn
    placeholder?: string
    rows?: number
    error?: FieldError
    className?: string
}

export function TextArea({
    registration,
    placeholder,
    rows = 4,
    error,
    className = '',
}: TextAreaProps) {
    return (
        <textarea
            {...registration}
            rows={rows}
            className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-vertical ${
                error ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
            } ${className}`}
            placeholder={placeholder}
        />
    )
}

interface CheckboxProps {
    registration: UseFormRegisterReturn
    label: string
    error?: FieldError
    className?: string
}

export function Checkbox({
    registration,
    label,
    error,
    className = '',
}: CheckboxProps) {
    return (
        <label className={`flex items-center text-gray-300 ${className}`}>
            <input
                type="checkbox"
                {...registration}
                className={`mr-2 rounded ${
                    error ? 'border-red-400' : 'border-white/20'
                }`}
            />
            {label}
        </label>
    )
}
