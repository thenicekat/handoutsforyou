import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react'
import Menu from '@/Components/Menu';
import { useSession } from 'next-auth/react';
import { Resource } from '@/types/Resource';
import React from 'react';
import { toast } from 'react-toastify';
import CustomToastContainer from '@/Components/ToastContainer';
import { CursorArrowRippleIcon } from '@heroicons/react/24/solid'

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
                            <input type="text" placeholder="Search..." className="input input-secondary w-full max-w-xs" onChange={e => setInput(e.target.value)} />
                            <div className="flex flex-col md:flex-row w-1/3 justify-center">
                                <Link className="m-3 w-full" href={"/courses/resources/add"}>
                                    <button className="btn btn-outline w-full">
                                        Add a Resource
                                    </button>
                                </Link>
                            </div>
                        </>
                    }
                </div>
            </div>

            {session &&
                <div className="max-w-7xl mx-auto">

                    <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                        {
                            Object.keys(resources).map((key) => {
                                return (
                                    <>
                                        <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">{key}</h1>

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

                                        <br />
                                    </>
                                )
                            })
                        }
                    </div >
                </div >}
            <CustomToastContainer containerId="resources" />
        </>
    )
}
