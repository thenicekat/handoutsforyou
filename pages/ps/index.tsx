import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/Menu'

export default function PS() {
    const psResources = {
        ps1: [
            {
                title: 'PS1 CGPA Cutoffs',
                link: '/ps/cutoffs/ps1',
                description: 'View CGPA cutoffs for PS1 stations',
            },
            {
                title: 'PS1 Reviews',
                link: '/ps/reviews/ps1',
                description: 'Read reviews and experiences from PS1',
            },
        ],
        ps2: [
            {
                title: 'PS2 CGPA Cutoffs',
                link: '/ps/cutoffs/ps2',
                description: 'View CGPA cutoffs for PS2 stations',
            },
            {
                title: 'PS2 Reviews',
                link: '/ps/reviews/ps2',
                description: 'Read reviews and experiences from PS2',
            },
        ],
        chronicles: {
            title: 'PS Chronicles',
            link: '/ps/chronicles',
            description: 'Explore the journey of PS through time',
        },
    }

    return (
        <>
            <Head>
                <title>Practice School.</title>
                <meta
                    name="description"
                    content="One stop place for your PS queries, handouts, and much more"
                />
                <meta
                    name="keywords"
                    content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Practice School.
                    </h1>
                    <Menu />
                </div>

                {/* PS Chronicles Card */}
                <div className="w-[70vw] mt-8">
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">
                                {psResources.chronicles.title}
                            </h2>
                            <p>{psResources.chronicles.description}</p>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        window.location.href =
                                            psResources.chronicles.link
                                    }}
                                >
                                    Explore Chronicles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PS1 Section */}
                <div className="w-[70vw] mt-8">
                    <h2 className="text-2xl font-bold mb-4">PS1 Resources</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {psResources.ps1.map((resource) => (
                            <div
                                className="card bg-base-100 shadow-xl"
                                key={resource.title}
                            >
                                <div className="card-body">
                                    <h3 className="card-title">
                                        {resource.title}
                                    </h3>
                                    <p>{resource.description}</p>
                                    <div className="card-actions justify-end">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                window.location.href =
                                                    resource.link
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PS2 Section */}
                <div className="w-[70vw] mt-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">PS2 Resources</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {psResources.ps2.map((resource) => (
                            <div
                                className="card bg-base-100 shadow-xl"
                                key={resource.title}
                            >
                                <div className="card-body">
                                    <h3 className="card-title">
                                        {resource.title}
                                    </h3>
                                    <p>{resource.description}</p>
                                    <div className="card-actions justify-end">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                window.location.href =
                                                    resource.link
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
