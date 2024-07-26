import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AutoCompleter from "@/Components/AutoCompleter";
import CustomToastContainer from "@/Components/ToastContainer";
import { toast } from "react-toastify";
import { PS_Review } from "@/types/PSData";

export default function PS1Reviews({ }: {}) {
    const [station, setStation] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [reviews, setReviews] = useState([] as PS_Review[]);

    const { data: session } = useSession()

    const fetchReviews = async () => {
        setIsLoading(true)
        const response = await fetch("/api/ps/reviews/get", {
            method: "POST",
            body: JSON.stringify({ type: "PS1" }),
            headers: { "Content-Type": "application/json" }
        })
        if (response.status !== 400) {
            const res = await response.json()
            if (res.error && res.status !== 400) {
                toast.error(res.message)
                setIsLoading(false)
            } else {
                let reviews: PS_Review[] = res.data as PS_Review[]
                reviews = reviews.sort((a, b) => {
                    if (a.station > b.station) return 1
                    else if (a.station < b.station) return -1
                    else return 0
                })
                setReviews(reviews)
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    return (
        <>
            <Head>
                <title>PS1 Reviews.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">PS1 Reviews.</h1>

                    <Menu />

                    {session && <>
                        <input type="text" placeholder="Search..." className="input input-secondary w-full max-w-xs" onChange={e => setStation(e.target.value)} />
                        <span className="m-2"></span>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Reviews: {reviews.length}</h1>
                    </div>

                    <div className='px-2 md:px-20 p-2'>
                        {
                            !isLoading ?
                                reviews
                                    .filter(review => review.station.toLowerCase().includes(station.toLowerCase()))
                                    .map((review) => (
                                        <div className="card shadow-lg bg-base-100 text-base-content mt-5" key={review.created_at}>
                                            <div className="card-body">
                                                <h2 className="card-title text-center">Station Name: {review.station} Batch: {review.batch}</h2>
                                                <p>{review.review}</p>
                                                <p className="italic">Submitted at: {new Date(review.created_at).toLocaleString("en-IN", {})}</p>
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
            <CustomToastContainer containerId="ps1Reviews" />
        </>
    )
}