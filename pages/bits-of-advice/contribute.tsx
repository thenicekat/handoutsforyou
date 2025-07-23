import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { useState } from 'react'
import { toast } from 'react-toastify'

const categories = [
    'Academics',
    'Masters',
    'SI',
    'RI',
    'PS-II',
    'Campus Life',
    'Placements',
    'Higher Studies',
    'General',
]

export default function ContributeAdvice() {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('')
    const [content, setContent] = useState('')

    const submitAdvice = async () => {
        if (title === '') {
            toast.error('Please enter a title!')
            return
        }
        if (author === '') {
            toast.error('Please enter your name!')
            return
        }
        if (category === '') {
            toast.error('Please select a category!')
            return
        }
        if (content === '') {
            toast.error('Please write your advice!')
            return
        }

        if (!categories.includes(category)) {
            toast.error('Please select a category from the given list!')
            return
        }

        try {
            const data = await fetch('/api/bits-of-advice/add', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    author,
                    category,
                    content,
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const res = await data.json()

            if (res.error) {
                toast.error(res.message)
            } else {
                toast.success(
                    'Thank you! Your advice was submitted successfully!'
                )
                setTitle('')
                setAuthor('')
                setCategory('')
                setContent('')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
        }
    }

    return (
        <>
            <Meta {...getMetaConfig('bits-of-advice')} />
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
                            <form className="space-y-6">
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
                                    />
                                </div>

                                {/* Category Selector */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Category{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <AutoCompleter
                                        name="Category"
                                        items={categories}
                                        value={category}
                                        onChange={(val) => setCategory(val)}
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
                                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        onClick={submitAdvice}
                                    >
                                        Submit Advice
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
