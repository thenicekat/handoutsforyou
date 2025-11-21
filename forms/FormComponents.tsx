import { ReactNode, useRef, useState } from 'react'
import {
    Control,
    Controller,
    FieldError,
    UseFormRegisterReturn,
} from 'react-hook-form'

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
            step="0.01"
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
            {options.map(option => (
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

interface AutoCompleterInputProps {
    control: Control<any>
    name: string
    items: string[]
    placeholder?: string
    error?: FieldError
    className?: string
}

export function AutoCompleterInput({
    control,
    name,
    items,
    placeholder,
    error,
    className = '',
}: AutoCompleterInputProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <FormAutoCompleter
                    items={items}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    error={error}
                    className={className}
                />
            )}
        />
    )
}

interface FormAutoCompleterProps {
    items: string[]
    value: string
    onChange: (val: string) => void
    placeholder?: string
    error?: FieldError
    className?: string
}

function FormAutoCompleter({
    items,
    value,
    onChange,
    placeholder,
    error,
    className = '',
}: FormAutoCompleterProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [filteredItems, setFilteredItems] = useState(items)

    const handleInputChange = (inputValue: string) => {
        onChange(inputValue)
        const filtered = items.filter(item =>
            item.toLowerCase().includes(inputValue.toLowerCase())
        )
        setFilteredItems(filtered)
        setOpen(filtered.length > 0 && inputValue.length > 0)
    }

    const handleItemSelect = (item: string) => {
        onChange(item)
        setOpen(false)
    }

    const handleInputFocus = () => {
        if (value.length > 0) {
            const filtered = items.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredItems(filtered)
            setOpen(filtered.length > 0)
        }
    }

    const handleInputBlur = () => {
        // Delay closing to allow item selection
        setTimeout(() => setOpen(false), 150)
    }

    return (
        <div className={`relative ${className}`} ref={ref}>
            <input
                type="text"
                value={value}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    error
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20'
                }`}
                placeholder={
                    placeholder ? `Search by ${placeholder}...` : 'Search...'
                }
            />

            {open && filteredItems.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredItems.map((item, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleItemSelect(item)}
                            className="w-full px-3 py-2 text-left text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none border-b border-white/10 last:border-b-0"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
