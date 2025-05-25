import Head from "next/head";
import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import { useAuth } from "@/hooks/useAuth";
import CustomToastContainter from "@/components/ToastContainer"
import { toast } from "react-toastify";
import AutoCompleter from "@/components/AutoCompleter";
import { allotmentRounds, semesters } from "@/data/years_sems";
import { years } from "@/data/placements";

export default function AddReview({ }: {}) {
    const [PSType, setPSType] = useState("");
    const [PSBatch, setPSBatch] = useState("");
    const [PSStation, setPSStation] = useState("");
    const [PSReview, setPSReview] = useState("");
    const [PSAllotmentRound, setPSAllotmentRound] = useState("");
    const [batches, setBatches] = useState([] as string[]);

    const { session } = useAuth()

    const AddReview = async () => {
        if (!PSType || !PSBatch || !PSStation) {
            toast.error("Please fill in all PS details")
            return
        }
        if (!PSReview) {
            toast.error("Review cannot be empty!")
            return
        }
        const data = await fetch("/api/ps/reviews/add", {
            method: "POST",
            body: JSON.stringify({ type: PSType, batch: PSBatch, station: PSStation, review: PSReview, created_by: session?.user?.email }),
            headers: { "Content-Type": "application/json" }
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        }
        else {
            toast.success("Thank you! Your review was added successfully!")
            setPSReview("")
            setPSType("")
            setPSBatch("")
            setPSStation("")
            window.location.href = '/ps'
        }
    }

    useEffect(() => {
        if (PSType === "PS1") {
            setBatches(years)
        }
        else if (PSType === "PS2") {
            setBatches(semesters)
        }
    }, [PSType])

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
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">PS Reviews.</h1>

                    <Menu />

                    {session && <>
                        <div className="w-full max-w-xl space-y-4 mb-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">PS Type</span>
                                </label>
                                <select
                                    className="select select-primary w-full"
                                    value={PSType}
                                    onChange={(e) => setPSType(e.target.value)}
                                >
                                    <option value="">Select PS Type</option>
                                    <option value="PS1">PS1</option>
                                    <option value="PS2">PS2</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Station</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter station name"
                                    className="input input-primary w-full"
                                    value={PSStation}
                                    onChange={(e) => setPSStation(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Batch</span>
                                </label>
                                <AutoCompleter
                                    items={batches}
                                    value={PSBatch}
                                    onChange={setPSBatch}
                                    name="batch"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Allotment Round</span>
                                </label>
                                <AutoCompleter
                                    items={allotmentRounds}
                                    value={PSAllotmentRound}
                                    onChange={setPSAllotmentRound}
                                    name="Allotment Round"
                                />
                            </div>
                        </div>

                        <div className="text-center w-full m-2 h-60">
                            <textarea
                                className="textarea textarea-primary w-full max-w-xl h-full"
                                placeholder="Enter your Review..."
                                onChange={(e) => setPSReview(e.target.value)}
                                value={PSReview}
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