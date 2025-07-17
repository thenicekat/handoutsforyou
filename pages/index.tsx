import Head from 'next/head'
import { useState } from 'react'
import CountUp from 'react-countup'
import Link from 'next/link'
import StarPrompt from '@/components/StarPrompt'
import Menu from '@/components/Menu'

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
        title: "Official Bits Links",
        links: [
            { name: "ERP", url: "https://erp.bits-pilani.ac.in" },
            { name: "SWD", url: "https://swd.bits-hyderabad.ac.in/login-page" },
            { name: "LMS", url: "https://lms.erp.bits-pilani.ac.in/moodle/my/" },
            { name: "Impartus", url: "https://bitshyd.impartus.com/login/#/" },
            { name: "Digital Library", url: "http://172.16.100.176:8080/jspui/" },
        ],
    },
    {
        title: "Made by Students",
        links: [
            { name: "LeX", url: "https://lex.crux-bphc.com/" },
            { name: "Tabulr", url: "https://tabulr.net/" },
            { name: "ChronoFactorem", url: "https://www.chrono.crux-bphc.com/login" },
            { name: "Campus Essentials", url: "https://ce-bphc.vercel.app/" },
            { name: "Draft ChronoFactorem", url: "https://draft.chrono.crux-bphc.com/" },
            { name: "DC++ Hub Status", url: "https://swd.bits-hyderabad.ac.in/dcpphub_status/" },
            { name: "Quiet-Space", url: "https://quietspacebphc.vercel.app/" },
        ],
    },
];

export default function Home() {
    const [starCount, setStarCount] = useState(0)
    const [showLinksModal, setShowLinksModal] = useState(false)
    const navigationCategories = [
        {
            title: 'Course Resources.',
            description:
                'Access course materials, handouts, and academic resources',
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
            title: 'Future Resources.',
            description:
                'Explore placement information and other opportunities',
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
            title: 'Practice School and Others.',
            description: 'Everything else.',
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
                { name: 'Rants', path: '/rants' },
                { name: 'Professor Chambers', path: '/chambers' },
                { name: 'Some Useful Links', onClick: () => setShowLinksModal(true) },
                { name: 'FAQs', path: '/faqs' },
            ],
        },
    ]

    return (
        <>
            <Head>
                <title>Handouts for You.</title>
                <meta
                    name="description"
                    content="A website containing all bits pilani hyderabad campus handouts"
                />
                <meta
                    name="keywords"
                    content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="google-adsense-account"
                    content="ca-pub-8538529975248100"
                />
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Menu doNotShowMenu={true} />
            <StarPrompt setStarCount={setStarCount} />

            <div className="pt-7">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        Handouts4U.
                    </h1>
                    <p className="text-md md:text-lg text-white mb-4 text-center">
                        Your complete resource hub.
                        <br />
                        Thank you for making this project a huge success! 🤍
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Resource Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {navigationCategories.map((category, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    {category.description}
                                </p>
                                <div className="space-y-1">
                                    {category.items.map((item, i) => (
                                        <div key={i}>
                                            {item.path ? (
                                                <Link href={item.path}>
                                                    <div className="flex items-center justify-between p-3 m-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                        <span className="font-medium text-gray-800">{item.name}</span>
                                                        {item.count && item.count > 0 && (
                                                            <span className="text-primary font-bold text-sm bg-black px-2 py-1 rounded-full">
                                                                <CountUp end={item.count} duration={5} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div
                                                    onClick={item.onClick}
                                                    className="flex items-center justify-between p-3 m-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    {item.name === "Some Useful Links" && RESOURCE_COUNTS.links > 0 && (
                                                    <span className="text-primary font-bold text-sm bg-black px-2 py-1 rounded-full">
                                                        <CountUp end={RESOURCE_COUNTS.links} duration={5} />
                                                    </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">

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
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">List of some useful Links</h2>
                                {USEFUL_LINKS.map((section, idx) => (
                                    <div className="mb-6" key={idx}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
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
                                        {idx < USEFUL_LINKS.length - 1 && <hr className="my-4 border-gray-300" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-lg font-medium mb-4"></p>
                    <p className="text-sm text-white">
                        Vashisth Choudhari, Pratyush Nair, Anagha G, Adarsh Das,
                        Santrupti Behera, Ruban SriramBabu, Nishith Kumar,
                        Srikant Tangirala, Mahith Tunuguntla, Anubhab Khanra,
                        Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni,
                        Manish Vasireddy, Sai Charan, Varad Gorantyal, Sudhanshu
                        Patil, Aditya Kumar, Harshit Juneja, Anirudh Agarwal,
                        Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev
                        Gala, Dhairya Agarwal, Jason Aaron Goveas, Shivam Atul
                        Trivedi, Nirmal Sethumadhavan, Aryan Dalmia, Umaang
                        Khambhati and everyone else...
                    </p>
                </div>
            </div>
        </>
    )
}
