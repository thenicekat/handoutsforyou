import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "../../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PS_Station } from "../../../types/PSData";
import { years } from "../../../data/ps1_years";
import { toast } from "react-toastify";
import CustomToastContainer from "../../../Components/ToastContainer";

export default function PS1Data() {
    const [search, setSearch] = useState("");
    const [cgpa, setCGPA] = useState(10);
    const [yearRef, setYearRef] = useState(years[0]);
    const [cachedYear, setCachedYear] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [ps1Data, setPS1Data] = useState([]);
    const [filteredPS1Data, setFilteredPS2Data] = useState([]);

    const { data: session } = useSession()

    const updateData = async () => {
        setIsLoading(true);
        if (yearRef == cachedYear) return
        const res = await fetch("/api/ps/ps2Cutoffs", {
            method: "POST",
            body: JSON.stringify({
                year: yearRef
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (res.status !== 400) {
            const data = await res.json();
            if (data.error) {
                toast(data.message);
                return
            } else {
                let ps1Data = data.data;
                setPS1Data(ps1Data);
            }
        }
        setCachedYear(yearRef);
        toast("Year updated successfully!")
        setIsLoading(false);
    }

    useEffect(() => { updateData() }, [])

    useEffect(() => {
        setIsLoading(true);
        let filteredPS1Data = ps1Data.filter((d: PS_Station) => d.min <= cgpa)
        filteredPS1Data = filteredPS1Data.filter((d: PS_Station) => d.station.toLowerCase().includes(search.toLowerCase()))
        filteredPS1Data = filteredPS1Data.sort((a: PS_Station, b: PS_Station) => b.min - a.min)
        setFilteredPS1Data(filteredPS1Data);
        setIsLoading(false);
    }, [ps1Data, cgpa, search])

    return (
        <>
            <Head>
                <title>PS 1 Cutoffs.</title>
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

                    {session && <>
                        <Link className="m-3" href={"/ps"}>
                            <button className="btn btn-outline w-full">
                                Are you looking for chronicles?
                            </button>
                        </Link>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <input
                                type="text"
                                placeholder="Filter using CGPA..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => {
                                    if (e.target.value == "") {
                                        setCGPA(10)
                                        return
                                    }
                                    setCGPA(parseFloat(e.target.value))
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Search for Company..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select className="select select-bordered w-full max-w-xs m-3" onChange={(e) => setYearRef(e.target.value)}>
                                <option disabled selected>Which year to use as reference?</option>
                                {
                                    years.map((year) => (
                                        <option value={year} key={year} selected={yearRef == year}>{year}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="m-3 w-full" href={"/ps/ps1/add"}>
                                <button className="btn btn-outline w-full">
                                    Add your response?
                                </button>
                            </Link>

                            <Link className="m-3 w-full" href={""}>
                                <button className="btn btn-outline w-full" onClick={updateData}>
                                    Update Results
                                </button>
                            </Link>
                        </div>

                        <p className="m-2">NOTE: This data is crowdsourced and might not be accurate.</p>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Companies: {ps1Data.length}</h1>
                    </div>

                    <div className='px-2 md:px-20'>
                        {
                            !isLoading ?
                                filteredPS1Data.map((station: PS_Station) => (
                                    <div className="py-1 m-2 rounded-xl" key={(station.station as string) + station.year}>
                                        <div className="alert">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>

                                            <span>{(station.station as string).toUpperCase()}</span>
                                            <span>{station.allotment_round && (station.allotment_round as string).toUpperCase()}</span>

                                            <div>
                                                <div className="tooltip" data-tip="Min. CGPA"><button className="btn btn-sm btn-primary disabled mx-1">Min: {station.min.toFixed(3)}</button></div>
                                                <div className="tooltip" data-tip="Max. CGPA"><button className="btn btn-sm btn-primary disabled mx-1">Max: {station.max.toFixed(3)}</button></div>
                                                {/* <div className="tooltip" data-tip="Number of Students"><button className="btn btn-sm btn-primary disabled">{(station[year] as CGPAGroup).students.length}</button></div> */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                <div className="flex justify-center">
                                    <h1 className="text-3xl text-primary">Loading...</h1>
                                </div>
                        }
                    </div>
                </div>
            }
            <CustomToastContainer containerId="ps1Data" />
        </>
    )
}