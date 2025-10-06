import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { getMetaConfig } from '@/config/meta'
import axiosInstance from '@/utils/axiosCache'
import { googleDriveService } from '@/utils/googleDrive'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const HandoutsPerYear = dynamic(() => import('@/components/HandoutsPerYear'), {
    loading: () => (
        <div className="grid place-items-center">
            <p className="text-lg m-3">Loading...</p>
        </div>
    ),
})

export const getStaticProps: GetStaticProps = async () => {
    try {
        const handoutsFolderId = process.env.GOOGLE_DRIVE_HANDOUTS_FOLDER_ID
        if (!handoutsFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_HANDOUTS_FOLDER_ID environment variable is not set'
            )
        }

        const handoutsMap =
            await googleDriveService.getHandouts(handoutsFolderId)

        return {
            props: {
                handoutsMap,
            },
            revalidate: 24 * 60 * 60, // Regenerate list of handouts every 24 hours.
        }
    } catch (error) {
        console.error('Error fetching handouts:', error)
        return {
            props: {
                handoutsMap: {},
                error: 'Failed to fetch handouts from Google Drive',
            },
            revalidate: 300, // Try again in 5 minutes on error.
        }
    }
}

export default function Handouts({
    handoutsMap,
    error,
}: {
    handoutsMap: { [key: string]: any[] }
    error?: string
}) {
    const [search, setSearch] = useState('')
    const [actualSearch, setActualSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const filterHandouts = async () => {
        setIsLoading(true)
        await axiosInstance.get('/api/auth/check')
        setActualSearch(search)
        setIsLoading(false)
    }

    useEffect(() => {
        filterHandouts()
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">
                        Error Loading Handouts
                    </h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('courses/handouts')} />

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Handouts.
                    </h1>
                    <Menu />
                    <>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-secondary w-full max-w-xs"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Link className="m-3 w-full max-w-xs" href={''}>
                            <button
                                className="btn btn-outline w-full"
                                tabIndex={-1}
                                onClick={filterHandouts}
                            >
                                Filter Handouts
                            </button>
                        </Link>
                    </>
                </div>
            </div>

            {!isLoading && (
                <div className="px-2 md:px-20">
                    {Object.keys(handoutsMap)
                        .reverse()
                        .map((handoutMap: string) => {
                            return (
                                <>
                                    <HandoutsPerYear
                                        handouts={handoutsMap[handoutMap]}
                                        year={handoutMap}
                                        key={handoutMap}
                                        searchWord={actualSearch}
                                    />
                                    <hr />
                                </>
                            )
                        })}
                </div>
            )}

            {isLoading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
        </>
    )
}
