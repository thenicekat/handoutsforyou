import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react'
import Menu from '../../Components/Menu';
import { useSession } from 'next-auth/react';
import { DataLinkType } from '../../types/DataLinkType';
import React from 'react';

export default function Notes() {
    const [input, setInput] = useState("");
    const { data: session } = useSession()
    const [resources, setResources] = useState<DataLinkType[]>([])

    const fetchResources = async () => {
        const data = await fetch("/api/resources/get")
        const res = await data.json()
        setResources(res.data)
    }

    React.useEffect(() => {
        fetchResources()
    }, [])

    return (
        <>
            <Head>
                <title>Notes and Resources.</title>
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
                    <h1 className='text-6xl pt-[50px] pb-[20px] px-[35px] text-primary'>Resources.</h1>
                    <Menu />
                    {session && <input type="text" placeholder="Search..." className="input input-secondary w-full max-w-xs" onChange={e => setInput(e.target.value)} />}
                </div>
            </div>

            {session &&
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Resources: {resources.length}</h1>
                    </div>

                    <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                        {
                            resources.filter(d => d.name.toLowerCase().includes(input.toLowerCase())).map(data => (
                                <div className="card w-72 h-96 bg-primary text-primary-content m-2" key={data.name}>
                                    <div className="card-body overflow-y-auto">
                                        <h2 className="text-sm font-bold uppercase">{data.created_by}</h2>
                                        <p className='text-lg'>{data.name.toUpperCase()}</p>
                                        <div className="flex-none">
                                            <Link href={data.link} target='_blank'><button className="btn btn-sm">View this Resource</button></Link>
                                        </div>
                                    </div>
                                </div>

                            ))
                        }
                    </div >
                </div >}
        </>
    )
}
