import React from 'react';
import { useRouter } from 'next/router';
import Menu from '@/components/Menu';
import Meta from '@/components/Meta';
import { Post } from '@/config/post'; // Re-using the interface from the main page

// This data is duplicated from the main page for now.
// In a real application, this would come from a shared data source or an API.
const posts: Post[] = [
    {
        slug: 'college-ek-katha',
        title: 'College - Ek Katha',
        author: 'Vashisth Choudhari',
        date: '30-05-2025',
        content: `So first of all, a very hearty congratulations to all of you on making it to BITS Pilani; you guys are finally college kids and can get out of the JEE rat race and take "Lite" XD. Although Dual kids still have to work hard for a while longer, and I definitely don't condone giving up on studies completely, you guys have definitely earned the right to take a break for a while, so hats off to you :)\n\nThis doc was made to address some of the questions you may have regarding the campus, how some things work, how your courses will go, how to plan your future pathway, when to worry about it, and mistakes I made that you definitely should not make. The first and foremost question, is how you're going to get to campus: you can take either a flight, a train, or a bus to the major stations in Hyderabad, from where most people opt to book a cab and come to campus, or in some cases a bus. However, since it's an hour-long journey from either station to the campus, it's recommended to cab share to make it more economical. So start typing away on WhatsApp groups, communicate with friends to sync arrival times or post your timings on Travel@BPHC on Facebook, and get ready to come to campus :)`,
        categories: ['Academics', 'SI']
    },
    {
        slug: 'a-guide-to-research-internships',
        title: 'A Guide to Research Internships',
        author: 'Jane Doe',
        date: '15-06-2025',
        content: `Finding a good research internship (RI) can be a challenging process. This guide provides tips on how to approach professors, write effective emails, and prepare for interviews. We will also cover how to make the most of your internship experience and what to do if you are interested in pursuing a Master's degree after your undergrad.`,
        categories: ['RI', 'Masters']
    },
];

const PostPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const post = posts.find(p => {
        console.log(p.slug);
        return p.slug === slug;
    });

    if (!post) {
        return (
            <>
                <Meta title="Post not found" />
                <Menu />
                <div className="text-white min-h-screen font-sans pt-16 flex items-center justify-center">
                    <h1 className="text-4xl font-bold">Post not found</h1>
                </div>
            </>
        );
    }

    return (
        <>
            <Meta title={post.title} />
            <Menu />
            <div className="text-white min-h-screen font-sans pt-16 flex flex-col pb-2">
                <main className="max-w-7xl mx-auto px-2 w-full flex-grow">
                    <article className="bg-gray-800 p-8 rounded-lg border border-gray-700 h-screen">
                        <div className="mb-6">
                            <h1 className="md:text-4xl text-3xl font-bold">{post.title}</h1>
                            <div className="text-gray-400 text-md mt-4 flex flex-col">
                                <p>By {post.author}</p>
                                <p>Created on: {post.date}</p>
                            </div>
                            <div className="my-4 flex flex-wrap items-baseline gap-2">
                                <span className="text-md font-semibold">Tags: </span>
                                {post.categories.map((category, index) => (
                                    <span key={index} className="bg-gray-700 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <div className="w-2/3 mx-auto pt-4">
                                <hr />
                            </div>
                        </div>
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-md">
                            {post.content}
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
};

export default PostPage;
