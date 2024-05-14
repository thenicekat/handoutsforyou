import Head from "next/head";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Menu from "../../Components/Menu";


export default function AddPS2Response({ }: {}) {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [created_by, setCreatedBy] = useState("");

    const [isLoading, setIsLoading] = useState(false)

    const { data: session } = useSession()

    const AddResponse = async () => {
        setIsLoading(true)
        const data = await fetch("/api/resources/add", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                link: link,
                created_by: created_by
            }),
            headers: { "Content-Type": "application/json" }
        })
        const res = await data.json()
        if (res.error) {
            alert(res.message)
        }
        else {
            alert("Resource Added!")
            setName("")
            setLink("")
            setCreatedBy("")
        }
        setIsLoading(false)
    }

    return (
        <>
            <Head>
                <title>Academic Resources.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Academic Resources.</h1>

                    <Menu current={"notes"} />

                    {session &&
                        isLoading ?
                        <>
                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label className="text-primary">Loading...</label>
                            </div>
                        </>
                        :
                        <>
                            {/* Take input */}
                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="idNumber" className="text-primary">Name of the Resource</label>
                                <input type="text" id="idNumber" className="input input-secondary" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="yearAndSem" className="text-primary">Link</label>
                                <input type="text" id="yearAndSem" className="input input-secondary" value={link} onChange={(e) => setLink(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="allotmentRound" className="text-primary">Created By</label>
                                <input type="text" id="allotmentRound" className="input input-secondary" value={created_by} onChange={(e) => setCreatedBy(e.target.value)} />
                            </div>

                            <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                <button className="btn btn-primary" onClick={AddResponse}>Submit</button>
                            </div>
                        </>
                    }
                </div>
            </div>

        </>
    )
}