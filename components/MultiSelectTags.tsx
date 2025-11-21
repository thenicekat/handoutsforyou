// Given a list of tags -> allow user to choose multiple tags
// and display the chosen ones below

const MultiSelectTags = ({
    availableTags,
    selectedTags,
    onTagsChange,
    disabled = false,
}: {
    availableTags: string[]
    selectedTags: string[]
    onTagsChange: (tags: string[]) => void
    disabled?: boolean
}) => {
    const toggleTag = (tag: string) => {
        if (disabled) return

        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag))
        } else {
            onTagsChange([...selectedTags, tag])
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                        <button
                            key={tag}
                            type="button"
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                                isSelected
                                    ? 'bg-yellow-500 text-black'
                                    : disabled
                                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            onClick={() => toggleTag(tag)}
                            disabled={disabled}
                        >
                            {tag}
                            {isSelected && (
                                <span className="ml-2 text-black">✓</span>
                            )}
                        </button>
                    )
                })}
            </div>
            {selectedTags.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center"
                            >
                                {tag}
                                {!disabled && (
                                    <button
                                        type="button"
                                        className="ml-2 text-black hover:text-red-600 focus:outline-none"
                                        onClick={() => toggleTag(tag)}
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MultiSelectTags
