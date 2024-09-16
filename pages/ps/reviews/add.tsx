import Head from "next/head";
import { useState, useEffect } from "react";
import Menu from "@/Components/Menu";
import { useSession } from "next-auth/react";
import CustomToastContainter from "@/Components/ToastContainer"
import { toast } from "react-toastify";


export default function AddReview({ }: {}) {
    const [PSReviewData, setPSReviewData] = useState<{
        type: string,
        batch: string,
        station: string,
    }>();
    const [review, setReview] = useState("");

    const { data: session } = useSession()

    const AddReview = async () => {
        if (!PSReviewData) {
            toast.error("Invalid Request - PS Data missing")
            return
        }
        if (!review) {
            toast.error("Review cannot be empty!")
            return
        }
        const data = await fetch("/api/ps/reviews/add", {
            method: "POST",
            body: JSON.stringify({ ...PSReviewData, review: review, created_by: session?.user?.email }),
            headers: { "Content-Type": "application/json" }
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        }
        else {
            toast.success("Thank you! Your review was added successfully!")
            setReview("")
            if (localStorage.getItem("h4u_ps_review_data")) {
                localStorage.removeItem("h4u_ps_review_data")
            }
            window.location.href = '/ps'
        }
    }

    useEffect(() => {
        if (localStorage.getItem("h4u_ps_review_data")) {
            setPSReviewData(JSON.parse(localStorage.getItem("h4u_ps_review_data")!))
        }
    }, [])

    return (
        <>
            <Head>
                <title>PS Reviews.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Course Reviews.</h1>

                    <Menu />

                    {session && <>
                        You are submitting a review for {PSReviewData?.type}:
                        <span className="text-primary">Station: {PSReviewData?.station}</span>
                        <span className="text-primary">Batch: {PSReviewData?.batch}</span>

                        <div className="text-center w-full m-2 h-60">
                            <textarea
                                className="textarea textarea-primary w-full max-w-xl h-full"
                                placeholder="Enter your Review..."
                                onChange={(e) => setReview(e.target.value)}
                                value={review}
                            ></textarea>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button className="btn btn-primary" onClick={AddReview}>Add Review</button>
                        </div>
                    </>}
                </div>
            </div>

            <CustomToastContainter containerId="addPSReview" />
        </>
    )
}