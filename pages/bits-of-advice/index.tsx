import React from 'react';
import Link from 'next/link';
import Menu from '@/components/Menu';
import Meta from '@/components/Meta';
import { Post } from '@/config/post'; // Re-using the interface from the main page

const posts: Post[] = [
    {
        slug: 'college-ek-katha',
        title: 'College - Ek Katha',
        author: 'Vashisth Choudhari',
        date: '2025-05-30',
        content: `So first of all, a very hearty congratulations to all of you on making it to BITS Pilani; you guys are finally college kids and can get out of the JEE rat race and take "Lite" XD. Although Dual kids still have to work hard for a while longer, and I definitely don't condone giving up on studies completely, you guys have definitely earned the right to take a break for a while, so hats off to you :)\n\nThis doc was made to address some of the questions you may have regarding the campus, how some things work, how your courses will go, how to plan your future pathway, when to worry about it, and mistakes I made that you definitely should not make. The first and foremost question, is how you're going to get to campus: you can take either a flight, a train, or a bus to the major stations in Hyderabad, from where most people opt to book a cab and come to campus, or in some cases a bus. However, since it's an hour-long journey from either station to the campus, it's recommended to cab share to make it more economical. So start typing away on WhatsApp groups, communicate with friends to sync arrival times or post your timings on Travel@BPHC on Facebook, and get ready to come to campus :)`,
        categories: ['Academics', 'SI']
    },
    {
        slug: 'a-guide-to-research-internships',
        title: 'A Guide to Research Internships',
        author: 'Jane Doe',
        date: '2025-06-15',
        content: `Finding a good research internship (RI) can be a challenging process. This guide provides tips on how to approach professors, write effective emails, and prepare for interviews. We will also cover how to make the most of your internship experience and what to do if you are interested in pursuing a Master's degree after your undergrad.`,
        categories: ['RI', 'Masters']
    },
];

const categories = [
    'Academics',
    'Masters',
    'SI',
    'RI',
    'PS-II'
];

const PostCard = ({ post }: { post: Post }) => {
    const maxLength = 400;

    const needsTruncation = post.content.length > maxLength;
    const contentDisplay = post.content.slice(0, maxLength);
    
    return (
        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
                <h2 className="md:text-2xl text-sm font-bold">
                    <Link href={`/bits-of-advice/${post.slug}`} className="hover:underline">
                        {post.title}
                    </Link>
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    By {post.author}, on {post.date}
                </p>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {contentDisplay}{needsTruncation && '...'}
            </p>
            {needsTruncation && (
                <Link href={`/bits-of-advice/${post.slug}`} className="text-yellow-500 hover:underline mt-4 inline-block font-semibold">
                    Read More
                </Link>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {category}
                    </span>
                ))}
            </div>
        </article>
    );
};

const ForumPage = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const filteredPosts = posts.filter(post => {
        const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        const categoryMatch = selectedCategories.length === 0 ||
            selectedCategories.some(category => post.categories.includes(category));

        return searchMatch && categoryMatch;
    });

    return (
        <>
            <Meta title="BITS of Advice | handoutsforyou." />
            <Menu />
            <div className="text-white min-h-screen font-sans pt-16">
                <div className="text-center p-8">
                    <h2 className="text-4xl font-bold">BITS of Advice</h2>
                    <h4 className="text-md font-semibold text-white mt-2">Find the best advice from your seniors</h4>
                    <input
                        type="text"
                        placeholder="What are you looking for..."
                        className="bg-gray-800 border border-gray-700 rounded-md p-3 w-full max-w-md mx-auto mt-4 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <main className="flex flex-col md:flex-row gap-8 px-8 pb-8 pt-0 md:p-8">
                    <aside className="bg-gray-800 p-6 rounded-lg w-full md:w-1/4 flex flex-col gap-4 md:self-start md:sticky top-20">
                        <h2 className="text-2xl font-bold">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat, index) => {
                                const isSelected = selectedCategories.includes(cat);
                                return (
                                    <button 
                                        key={index} 
                                        className={`font-semibold py-1 px-3 rounded-full text-sm transition-colors duration-200 ${
                                            isSelected 
                                            ? 'bg-yellow-500 text-black' 
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                        onClick={() => handleCategoryClick(cat)}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className="w-full md:w-3/4 flex flex-col gap-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <PostCard key={index} post={post} />
                            ))
                        ) : (
                            <div className="text-center text-white py-16">
                                <p className="text-2xl font-bold">No posts found!</p>
                                <p className="mt-2">Try adjusting your search or category filters.</p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}

export default ForumPage;