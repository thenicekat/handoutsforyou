import { getMetaConfig } from '@/config/meta'
import { useState } from 'react'
import { toast } from 'react-toastify'

import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import MultiSelectTags from '@/components/MultiSelectTags'
import CustomToastContainer from '@/components/ToastContainer'
import { tags } from '@/config/tags'

export default function ContributeAdvice() {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([]) // Changed from category to selectedTags array
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        if (title === '') {
            toast.error('Please enter a title!')
            return false
        }
        if (author === '') {
            toast.error('Please enter your name!')
            return false
        }
        if (selectedTags.length === 0) {
            toast.error('Please select at least one category!')
            return false
        }
        if (content === '') {
            toast.error('Please write your advice!')
            return false
        }

        const invalidTag = selectedTags.find((tag) => !tags.includes(tag))

        if (invalidTag) {
            toast.error('Please select a category from the given list!')
            return false
        }

        const invalidTags = selectedTags.filter((tag) => !tags.includes(tag))
        if (invalidTags.length > 0) {
            toast.error(
                `Invalid categories selected: ${invalidTags.join(', ')}`
            )
            return false
        }

        return true
    }

    const submitAdvice = async () => {
        // Validation
        if (!validateForm) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/bitsofa/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    author,
                    content,
                    tags: selectedTags,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                toast.error(result.message || 'Failed to submit advice')
                return
            }

            toast.success('Thank you! Your advice was submitted successfully!')

            setTitle('')
            setAuthor('')
            setSelectedTags([])
            setContent('')
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Meta
                {...getMetaConfig('bitsofa')}
                title="Contribute an Article | handoutsforyou."
            />
            <div className="min-h-screen text-white">
                <Menu />

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-4">
                                Contribute Your Advice
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Share your experiences and help fellow BITSians
                            </p>
                        </div>

                        {/* Guidelines */}
                        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold mb-4">
                                Guidelines
                            </h3>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li>
                                    • Be respectful and constructive in your
                                    advice
                                </li>
                                <li>
                                    • Share personal experiences and practical
                                    tips
                                </li>
                                <li>• Use clear and concise language</li>
                                <li>
                                    • Choose the most appropriate category for
                                    your advice
                                </li>
                                <li>
                                    • Your submission will be reviewed before
                                    being published
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                            <form
                                className="space-y-6"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Title{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="Give your advice a catchy title..."
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Author Input */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Your Name{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="How should we credit you?"
                                        value={author}
                                        onChange={(e) =>
                                            setAuthor(e.target.value)
                                        }
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Multi-Select Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Categories{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-sm text-gray-400 mb-3">
                                        Select one or more categories that best
                                        describe your advice
                                    </p>
                                    <MultiSelectTags
                                        availableTags={tags}
                                        selectedTags={selectedTags}
                                        onTagsChange={setSelectedTags}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Content Textarea */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Your Advice{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-60 resize-none"
                                        placeholder="Share your wisdom! You can use markdown formatting (e.g., **bold**, *italic*, [links](url), etc.)"
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        disabled={isSubmitting}
                                    ></textarea>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Tip: You can use Markdown formatting in
                                        your advice!
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        className={`font-semibold py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                                            isSubmitting
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                        }`}
                                        onClick={submitAdvice}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit Advice'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <CustomToastContainer containerId="contributeAdvice" />
        </>
    )
}
