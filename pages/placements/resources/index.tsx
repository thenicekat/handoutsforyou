import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import { LinkIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import CardWithScore from '@/components/CardWithScore'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import { ResourceByCategory } from '@/types/Resource'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async () => {
    const fs = require('fs')
    let pu_chronicles: {
        [key: string]: string[]
    } = {}
    let dirs = fs.readdirSync('./public/placements/chronicles/')
    for (let dir of dirs) {
        pu_chronicles[dir] = []
        let files = fs.readdirSync('./public/placements/chronicles/' + dir)
        for (let file in files) {
            pu_chronicles[dir].push(files[file])
        }
    }

    return {
        props: {
            pu_chronicles,
        },
    }
}

export default function Placement({ pu_chronicles }: any) {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [resources, setResources] = useState<ResourceByCategory>({})

    const fetchResources = async () => {
        setIsLoading(true)
        const res = await fetch('/api/placements/resources/get')
        const data = await res.json()
        if (!data.error) {
            let resourcesByCategory: ResourceByCategory = {}
            for (let i = 0; i < data.data.length; i++) {
                if (resourcesByCategory[data.data[i].category] == undefined) {
                    resourcesByCategory[data.data[i].category] = []
                }
                resourcesByCategory[data.data[i].category].push(data.data[i])
            }
            setResources(resourcesByCategory)
        } else {
            toast.error('Error fetching resources')
        }
        setIsLoading(false)
    }

    const filterResources = () => {
        let filteredResources: ResourceByCategory = {}
        for (let key in resources) {
            let filtered = resources[key].filter((resource) =>
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

    return (
        <>
            <Head>
                <title>Placements.</title>
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

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Placements Resources.
                    </h1>

                    <Menu />

                    <div className="flex flex-col md:flex-row w-full md:w-1/2 justify-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={(e) => setInput(e.target.value)}
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
                            href={'/placements/resources/add'}
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
                            href={'/placements/resources/add'}
                        >
                            <PlusCircleIcon />
                        </Link>
                    </div>
                </div>
            </div>

            {!isLoading ? (
                <div className="place-items-center p-5 max-w-7xl mx-auto">
                    {Object.keys(resources)
                        .sort()
                        .map((key) => {
                            return (
                                <>
                                    <div className="collapse collapse-plus">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-lg font-medium">
                                            {key} x {resources[key].length}
                                        </div>

                                        <div className="collapse-content">
                                            <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                                {resources[key].map(
                                                    (resource) => (
                                                        <CardWithScore
                                                            key={resource.id}
                                                            resource={resource}
                                                            incrementEP="/api/placements/resources/score"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                    {Object.keys(pu_chronicles).map((campus: string) => (
                        <div className="collapse collapse-plus" key={campus}>
                            <input type="checkbox" />
                            <h1 className="collapse-title text-lg font-medium">
                                Placement Chronicles - {campus} x{' '}
                                {pu_chronicles[campus].length}
                            </h1>

                            <div className="collapse-content">
                                <div className="px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center">
                                    {pu_chronicles[campus]
                                        .filter((d: string) =>
                                            d
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        )
                                        .map((chron: string) => (
                                            <div
                                                className="card w-72 h-96 bg-base-100 text-base-content m-2"
                                                key={campus + '/' + chron}
                                            >
                                                <div className="card-body">
                                                    <h2 className="text-sm font-bold uppercase">
                                                        Placement Chronicles
                                                    </h2>
                                                    <p className="text-lg">
                                                        Placement Chronicles{' '}
                                                        {chron.toUpperCase()}
                                                    </p>

                                                    <div className="flex-none">
                                                        <button
                                                            className="btn btn-sm btn-primary m-1"
                                                            onClick={() => {
                                                                window.open(
                                                                    'https://github.com/thenicekat/handoutsforyou/raw/main/public/placements/chronicles/' +
                                                                        campus +
                                                                        '/' +
                                                                        chron,
                                                                    '_blank'
                                                                )
                                                            }}
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
