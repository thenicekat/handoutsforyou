import Head from "next/head";
import { useState } from "react";
import Menu from "@/Components/Menu";
import { useSession } from "next-auth/react";
import { years } from "@/data/ps2_years";
import AutoCompleter from "@/Components/AutoCompleter";
import { toast } from "react-toastify";
import CustomToastContainer from "@/Components/ToastContainer";

type PSDataRes = {
    typeOfPS: string,
    idNumber: string,
    yearAndSem: string,
    allotmentRound: string,
    station: string,
    cgpa: number,
    preference: number,
    offshoot: number,
    offshootTotal: number,
    offshootType: string,
}

export default function AddPS2Response({ }: {}) {
    const [idNumber, setIdNumber] = useState("");
    const [yearAndSem, setYearAndSem] = useState("");
    const [allotmentRound, setAllotmentRound] = useState("Round 1");
    const [station, setStation] = useState("");
    const [cgpa, setCGPA] = useState(0);
    const [preference, setPreference] = useState(0);
    const [offshoot, setOffshoot] = useState(0);
    const [offshootTotal, setOffshootTotal] = useState(0);
    const [offshootType, setOffshootType] = useState("");

    const [isLoading, setIsLoading] = useState(false)

    const { data: session } = useSession()

    const AddResponse = async () => {
        setIsLoading(true)

        if (years.indexOf(yearAndSem) === -1) {
            toast.error("Invalid Year and Sem, Please select from the dropdown!")
            setIsLoading(false)
            return
        }

        const res = await fetch("/api/ps/add", {
            method: "POST",
            body: JSON.stringify({
                typeOfPS: "ps2",
                idNumber: idNumber,
                yearAndSem: yearAndSem,
                allotmentRound: allotmentRound,
                station: station,
                cgpa: cgpa,
                preference: preference,
                offshoot: offshoot,
                offshootTotal: offshootTotal,
                offshootType: offshootType,
            }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        if (data.error) {
            toast.error(data.message)
        }
        else {
            toast.success("Response Added!")
            setIdNumber("")
            setYearAndSem("")
            setAllotmentRound("")
            setStation("")
            setCGPA(0)
            setPreference(0)
            setOffshoot(0)
            setOffshootTotal(0)
            setOffshootType("")

            window.location.href = "/ps/ps2/data"
        }
        setIsLoading(false)
    }

    return (
        <>
            <Head>
                <title>Practice School.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu />

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
                                <label htmlFor="idNumber" className="text-primary">ID Number</label>
                                <input type="text" id="idNumber" className="input input-secondary" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="yearAndSem" className="text-primary">Year and Sem</label>
                                <AutoCompleter name="Year and Sem" value={yearAndSem} items={years} onChange={(e) => setYearAndSem(e)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="allotmentRound" className="text-primary">Allotment Round</label>
                                <input type="text" id="allotmentRound" className="input input-secondary" value={allotmentRound} onChange={(e) => setAllotmentRound(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="station" className="text-primary">Station</label>
                                <input type="text" id="station" className="input input-secondary" value={station} onChange={(e) => setStation(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="cgpa" className="text-primary">CGPA</label>
                                <input type="number" id="cgpa" className="input input-secondary" value={cgpa} onChange={(e) => setCGPA(parseFloat(e.target.value) || 0)} />
                            </div>


                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="preference" className="text-primary">Preference</label>
                                <input type="number" id="preference" className="input input-secondary" value={preference} onChange={(e) => setPreference(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshoot" className="text-primary">Offshoot</label>
                                <input type="number" id="offshoot" className="input input-secondary" value={offshoot} onChange={(e) => setOffshoot(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootTotal" className="text-primary">Offshoot Total</label>
                                <input type="number" id="offshootTotal" className="input input-secondary" value={offshootTotal} onChange={(e) => setOffshootTotal(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootType" className="text-primary">Offshoot Type</label>
                                <input type="text" id="offshootType" className="input input-secondary" value={offshootType} onChange={(e) => setOffshootType(e.target.value)} />
                            </div>

                            <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                <button className="btn btn-primary" onClick={AddResponse}>Add Response</button>
                            </div>
                        </>
                    }
                </div>
            </div>
            <CustomToastContainer containerId="addPS2Response" />
        </>
    )
}