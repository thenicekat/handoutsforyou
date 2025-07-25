import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import PostDetail from '@/components/PostDetail'
import { getMetaConfig } from '@/config/meta'
import { Post } from '@/types/Post'
import { googleDriveService } from '@/utils/googleDrive'
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'

interface PostPageProps {
    post: Post | null
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const slug = params?.slug as string

        if (!slug) {
            return {
                props: {
                    post: null,
                },
            }
        }

        const post = await googleDriveService.getArticle(slug)

        if (!post) {
            return {
                props: {
                    post: null,
                },
            }
        }

        return {
            props: {
                post,
            },
            // Caches the article for 90 days
            // 91st day onwards, new version will be fetched and cached for 90 days
            revalidate: 60 * 60 * 24 * 90, 
        }
    } catch (error) {
        console.error('Error fetching post:', error)
        return {
            props: {
                post: null,
            },
        }
    }
}

const PostPage = ({ post }: PostPageProps) => {
    if (!post) {
        return (
            <>
                <Meta title="Post not found | handoutsforyou." />
                <Menu />
                <div className="text-white min-h-screen font-sans pt-16 flex items-center justify-center">
                    <h1 className="text-4xl font-bold">Post not found</h1>
                </div>
            </>
        )
    }

    return (
        <>
            <Meta
                title={`${post.title} | handoutsforyou.`}
                keywords={getMetaConfig('bitsofa').keywords.concat(post.tags)}
            />
            <Menu />
            <div className="text-white min-h-screen font-sans flex flex-col">
                <Link
                    href="/bitsofa"
                    className="btn btn-secondary w-auto mx-auto my-4"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    View all posts
                </Link>
                <main className="px-1 w-full flex-grow">
                    <PostDetail post={post} />
                </main>
            </div>
        </>
    )
}

export default PostPage
