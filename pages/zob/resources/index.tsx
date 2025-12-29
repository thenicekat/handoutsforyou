import CardWithScore from '@/components/CardWithScore'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import {
    PlacementChroniclesByCampus,
    SIChroniclesByCampus,
} from '@/types/GoogleDriveChronicles'
import { ResourceByCategory } from '@/types/Resource'
import { axiosInstance } from '@/utils/axiosCache'
import { googleDriveService } from '@/utils/googleDrive'
import { LinkIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const getStaticProps: GetStaticProps = async () => {
    try {
        const placementChroniclesFolderId =
            process.env.GOOGLE_DRIVE_PLACEMENT_CHRONICLES_FOLDER_ID
        const siChroniclesFolderId =
            process.env.GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID

        if (!siChroniclesFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_SI_CHRONICLES_FOLDER_ID environment variable is not set'
            )
        }

        if (!placementChroniclesFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_PLACEMENT_CHRONICLES_FOLDER_ID environment variable is not set'
            )
        }

        const puChronicles = await googleDriveService.getPlacementChronicles(
            placementChroniclesFolderId
        )
        const siChronicles =
            await googleDriveService.getSIChronicles(siChroniclesFolderId)

        return {
            props: {
                puChronicles,
                siChronicles,
            },
            revalidate: 24 * 3600, // Regenerate list of placement and SI chronicles every 12 hours.
        }
    } catch (error) {
        console.error('Error fetching placement chronicles:', error)
        return {
            props: {
                puChronicles: {},
                error: 'Failed to fetch placement chronicles from Google Drive',
            },
            revalidate: 300, // Try again in 5 minutes on error.
        }
    }
}

export default function Placement({
    puChronicles,
    siChronicles,
    error,
}: {
    puChronicles: PlacementChroniclesByCampus
    siChronicles: SIChroniclesByCampus
    error?: string
}) {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [resources, setResources] = useState<ResourceByCategory>({})
    const [chroniclesLoading] = useState(false)

    const fetchResources = async () => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.get('/api/zob/resources/get')
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

    const filterResources = () => {
        let filteredResources: ResourceByCategory = {}
        for (let key in resources) {
            let filtered = resources[key].filter(resource =>
                resource.name.toLowerCase().includes(input.toLowerCase())
            )
            if (filtered.length > 0) {
                filteredResources[key] = filtered
            }
        }
        setResources(filteredResources)
    }

    useEffect(() => {
        fetchResources()
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">
                        Error Loading Placement Chronicles
                    </h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('zob/resources')} />

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Zob Resources.
                    </h1>

                    <Menu />

                    <div className="flex flex-col md:flex-row w-full md:w-1/2 justify-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={e => setInput(e.target.value)}
                        />

                        <button
                            className="btn btn-outline m-3"
                            onClick={filterResources}
                        >
                            Filter
                        </button>
                    </div>

                    <div className="flex-col hidden md:block md:flex-row w-1/3 justify-center">
                        <Link
                            className="m-3 w-full"
                            href={'/zob/resources/add'}
                        >
                            <button
                                className="btn btn-outline w-full"
                                tabIndex={-1}
                            >
                                Add a Resource
                            </button>
                        </Link>
                    </div>
                    <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                        <Link
                            className="m-3 w-full"
                            href={'/zob/resources/add'}
                        >
                            <PlusCircleIcon />
                        </Link>
                    </div>
                </div>
            </div>

            {!isLoading && !chroniclesLoading ? (
                <div className="place-items-center p-5 max-w-7xl mx-auto">
                    {Object.keys(resources)
                        .sort()
                        .map(key => {
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
                                            {resources[key].map(resource => (
                                                <CardWithScore
                                                    key={resource.id}
                                                    resource={resource}
                                                    incrementEP="/api/zob/resources/score"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    {Object.keys(puChronicles).map((campus: string) => (
                        <div className="collapse collapse-plus" key={campus}>
                            <input type="checkbox" />
                            <h1 className="collapse-title text-lg font-medium">
                                Placement Chronicles - {campus} x{' '}
                                {puChronicles[campus].length}
                            </h1>

                            <div className="collapse-content">
                                <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                    {puChronicles[campus]
                                        .filter(chronicle =>
                                            chronicle.name
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        )
                                        .map(chronicle => (
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
                                        .filter(chronicle =>
                                            chronicle.name
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        )
                                        .map(chronicle => (
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
            ) : (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
            <CustomToastContainer containerId="placementResources" />
        </>
    )
}
