import reactMarkdownComponentConfig from '@/components/ReactMarkdownComponent'
import { Post } from '@/types/Post'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import {
    ClockIcon,
    ShareIcon,
    StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import remarkGfm from 'remark-gfm'

interface PostCardProps {
    post: Post
    onBookmarkToggle?: () => void
}

const PostCard = ({ post, onBookmarkToggle }: PostCardProps) => {
    const MAX_LENGTH = 400
    const readingTime = Math.max(
        1,
        Math.ceil(post.content.split(/\s+/).length / 200)
    )

    const [isClientLoaded, setIsClientLoaded] = React.useState(false)
    const [isBookmarked, setIsBookmarked] = React.useState(false)

    React.useEffect(() => {
        setIsClientLoaded(true)
        if (typeof window !== 'undefined') {
            const saved: string[] = JSON.parse(
                localStorage.getItem('bitsofaBookmarks') || '[]'
            )
            setIsBookmarked(saved.includes(post.slug))
        }
    }, [])

    const toggleBookmark = () => {
        if (typeof window === 'undefined') return

        const saved: string[] = JSON.parse(
            localStorage.getItem('bitsofaBookmarks') || '[]'
        )

        let updated: string[]
        if (isBookmarked) {
            updated = saved.filter((slug) => slug !== post.slug)
            toast.info('Removed from bookmarks', {
                containerId: 'bitsofaIndex',
            })
        } else {
            updated = saved.includes(post.slug) ? saved : [...saved, post.slug]
            toast.success('Bookmarked!', { containerId: 'bitsofaIndex' })
        }

        localStorage.setItem('bitsofaBookmarks', JSON.stringify(updated))
        setIsBookmarked(!isBookmarked)

        if (onBookmarkToggle) onBookmarkToggle()
    }

    const contentDisplay =
        post.content.slice(0, MAX_LENGTH) +
        (post.content.length > MAX_LENGTH ? '...' : '')

    return !isClientLoaded ? (
        <div className="bg-gray-800 p-6 rounded-lg border text-center border-gray-700">
            Loading post...
        </div>
    ) : (
        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4">
                <div className="flex items-center justify-between gap-2">
                    <Link
                        href={`/bitsofa/${post.slug}`}
                        className="flex-1 min-w-0"
                    >
                        <h2 className="text-3xl font-bold hover:underline break-words">
                            {post.title}
                        </h2>
                    </Link>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isBookmarked ? (
                            <StarIconSolid
                                className="w-5 h-5 cursor-pointer text-yellow-400 hover:text-yellow-300 transition-colors"
                                onClick={toggleBookmark}
                            />
                        ) : (
                            <StarIconOutline
                                className="w-5 h-5 cursor-pointer text-gray-400 hover:text-yellow-400 transition-colors"
                                onClick={toggleBookmark}
                            />
                        )}

                        <ShareIcon
                            className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition-colors flex-shrink-0"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/bitsofa/${post.slug}`
                                    )
                                }
                                toast.info('Link copied!', {
                                    containerId: 'bitsofaIndex',
                                })
                            }}
                        />
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-1 flex flex-wrap items-center gap-2">
                    <span>
                        By{' '}
                        <span className="font-semibold">
                            {post.authors.length === 1
                                ? post.authors[0]
                                : post.authors
                                    .map((author) => author)
                                    .join(', ')}
                        </span>
                        , on {post.date}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {readingTime} min read
                    </span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    {post.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed mt-2">
                <Link href={`/bitsofa/${post.slug}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={reactMarkdownComponentConfig}
                    >
                        {contentDisplay}
                    </ReactMarkdown>
                </Link>
            </div>
        </article>
    )
}

export default PostCard
