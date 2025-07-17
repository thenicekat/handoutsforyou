import { getMetaConfig } from '@/utils/meta-config';
import Meta from '@/components/Meta';
import { GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import Menu from '@/components/Menu'
import { LinkIcon } from '@heroicons/react/24/solid'
import { checkSession } from '@/utils/checkSession'
import { SIChroniclesByCampus } from '@/types/GoogleDriveChronicles'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import { googleDriveService } from '@/utils/googleDrive'

export const getStaticProps: GetStaticProps = async () => {
    try {
        const siChroniclesFolderId = process.env.GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID

        if (!siChroniclesFolderId) {
            console.error('GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID environment variable is not set')
            return {
                props: {
                    siChronicles: {},
                    error: 'Google Drive configuration missing'
                },
            }
        }

        const siChronicles = await googleDriveService.getSIChronicles(siChroniclesFolderId)

        return {
            props: {
                siChronicles,
            },
            revalidate: 24 * 3600 // Regenerate every 12 hours
        }
    } catch (error) {
        console.error('Error fetching SI chronicles:', error)
        return {
            props: {
                siChronicles: {},
                error: 'Failed to fetch SI chronicles from Google Drive'
            },
            revalidate: 300 // Try again in 5 minutes on error
        }
    }
}

export default function SummerInternships({ siChronicles, error }: { siChronicles: SIChroniclesByCampus, error?: string }) {
    const [search, setSearch] = useState('')
    const [chroniclesLoading, setChroniclesLoading] = useState(true)

    const resourcesList = [
        {
            name: 'Summer Internship Companies Data',
            link: '/si/companies',
        },
        {
            name: 'Summer Internship Guide: Harshit Juneja',
            link: 'https://docs.google.com/document/d/1q6i_IVYwhOSpt8IpyrT4n5N4DfDi4oq0r-pBTsWebjE/edit?usp=sharing',
        },
    ]

    useEffect(() => {
        checkSession()
        // Simulate data loading completion
        const timer = setTimeout(() => {
            setChroniclesLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">Error Loading SI Chronicles</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('si/resources')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Summer Internships.
                    </h1>

                    <Menu />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            {chroniclesLoading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
            {!chroniclesLoading && (
                <div className="place-items-center p-5 max-w-7xl mx-auto">
                    <h1 className="text-3xl text-center my-3">
                        Summer Internship Resources
                    </h1>

                    <div className="collapse collapse-plus">
                        <input type="checkbox" />
                        <h1 className="collapse-title text-lg font-medium">
                            General Resources x {resourcesList.length}
                        </h1>

                        <div className="collapse-content">
                            <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                {resourcesList
                                    .filter((d) =>
                                        d.name
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                    )
                                    .map((resource) => (
                                        <div
                                            className="card w-72 h-96 bg-base-100 text-base-content m-2"
                                            key={resource.name}
                                        >
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">
                                                    General
                                                </h2>
                                                <p className="text-lg">
                                                    {resource.name.toUpperCase()}
                                                </p>

                                                <div className="flex-none">
                                                    <button
                                                        className="btn btn-sm btn-primary m-1"
                                                        onClick={() =>
                                                            window.open(
                                                                resource.link
                                                            )
                                                        }
                                                    >
                                                        Know more
                                                        <LinkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {Object.keys(siChronicles).map((campus: string) => (
                        <div className="collapse collapse-plus" key={campus}>
                            <input type="checkbox" />
                            <h1 className="collapse-title text-lg font-medium">
                                SI Chronicles - {campus} x{' '}
                                {siChronicles[campus].length}
                            </h1>

                            <div className="collapse-content">
                                <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                    {siChronicles[campus]
                                        .filter((chronicle) =>
                                            chronicle.name
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        )
                                        .map((chronicle) => (
                                            <div
                                                className="card w-72 h-96 bg-base-100 text-base-content m-2"
                                                key={chronicle.id}
                                            >
                                                <div className="card-body">
                                                    <h2 className="text-sm font-bold uppercase">
                                                        SI Chronicles
                                                    </h2>
                                                    <p className="text-lg">
                                                        {chronicle.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {campus} Campus
                                                    </p>
                                                    {chronicle.size && (
                                                        <p className="text-xs text-gray-400">
                                                            Size: {Math.round(parseInt(chronicle.size) / 1024 / 1024 * 100) / 100} MB
                                                        </p>
                                                    )}

                                                    <div className="flex-none">
                                                        <button
                                                            className="btn btn-sm btn-primary m-1"
                                                            onClick={() => {
                                                                window.open(
                                                                    chronicle.downloadUrl,
                                                                    '_blank'
                                                                )
                                                            }}
                                                        >
                                                            View
                                                            <LinkIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <CustomToastContainer containerId="siResources" />
        </>
    );
}
