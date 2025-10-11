import CardWithScore from '@/components/CardWithScore'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { ResourceByCategory } from '@/types/Resource'
import axiosInstance from '@/utils/axiosCache'
import {
    MONETAG_INPAGE_PUSH_CORE,
    MONETAG_INPAGE_PUSH_LOADER,
    MONETAG_VIGNETTE_BANNER_CORE,
    MONETAG_VIGNETTE_BANNER_LOADER,
} from '@/utils/monetagExtraInline'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Resources() {
    const [input, setInput] = useState('')
    const [resources, setResources] = useState<ResourceByCategory>({})
    const [isLoading, setIsLoading] = useState(true)

    const fetchResources = async () => {
        try {
            const res = await axiosInstance.get('/api/courses/resources/get')
            if (!res.data.error) {
                let resourcesByDepartment: ResourceByCategory = {}
                for (let i = 0; i < res.data.data.length; i++) {
                    if (
                        resourcesByDepartment[res.data.data[i].category] ==
                        undefined
                    ) {
                        resourcesByDepartment[res.data.data[i].category] = []
                    }
                    resourcesByDepartment[res.data.data[i].category].push(
                        res.data.data[i]
                    )
                }
                setResources(resourcesByDepartment)
            } else {
                toast.error('Error fetching resources')
            }
        } catch (error) {
            toast.error('Error fetching resources')
        } finally {
            setIsLoading(false)
        }
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
            <Meta {...getMetaConfig('courses/resources')} />

            {MONETAG_INPAGE_PUSH_CORE && (
                <Script
                    id="monetag-inpage-push-core-resources"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_CORE,
                    }}
                />
            )}

            {MONETAG_INPAGE_PUSH_LOADER && (
                <Script
                    id="monetag-inpage-push-resources"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_LOADER,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_CORE && (
                <Script
                    id="monetag-vignette-core-resources"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_CORE,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_LOADER && (
                <Script
                    id="monetag-vignette-resources"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_LOADER,
                    }}
                />
            )}

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Course Resources.
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
                                Search
                            </button>
                        </div>

                        <div className="flex-col hidden md:block md:flex-row w-1/3 justify-center">
                            <Link
                                className="m-3 w-full"
                                href={'/courses/resources/add'}
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
                                href={'/courses/resources/add'}
                            >
                                <PlusCircleIcon />
                            </Link>
                        </div>
                    </>
                </div>
            </div>
            {isLoading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading resources...</p>
                </div>
            )}
            {!isLoading && (
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-md max-w-6xl text-center">
                        <br />
                        This is a page containing course resources from various
                        students. Click on the category you need to get started.
                        To access the onedrive links you might have to create an
                        account with your BITS email ID over at:{' '}
                        <Link
                            className="underline"
                            href="https://www.microsoft.com/en-us/education/products/office"
                        >
                            Microsoft Education
                        </Link>
                        <br />
                        <br />
                    </h1>

                    {Object.keys(resources)
                        .sort((a, b) => {
                            if (a == 'General') return -1
                            else if (b == 'General') return 1
                            else if (a > b) return 1
                            else if (a < b) return -1
                            else return 0
                        })
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
                                                            incrementEP="/api/courses/resources/score"
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
            )}
            <CustomToastContainer containerId="resources" />
        </>
    )
}
