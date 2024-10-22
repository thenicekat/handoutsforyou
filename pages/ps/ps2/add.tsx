import Head from "next/head";
import { useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { years, allotmentRounds } from "@/data/ps2";
import AutoCompleter from "@/components/AutoCompleter";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";

export default function AddPS2Response({ }: {}) {
    const [idNumber, setIdNumber] = useState("");
    const [yearAndSem, setYearAndSem] = useState("");
    const [allotmentRound, setAllotmentRound] = useState("");
    const [station, setStation] = useState("");
    const [stipend, setStipend] = useState(0);
    const [cgpa, setCGPA] = useState(0);
    const [preference, setPreference] = useState(1);
    const [offshoot, setOffshoot] = useState(0);
    const [offshootTotal, setOffshootTotal] = useState(0);
    const [offshootType, setOffshootType] = useState("");
    const [isPublic, setIsPublic] = useState(true)

    const [isLoading, setIsLoading] = useState(false)

    const { data: session } = useSession()

    const AddResponse = async () => {
        setIsLoading(true)

        if (years.indexOf(yearAndSem) === -1) {
            toast.error("Invalid Year and Sem, Please select from the dropdown!")
            setIsLoading(false)
            return
        }

        if (allotmentRounds.indexOf(allotmentRound) === -1) {
            toast.error("Invalid Allotment Round, Please select from the dropdown!")
            setIsLoading(false)
            return
        }

        if (offshoot > offshootTotal) {
            toast.error("Offshoot cannot be greater than Offshoot Total!")
            setIsLoading(false)
            return
        }

        const res = await fetch("/api/ps/cutoffs/add", {
            method: "POST",
            body: JSON.stringify({
                typeOfPS: "ps2",
                idNumber: idNumber,
                yearAndSem: yearAndSem,
                allotmentRound: allotmentRound,
                station: station,
                stipend: stipend,
                cgpa: cgpa,
                preference: preference,
                offshoot: offshoot,
                offshootTotal: offshootTotal,
                offshootType: offshootType,
                public: isPublic ? 1 : 0
            }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        if (data.error) {
            toast.error(data.message)
        }
        else {
            toast.success("Thank you! Your response was added successfully!")
            setIdNumber("")
            setYearAndSem("")
            setAllotmentRound("")
            setStation("")
            setCGPA(0)
            setPreference(0)
            setOffshoot(0)
            setOffshootTotal(0)
            setOffshootType("")

            window.location.href = "/ps/ps2/"
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
                                <AutoCompleter name="allotment round" items={allotmentRounds} value={allotmentRound} onChange={(val) => setAllotmentRound(val)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="station" className="text-primary">Station (Please mention the role as well.)</label>
                                <input type="text" id="station" className="input input-secondary" value={station} onChange={(e) => setStation(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="cgpa" className="text-primary">Stipend</label>
                                <input type="number" id="stipend" className="input input-secondary" value={stipend} onChange={(e) => setStipend(parseFloat(e.target.value))} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="cgpa" className="text-primary">CGPA</label>
                                <input type="number" id="cgpa" className="input input-secondary" value={cgpa} onChange={(e) => setCGPA(parseFloat(e.target.value))} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="preference" className="text-primary">Preference</label>
                                <input type="number" id="preference" className="input input-secondary" value={preference} onChange={(e) => setPreference(parseFloat(e.target.value))} />
                            </div>

                            <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                <label className="text-primary">DO YOU WANT TO MAKE YOUR ID NUMBER PUBLIC? </label>
                                <input
                                    type="checkbox"
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    checked={isPublic}
                                />
                                <br />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshoot" className="text-primary">Offshoot (Ignore if not relevant)</label>
                                <input type="number" id="offshoot" className="input input-secondary" value={offshoot} onChange={(e) => setOffshoot(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootTotal" className="text-primary">Offshoot Total (Ignore if not relevant)</label>
                                <input type="number" id="offshootTotal" className="input input-secondary" value={offshootTotal} onChange={(e) => setOffshootTotal(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootType" className="text-primary">Offshoot Type (Ignore if not relevant)</label>
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