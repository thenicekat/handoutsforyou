import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Menu from '@/components/Menu'
import React from 'react'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import CardWithScore from '@/components/CardWithScore'
import { ResourceByCategory } from '@/types/Resource'

export default function HSResources() {
    const [input, setInput] = useState('')
    const [resources, setResources] = useState<ResourceByCategory>({})
    const [isLoading, setIsLoading] = useState(false)

    const fetchResources = async () => {
        setIsLoading(true)
        const res = await fetch('/api/higherstudies/resources/get')
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
                <title>Higher Studies Resources.</title>
                <meta
                    name="description"
                    content="Handouts app for bits hyderabad"
                />
                <meta name="description" content="BPHC Handouts" />
                <meta name="description" content="Handouts for you." />
                <meta
                    name="description"
                    content="handouts, bits pilani hyderabad campus"
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
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Higher Studies Resources.
                    </h1>
                    <Menu />
                    <>
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
                                href={'/higherstudies/resources/add'}
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
                                href={'/higherstudies/resources/add'}
                            >
                                <PlusCircleIcon />
                            </Link>
                        </div>
                    </>
                </div>
            </div>

            {!isLoading ? (
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-md max-w-6xl text-center">
                        NOTE: To access the onedrive links you might have to
                        create an account with your BITS email ID over at:{' '}
                        <Link
                            className="underline"
                            href="https://www.microsoft.com/en-us/education/products/office"
                        >
                            Microsoft Education
                        </Link>
                    </h1>

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
                                                            incrementEP="/api/higherstudies/resources/score"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <br />
                                </>
                            )
                        })}
                </div>
            ) : (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
            <CustomToastContainer containerId="hsResources" />
        </>
    )
}
