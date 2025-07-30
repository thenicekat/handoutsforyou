import { MenuProps } from '@/types/Menu'
import { Bars3Icon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import StarPrompt from './Prompt'

const Menu = ({ doNotShowMenu }: MenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [starCount, setStarCount] = useState(0)

    const menuItems: Record<string, string> = {
        Handouts: '/courses/handouts',
        'Course Prereqs': '/courses/prereqs',
        'Course PYQs': '/courses/pyqs',
        'Course Resources': '/courses/resources',
        'Course Reviews': '/courses/reviews',
        'Course Grading': '/courses/grading',
        'BITS of Advice': '/bitsofa',
        'Professor Chambers': '/chambers',
        'SI Resources': '/si/resources',
        'SI Companies': '/si/companies',
        Rants: '/rants',
        'Placement Resources': '/placements/resources',
        'Placement CTCs': '/placements/ctcs',
        'Practice School': '/ps',
        'Research Chronicles':
            'https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750',
        'Higher Studies': '/higherstudies/resources',
        FAQs: '/faqs',
    }

    return (
        <>
            <StarPrompt setStarCount={setStarCount} />
            {/* Main Navbar */}
            <nav className="fixed top-0 right-0 left-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between h-16 px-4 md:px-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <h1 className="text-lg font-semibold text-black dark:text-white">
                                h4u.
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="https://github.com/thenicekat/handoutsforyou">
                            <button className="md:flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-500 transition-all">
                                <StarIcon className="h-4 w-4" />
                                <span className="hidden md:block text-sm">
                                    {starCount}
                                </span>
                            </button>
                        </Link>

                        {!doNotShowMenu && (
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 text-sm transition-all"
                            >
                                Sign Out
                            </button>
                        )}

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 text-black dark:text-white transition-all ${doNotShowMenu && ' hidden'}`}
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar/Mobile Menu */}
            <div
                className={`fixed inset-0 z-30 transform transition-all duration-300 ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Content */}
                <div className="absolute right-0 h-full w-full md:w-80 bg-white/95 dark:bg-zinc-900/95 border-l border-black/10 dark:border-white/10">
                    <div className="flex flex-col h-full pt-20 pb-6 px-4">
                        {/* Mobile-only buttons */}
                        {/* <div className="md:hidden flex gap-4 mb-6">
                            <Link href="https://github.com/thenicekat/handoutsforyou" className="flex-1">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-500 transition-all">
                                    <StarIcon className="h-4 w-4" />
                                    <span className="text-sm">{starCount}</span>
                                </button>
                            </Link>
                        </div> */}

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(menuItems).map(
                                    ([label, href]) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all"
                                        >
                                            {label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu
