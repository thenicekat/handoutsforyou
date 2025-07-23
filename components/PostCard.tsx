import React from 'react';
import Link from 'next/link';
import { Post } from '@/config/post';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const maxLength = 400;

    const needsTruncation = post.content.length > maxLength;
    const contentDisplay = post.content.slice(0, maxLength);

    return (
        <Link href={`/bits-of-advice/${post.slug}`}>
            <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold">
                        <Link href={`/bits-of-advice/${post.slug}`} className="hover:underline">
                            {post.title}
                        </Link>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        By {post.author}, on {post.date}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <p
                    className="text-gray-300 whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: contentDisplay + (needsTruncation ? '...' : '') }}
                />

                {needsTruncation && (
                    <span className="text-yellow-500 hover:underline mt-4 inline-block font-semibold">
                        Read More
                    </span>
                )}
            </article>
        </Link>
    );
};

export default PostCard;