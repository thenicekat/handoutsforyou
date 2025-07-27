import CardWithScore from '@/components/CardWithScore'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { SIChroniclesByCampus } from '@/types/GoogleDriveChronicles'
import { ResourceByCategory } from '@/types/Resource'
import axiosInstance from '@/utils/axiosCache'
import { googleDriveService } from '@/utils/googleDrive'
import { LinkIcon } from '@heroicons/react/24/solid'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const getStaticProps: GetStaticProps = async () => {
    try {
        const siChroniclesFolderId =
            process.env.GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID

        if (!siChroniclesFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID environment variable is not set'
            )
        }

        const siChronicles =
            await googleDriveService.getSIChronicles(siChroniclesFolderId)

        return {
            props: {
                siChronicles,
            },
            revalidate: 24 * 3600, // Regenerate every 12 hours
        }
    } catch (error) {
        console.error('Error fetching SI chronicles:', error)
        return {
            props: {
                siChronicles: {},
                error: 'Failed to fetch SI chronicles from Google Drive',
            },
            revalidate: 300, // Try again in 5 minutes on error
        }
    }
}

export default function SummerInternships({
    siChronicles,
    error,
}: {
    siChronicles: SIChroniclesByCampus
    error?: string
}) {
    const [search, setSearch] = useState('')
    const [loading, setIsLoading] = useState(true)
    const [resources, setResources] = useState<ResourceByCategory>({})

    const fetchResources = async () => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.get(
                '/api/placements/resources/get?type=SI'
            )
            const data = res.data
            if (!data.error) {
                let resourcesByCategory: ResourceByCategory = {}
                for (let i = 0; i < data.data.length; i++) {
                    if (
                        resourcesByCategory[data.data[i].category] == undefined
                    ) {
                        resourcesByCategory[data.data[i].category] = []
                    }
                    resourcesByCategory[data.data[i].category].push(
                        data.data[i]
                    )
                }
                setResources(resourcesByCategory)
            } else {
                toast.error('Error fetching resources')
            }
        } catch (error) {
            console.error('Error fetching placement resources:', error)
            toast.error('Failed to fetch resources')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchResources()
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">
                        Error Loading SI Chronicles
                    </h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('si')} />
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
            {loading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
            {!loading && (
                <div className="place-items-center p-5 max-w-7xl mx-auto">
                    {Object.keys(resources)
                        .sort()
                        .map((key) => {
                            return (
                                <div
                                    key={key}
                                    className="collapse collapse-plus"
                                >
                                    <input type="checkbox" />
                                    <div className="collapse-title text-lg font-medium">
                                        {key} x {resources[key].length}
                                    </div>

                                    <div className="collapse-content">
                                        <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                            {resources[key].map((resource) => (
                                                <CardWithScore
                                                    key={resource.id}
                                                    resource={resource}
                                                    incrementEP="/api/placements/resources/score"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

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
                                                        Placement Chronicles
                                                    </h2>
                                                    <p className="text-lg">
                                                        {chronicle.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {campus} Campus
                                                    </p>
                                                    {chronicle.size && (
                                                        <p className="text-xs text-gray-400">
                                                            Size:{' '}
                                                            {Math.round(
                                                                (parseInt(
                                                                    chronicle.size
                                                                ) /
                                                                    1024 /
                                                                    1024) *
                                                                    100
                                                            ) / 100}{' '}
                                                            MB
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
    )
}
