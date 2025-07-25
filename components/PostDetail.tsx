import { Post } from '@/types/Post'
import ReactMarkdown from 'react-markdown'

const PostDetail = ({ post }: { post: Post }) => {
    return (
        <article className="bg-gray-800 max-w-6xl mx-auto p-8 rounded-lg border border-gray-700 min-h-screen">
            <div className="mb-6">
                <p className="text-md text-gray-400">Created on: {post.date}</p>
                <h1 className="md:text-5xl my-2 text-4xl font-bold">
                    {post.title}
                </h1>
                <div className="text-gray-400 text-md  mt-4 flex flex-col">
                    <p>
                        <span className="text-gray-300">Contributed By - </span>
                        {post.author}
                    </p>
                </div>
                <div className="my-4 flex flex-wrap items-baseline gap-2">
                    <span className="text-md font-semibold">Tags: </span>
                    {post.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-700 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="w-full mx-auto pt-4">
                    <hr />
                </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-md">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
        </article>
    )
}

export default PostDetail
