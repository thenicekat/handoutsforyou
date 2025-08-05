import { GetStaticProps } from 'next'
import Link from 'next/link'
import React, { useEffect } from 'react'

import AdBanner from '@/components/AdBanner'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import PostCard from '@/components/PostCard'
import CustomToastContainer from '@/components/ToastContainer'
import { tags } from '@/config/tags'
import { Post } from '@/types/Post'
import { googleDriveService } from '@/utils/googleDrive'

interface ForumPageProps {
    posts: Post[]
}

export const getStaticProps: GetStaticProps = async () => {
    try {
        const bitsOfAdviceFolderId = process.env.GOOGLE_DRIVE_BITSOFA_FOLDER_ID

        if (!bitsOfAdviceFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_BITSOFA_FOLDER_ID environment variable is not set'
            )
        }

        const articles =
            await googleDriveService.getArticles(bitsOfAdviceFolderId)

        return {
            props: {
                posts: articles,
            },
            revalidate: 3600,
        }
    } catch (error) {
        console.error('Error fetching BITS of advice:', error)
        return {
            props: {
                posts: [],
            },
        }
    }
}

const ForumPage = ({ posts }: ForumPageProps) => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])
    const [isClientLoaded, setIsClientLoaded] = React.useState(false)

    const [bookmarkedSlugs, setBookmarkedSlugs] = React.useState<string[]>([])
    const [activeTab, setActiveTab] = React.useState<'all' | 'bookmarks'>('all')

    useEffect(() => {
        setIsClientLoaded(true)
        if (typeof window !== 'undefined') {
            const saved: string[] = JSON.parse(
                localStorage.getItem('bitsofaBookmarks') || '[]'
            )
            setBookmarkedSlugs(saved)
        }
    }, [])

    const refreshBookmarks = () => {
        if (typeof window !== 'undefined') {
            const saved: string[] = JSON.parse(
                localStorage.getItem('bitsofaBookmarks') || '[]'
            )
            setBookmarkedSlugs(saved)
        }
    }

    const handleTagClick = (tag: string) => {
        setSelectedTags((prev) => {
            if (prev.includes(tag)) {
                return prev.filter((t) => t !== tag)
            } else {
                return [...prev, tag]
            }
        })
    }

    const filteredPosts = posts.filter((post) => {
        const searchMatch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())

        const tagMatch =
            selectedTags.length === 0 ||
            selectedTags.some((tag) => (post.tags || []).includes(tag))

        return searchMatch && tagMatch
    })

    const bookmarkedPosts = posts.filter((post) =>
        bookmarkedSlugs.includes(post.slug)
    )

    const postsToDisplay =
        activeTab === 'bookmarks' ? bookmarkedPosts : filteredPosts

    return (
        <>
            <Meta title="BITS of Advice. | handoutsforyou." />
            <Menu />
            <AdBanner
                data-ad-slot="6217320688"
                data-full-width-responsive="true"
                data-ad-format="auto"
            />
            <div className="text-white min-h-screen pt-8">
                <div className="text-center p-4">
                    <h2 className="text-4xl font-bold">BITS of Advice.</h2>
                    <h4 className="text-md font-semibold text-white mt-2">
                        Find the best advice from your seniors.
                    </h4>
                    <Link href={'/bitsofa/contribute'}>
                        <button className="btn btn-outline focus:outline-none mx-auto mt-4">
                            Contribute an article.
                        </button>
                    </Link>
                </div>

                {!isClientLoaded ? (
                    <div className="bg-gray-800 p-6 rounded-lg border text-center border-gray-700">
                        Loading...
                    </div>
                ) : (
                    <main className="flex flex-col md:flex-row gap-8 px-8 pb-2 pt-0 md:p-8">
                        <aside className="bg-gray-800 p-6 rounded-lg w-full md:w-1/4 mt-6 md:mt-0 flex flex-col gap-4 md:self-start md:sticky top-20">
                            <h2 className="text-lg font-bold">View</h2>
                            <div className="flex gap-2">
                                <button
                                    className={`py-1 px-3 rounded-full text-sm font-semibold transition-colors ${
                                        activeTab === 'all'
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`py-1 px-3 rounded-full text-sm font-semibold transition-colors ${
                                        activeTab === 'bookmarks'
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                                    onClick={() => setActiveTab('bookmarks')}
                                >
                                    Bookmarks ({bookmarkedSlugs.length})
                                </button>
                            </div>

                            <hr />

                            <h2 className="text-lg font-bold">Search</h2>
                            <input
                                type="text"
                                placeholder="What are you looking for..."
                                className="bg-gray-800 border border-gray-200 focus:outline-none rounded-md p-2 w-full mx-auto text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <hr />
                            <h2 className="text-lg font-bold">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => {
                                    const isSelected =
                                        selectedTags.includes(tag)
                                    return (
                                        <button
                                            key={index}
                                            className={`font-semibold py-1 px-3 rounded-full text-sm transition-colors duration-200 ${
                                                isSelected
                                                    ? 'bg-yellow-500 text-black'
                                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                            }`}
                                            onClick={() => handleTagClick(tag)}
                                        >
                                            {tag}
                                        </button>
                                    )
                                })}
                            </div>
                        </aside>

                        <section className="w-full md:w-3/4 flex flex-col gap-6">
                            {postsToDisplay.length > 0 ? (
                                postsToDisplay.map((post, index) => (
                                    <PostCard
                                        key={index}
                                        post={post}
                                        onBookmarkToggle={refreshBookmarks}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-white py-16">
                                    <p className="text-2xl font-bold">
                                        No posts found!
                                    </p>
                                    <p className="mt-2">
                                        Try adjusting your search or category
                                        filters.
                                    </p>
                                </div>
                            )}
                        </section>
                    </main>
                )}
            </div>
            <CustomToastContainer containerId="bitsofa" />
        </>
    )
}

export default ForumPage
