import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Menu from '@/components/Menu'
import Link from 'next/link'
import { checkSessionCached } from '@/utils/optimizedAuth'
import { googleDriveService } from '@/utils/googleDrive'

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
            console.error('GOOGLE_DRIVE_HANDOUTS_FOLDER_ID environment variable is not set')
            return {
                props: {
                    handoutsMap: {},
                    error: 'Google Drive configuration missing'
                },
            }
        }

        const handoutsMap = await googleDriveService.getHandouts(handoutsFolderId)

        return {
            props: {
                handoutsMap,
            },
            revalidate: 24 * 3600 // Regenerate every 12 hours
        }
    } catch (error) {
        console.error('Error fetching handouts:', error)
        return {
            props: {
                handoutsMap: {},
                error: 'Failed to fetch handouts from Google Drive'
            },
            revalidate: 300 // Try again in 5 minutes on error
        }
    }
}

export default function Home({ handoutsMap, error }: { handoutsMap: { [key: string]: any[] }, error?: string }) {
    const [search, setSearch] = useState('')
    const [actualSearch, setActualSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const fetchHandouts = async () => {
        await checkSessionCached()
        setIsLoading(true)
        setActualSearch(search)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchHandouts()
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">Error Loading Handouts</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Handouts.</title>
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
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
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
                                onClick={fetchHandouts}
                            >
                                Filter Handouts
                            </button>
                        </Link>
                    </>
                </div>
            </div>

            {/* Handouts List */}
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
                <div className="grid place-items-center">
                    <p className="text-lg m-3">Loading...</p>
                </div>
            )}
        </>
    )
}
