interface SubmitButtonProps {
    onClick: () => void
    isLoading?: boolean
    disabled?: boolean
    children: string
    className?: string
}

export default function SubmitButton({
    onClick,
    isLoading = false,
    disabled = false,
    children,
    className = '',
}: SubmitButtonProps) {
    return (
        <div className={`flex justify-center ${className}`}>
            <button
                onClick={onClick}
                disabled={isLoading || disabled}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Submitting...' : children}
            </button>
        </div>
    )
}
