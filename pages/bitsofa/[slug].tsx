import React from 'react';
import type { GetStaticProps, GetStaticPaths } from 'next';
import Menu from '@/components/Menu';
import Meta from '@/components/Meta';
import PostDetail from '@/components/PostDetail';
import { Post } from '@/types/Post';
import { googleDriveService } from '@/utils/googleDrive';
import { getMetaConfig } from '@/config/meta';

interface PostPageProps {
    post: Post
}

const PostPage = ({ post }: PostPageProps) => {
    if (!post) {
        return (
            <>
                <Meta title="Post not found" />
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
                <main className="px-1 w-full flex-grow">
                    <PostDetail post={post} />
                </main>
            </div>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const bitsOfAdviceFolderId =
            process.env.GOOGLE_DRIVE_BITS_OF_ADVICE_FOLDER_ID

        if (!bitsOfAdviceFolderId) {
            return {
                paths: [],
                fallback: 'blocking',
            }
        }

        const articles =
            await googleDriveService.getArticles(bitsOfAdviceFolderId)

        const paths = articles.map((post) => ({
            params: { slug: post.slug },
        }))

        return {
            paths,
            fallback: 'blocking', // Enable ISR for new posts
        }
    } catch (error) {
        console.error('Error generating static paths:', error)
        return {
            paths: [],
            fallback: 'blocking',
        }
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const slug = params?.slug as string
        const bitsOfAdviceFolderId =
            process.env.GOOGLE_DRIVE_BITS_OF_ADVICE_FOLDER_ID

        if (!bitsOfAdviceFolderId || !slug) {
            return {
                notFound: true,
            }
        }

        const articles =
            await googleDriveService.getArticles(bitsOfAdviceFolderId)
        const post = articles.find((p) => p.slug === slug)

        if (!post) {
            return {
                notFound: true,
            }
        }

        return {
            props: {
                post,
            },
            revalidate: 3600, // Revalidate every hour
        }
    } catch (error) {
        console.error('Error fetching post:', error)
        return {
            notFound: true,
        }
    }
}

export default PostPage
