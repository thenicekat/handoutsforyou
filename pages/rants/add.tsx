import Head from "next/head";
import { useState, useEffect } from "react";
import Menu from "@/Components/Menu";
import { useSession } from "next-auth/react";
import { courses } from "@/data/courses";
import { profs } from "@/data/profs";
import AutoCompleter from "@/Components/AutoCompleter";
import CustomToastContainter from "@/Components/ToastContainer"
import { toast } from "react-toastify";


export default function AddReview({ }: {}) {
    const [rant, setRant] = useState("");

    const { data: session } = useSession()

    const AddRant = async () => {
        if (rant == "") {
            toast.error("Please fill rant!")
            return
        }

        const data = await fetch("/api/rants/add", {
            method: "POST",
            body: JSON.stringify({ rant: rant }),
            headers: { "Content-Type": "application/json" }
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        }
        else {
            toast.success("Rant Added!")
            setRant("")
            window.location.href = "/rants"
        }
    }

    return (
        <>
            <Head>
                <title>Anonymous Rants.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Rant away.</h1>

                    <Menu />

                    {session && <>

                        <div className="text-center w-full m-2 h-60">
                            <textarea
                                className="textarea textarea-primary w-full max-w-xl h-full"
                                placeholder="Gg, do rr..."
                                onChange={(e) => setRant(e.target.value)}
                                value={rant}
                            ></textarea>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button className="btn btn-primary" onClick={AddRant}>Add Rant</button>
                        </div>
                    </>}
                </div>
            </div>

            <CustomToastContainter containerId="addRant" />
        </>
    )
}