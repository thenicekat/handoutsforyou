import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import StarPrompt from '@/components/Prompt'
import Link from 'next/link'
import { useState } from 'react'
import CountUp from 'react-countup'

type SummaryData = {
    handouts: number
    ps1Cutoffs: number
    ps2Cutoffs: number
    courseReviews: number
    courseResources: number
    courseGrading: number
    coursePrerequisites: number
    coursePyqs: number
    placementCtcs: number
    placementResources: number
    siCompanies: number
    siChronicles: number
    siResources: number
    higherStudiesResources: number
    links: number
}

const RESOURCE_COUNTS: SummaryData = {
    handouts: 3200,
    ps1Cutoffs: 1411,
    ps2Cutoffs: 4560,
    courseReviews: 622,
    courseGrading: 148,
    courseResources: 109,
    coursePrerequisites: 707,
    coursePyqs: 87,
    placementCtcs: 113,
    placementResources: 27,
    siCompanies: 142,
    siChronicles: 316,
    siResources: 10,
    higherStudiesResources: 2,
    links: 12,
}

const USEFUL_LINKS = [
    {
        title: 'Official Bits Links',
        links: [
            { name: 'ERP', url: 'https://erp.bits-pilani.ac.in' },
            { name: 'SWD', url: 'https://swd.bits-hyderabad.ac.in/login-page' },
            {
                name: 'LMS',
                url: 'https://lms.erp.bits-pilani.ac.in/moodle/my/',
            },
            { name: 'Impartus', url: 'https://bitshyd.impartus.com/login/#/' },
            {
                name: 'Digital Library',
                url: 'http://172.16.100.176:8080/jspui/',
            },
        ],
    },
    {
        title: 'Made by Students',
        links: [
            { name: 'LeX', url: 'https://lex.crux-bphc.com/' },
            { name: 'Tabulr', url: 'https://tabulr.net/' },
            {
                name: 'ChronoFactorem',
                url: 'https://www.chrono.crux-bphc.com/login',
            },
            { name: 'Campus 101', url: 'https://campus101.vercel.app/' },
            {
                name: 'Draft ChronoFactorem',
                url: 'https://draft.chrono.crux-bphc.com/',
            },
            {
                name: 'DC++ Hub Status',
                url: 'https://swd.bits-hyderabad.ac.in/dcpphub_status/',
            },
            { name: 'Quietspace', url: 'https://qsbphc.vercel.app/' },
        ],
    },
]

export default function Home() {
    const [starCount, setStarCount] = useState(0)
    const [showLinksModal, setShowLinksModal] = useState(false)
    const navigationCategories = [
        {
            title: 'Core Academics.',
            description: 'Essential course details needed to get started.',
            items: [
                {
                    name: 'Handouts',
                    path: '/courses/handouts',
                    count: RESOURCE_COUNTS.handouts,
                },
                {
                    name: 'Prerequisites',
                    path: '/courses/prereqs',
                    count: RESOURCE_COUNTS.coursePrerequisites,
                },
                {
                    name: 'Previous Year Questions',
                    path: '/courses/pyqs',
                    count: RESOURCE_COUNTS.coursePyqs,
                },
            ],
        },
        {
            title: 'Course Extras.',
            description:
                'Crowd sourced reviews, resources and grading information for courses.',
            items: [
                {
                    name: 'Reviews',
                    path: '/courses/reviews',
                    count: RESOURCE_COUNTS.courseReviews,
                },
                {
                    name: 'Resources',
                    path: '/courses/resources',
                    count: RESOURCE_COUNTS.courseResources,
                },
                {
                    name: 'Grading',
                    path: '/courses/grading',
                    count: RESOURCE_COUNTS.courseGrading,
                },
            ],
        },
        {
            title: 'Placement Resources.',
            description: 'Placement and summer internship information.',
            items: [
                {
                    name: 'Placement CTCs',
                    path: '/placements/ctcs',
                    count: RESOURCE_COUNTS.placementCtcs,
                },
                {
                    name: 'Placement Resources',
                    path: '/placements/resources',
                    count: RESOURCE_COUNTS.placementResources,
                },
                {
                    name: 'SI Resources',
                    path: '/si/resources',
                    count: RESOURCE_COUNTS.siResources,
                },
                {
                    name: 'SI Companies',
                    path: '/si/companies',
                    count:
                        RESOURCE_COUNTS.siCompanies +
                        RESOURCE_COUNTS.siChronicles,
                },
            ],
        },
        {
            title: 'Higher Studies.',
            description:
                'Resources for pursuing higher education and research.',
            items: [
                {
                    name: 'Research Chronicles',
                    path: 'https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750',
                },
                {
                    name: 'Higher Studies',
                    path: '/higherstudies/resources',
                    count: RESOURCE_COUNTS.higherStudiesResources,
                },
            ],
        },
        {
            title: 'Practice School.',
            description:
                'Practice School chronicles, reviews and CGPA cutoffs.',
            items: [
                { name: 'Practice School Dashboard', path: '/ps' },
                {
                    name: 'PS1 CGPA Cutoffs',
                    path: '/ps/cutoffs/ps1',
                    count: RESOURCE_COUNTS.ps1Cutoffs,
                },
                {
                    name: 'PS2 CGPA Cutoffs',
                    path: '/ps/cutoffs/ps2',
                    count: RESOURCE_COUNTS.ps2Cutoffs,
                },
            ],
        },
        {
            title: 'Others.',
            description: 'Everything else.',
            items: [
                { name: 'BITS of Advice', path: '/bitsofa' },
                { name: 'Rants', path: '/rants' },
                { name: 'Professor Chambers', path: '/chambers' },
                {
                    name: 'Some Useful Links',
                    onClick: () => setShowLinksModal(true),
                },
                { name: 'FAQs', path: '/faqs' },
            ],
        },
    ]

    return (
        <>
            <Meta />

            <Menu onLandingPage={true} />
            <StarPrompt setStarCount={setStarCount} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section with Stats */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Your Comprehensive Resource Hub.
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                        Everything you need for your journey @ BITS.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl md:text-3xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.handouts +
                                        RESOURCE_COUNTS.ps1Cutoffs +
                                        RESOURCE_COUNTS.ps2Cutoffs
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-sm text-gray-300">
                                Total Resources
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl md:text-3xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.courseReviews +
                                        RESOURCE_COUNTS.courseGrading
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-sm text-gray-300">
                                Course Insights
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl md:text-3xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.placementCtcs +
                                        RESOURCE_COUNTS.siCompanies
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-sm text-gray-300">
                                Career Data
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl md:text-3xl font-bold text-white">
                                <CountUp
                                    end={RESOURCE_COUNTS.links}
                                    duration={3}
                                />
                            </div>
                            <div className="text-sm text-gray-300">
                                Useful Links
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {navigationCategories.map((category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                        >
                            {/* Category Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                                <h3 className="text-xl font-bold mb-2">
                                    {category.title}
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {category.description}
                                </p>
                            </div>

                            {/* Category Items */}
                            <div className="p-6 space-y-3">
                                {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex}>
                                        {item.path ? (
                                            <Link href={item.path}>
                                                <div className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                                    <div className="flex-1">
                                                        <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        {'count' in item &&
                                                            item.count &&
                                                            item.count > 0 && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                                                                    <CountUp
                                                                        end={
                                                                            item.count
                                                                        }
                                                                        duration={
                                                                            3
                                                                        }
                                                                    />
                                                                </span>
                                                            )}
                                                        <svg
                                                            className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div
                                                onClick={
                                                    'onClick' in item
                                                        ? item.onClick
                                                        : undefined
                                                }
                                                className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                            >
                                                <div className="flex-1">
                                                    <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {'count' in item &&
                                                        item.count &&
                                                        item.count > 0 && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                                                                <CountUp
                                                                    end={
                                                                        item.count
                                                                    }
                                                                    duration={3}
                                                                />
                                                            </span>
                                                        )}
                                                    {item.name ===
                                                        'Some Useful Links' &&
                                                        RESOURCE_COUNTS.links >
                                                            0 && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                                                                <CountUp
                                                                    end={
                                                                        RESOURCE_COUNTS.links
                                                                    }
                                                                    duration={3}
                                                                />
                                                            </span>
                                                        )}
                                                    <svg
                                                        className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {showLinksModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowLinksModal(false)}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                List of some useful Links
                            </h2>
                            {USEFUL_LINKS.map((section, idx) => (
                                <div className="mb-6" key={idx}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {section.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                                        {section.links.map((link, linkIdx) => (
                                            <a
                                                key={linkIdx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-medium shadow hover:bg-gray-200 transition"
                                            >
                                                {link.name}
                                            </a>
                                        ))}
                                    </div>
                                    {idx < USEFUL_LINKS.length - 1 && (
                                        <hr className="my-4 border-gray-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contributors Section */}
                <div className="text-center mt-16 p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Made Possible By
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Vashisth Choudhari, Pratyush Nair, Anagha G, Adarsh Das,
                        Santrupti Behera, Ruban SriramBabu, Nishith Kumar,
                        Srikant Tangirala, Mahith Tunuguntla, Anubhab Khanra,
                        Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni,
                        Manish Vasireddy, Sai Charan, Varad Gorantyal, Sudhanshu
                        Patil, Aditya Kumar, Harshit Juneja, Anirudh Agarwal,
                        Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev
                        Gala, Dhairya Agarwal, Jason Aaron Goveas, Shivam Atul
                        Trivedi, Nirmal Sethumadhavan, Aryan Dalmia, Umaang
                        Khambhati, Archisman Das, Aditya Jagtap and everyone
                        else...
                    </p>
                </div>
            </div>
        </>
    )
}
