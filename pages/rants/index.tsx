import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CustomToastContainer from "@/components/ToastContainer";
import { toast } from "react-toastify";
import { Rant } from "@/types/Rant";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Reviews({ }: {}) {
    const [isLoading, setIsLoading] = useState(false);

    const [rants, setRants] = useState([] as Rant[]);

    const { data: session } = useSession()

    const fetchRants = async () => {
        setIsLoading(true)
        const res = await fetch("/api/rants/get", {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" }
        })
        if (res.status !== 400) {
            const rants = await res.json()
            if (rants.error && rants.status !== 400) {
                toast.error(rants.message)
                setIsLoading(false)
            } else {
                setRants(rants.data.reverse())
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchRants()
    }, [])

    return (
        <>
            <Head>
                <title>Rants.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Rants.</h1>

                    <Menu />

                    {session && <>
                        <span className="m-2"></span>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="w-full hidden md:block" href={"/rants/add"}>
                                <button className="btn btn-outline w-full" tabIndex={-1}>
                                    Add a Rant
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link className="m-3 w-full" href={"/rants/add"}>
                                <PlusCircleIcon />
                            </Link>
                        </div>

                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary m-3 text-center">Rants in the last week: {rants.length}</h1>
                    </div>

                    <div className='px-2 md:px-20 p-2'>
                        {
                            !isLoading ?
                                rants
                                    .map((rant) => (
                                        <div className="card shadow-lg bg-base-100 break-words text-base-content mt-5" key={rant.created_at}>
                                            <div className="card-body">
                                                <div className="badge badge-outline my-3 px-3">Rant #{rant.id} | {rant.public == 1 ? "Public" : "Private"}</div>
                                                <p>{rant.rant}</p>
                                                <p className="italic">Submitted at: {new Date(rant.created_at).toLocaleString("en-IN", {})}</p>
                                            </div>
                                        </div>
                                    )) :
                                <div className="flex justify-center">
                                    <h1 className="text-3xl text-primary">Loading...</h1>
                                </div>
                        }
                    </div>
                </div>
            }
            <CustomToastContainer containerId="courseReviews" />
        </>
    )
}
