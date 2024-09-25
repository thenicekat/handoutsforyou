import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react'
import Menu from '@/components/Menu';
import { useSession } from 'next-auth/react';
import { Resource } from '@/types/Resource';
import React from 'react';
import { toast } from 'react-toastify';
import CustomToastContainer from '@/components/ToastContainer';
import { CursorArrowRippleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'

interface ResourceByDept {
    [key: string]: Resource[]
}

export default function Resources() {
    const [input, setInput] = useState("");
    const { data: session } = useSession()
    const [resources, setResources] = useState<ResourceByDept>({})

    const fetchResources = async () => {
        const res = await fetch("/api/courses/resources/get")
        const data = await res.json()
        if (!data.error) {
            let resourcesByDepartment: ResourceByDept = {}
            for (let i = 0; i < data.data.length; i++) {
                if (resourcesByDepartment[data.data[i].category] == undefined) {
                    resourcesByDepartment[data.data[i].category] = []
                }
                resourcesByDepartment[data.data[i].category].push(data.data[i])
            }
            setResources(resourcesByDepartment)
        } else {
            toast.error("Error fetching resources")
        }
    }

    const filterResources = () => {
        let filteredResources: ResourceByDept = {}
        for (let key in resources) {
            let filtered = resources[key].filter((resource) => resource.name.toLowerCase().includes(input.toLowerCase()))
            if (filtered.length > 0) {
                filteredResources[key] = filtered
            }
        }
        setResources(filteredResources)
    }

    const incrementScore = async (id: number) => {
        const res = await fetch(`/api/courses/resources/score?id=${id}`)
        const data = await res.json()
        if (data.error) {
            toast(data.message)
        }
        else {
            window.open(data.data[0].link, '_blank')
        }
    }

    React.useEffect(() => {
        fetchResources()
    }, [])

    return (
        <>
            <Head>
                <title>Course Resources.</title>
                <meta name="description" content="Handouts app for bits hyderabad" />
                <meta name="description" content="BPHC Handouts" />
                <meta name="description" content="Handouts for you." />
                <meta
                    name="description"
                    content="handouts, bits pilani hyderabad campus"
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='grid place-items-center'>
                <div className='w-[70vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-5xl pt-[50px] pb-[20px] px-[35px] text-primary'>Course Resources.</h1>
                    <Menu />
                    {session &&
                        <>

                            <div className="flex flex-col md:flex-row w-full md:w-1/2 justify-center">
                                <input type="text" placeholder="Search..." className="input input-secondary w-full max-w-xs m-3" onChange={e => setInput(e.target.value)} />

                                <button className="btn btn-outline m-3" onClick={filterResources}>
                                    Filter
                                </button>
                            </div>

                            <div className="flex-col hidden md:block md:flex-row w-1/3 justify-center">
                                <Link className="m-3 w-full" href={"/courses/resources/add"}>
                                    <button className="btn btn-outline w-full">
                                        Add a Resource
                                    </button>
                                </Link>
                            </div>
                            <div className="z-10 w-14 fixed bottom-5 right-0 m-4 cursor-pointer text-cyan-300 md:hidden">
                                <Link className="m-3 w-full" href={"/courses/resources/add"}>
                                    <PlusCircleIcon />
                                </Link>
                            </div>
                        </>
                    }
                </div>
            </div>

            {session &&

                <div className="max-w-7xl mx-auto">
                    <h1 className='text-md max-w-6xl text-center'>
                        NOTE: To access the onedrive links you might have to create an account with your BITS email ID over at: <Link className="underline" href="https://www.microsoft.com/en-us/education/products/office">Microsoft Education</Link>
                    </h1>

                    {
                        Object.keys(resources).sort((a, b) => {
                            if (a == 'General') return -1
                            else if (b == 'General') return 1
                            else if (a > b) return 1
                            else if (a < b) return -1
                            else return 0
                        }).map((key) => {
                            return (
                                <>
                                    <div className="collapse collapse-plus">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-xl font-medium">{key} x {resources[key].length}</div>

                                        <div className="collapse-content">
                                            <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                                {
                                                    resources[key].map((resource) => (
                                                        <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={resource.name}>
                                                            <div className="card-body">
                                                                <h2 className="text-sm font-bold uppercase">{resource.created_by}</h2>
                                                                <p className='text-lg'>{resource.name.toUpperCase()}</p>

                                                                <div className="flex-none">
                                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => incrementScore(resource.id)}>View this Resource</button>
                                                                    <button className="btn btn-sm btn-primary m-1">{resource.score} <CursorArrowRippleIcon className='w-5 h-5' /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div >
                                    </div>

                                    <br />
                                </>
                            )
                        })
                    }
                </div >}
            <CustomToastContainer containerId="resources" />
        </>
    )
}
