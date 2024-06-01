import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "../../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PS_Station } from "../../../types/PSData";

export default function PS2() {
    const [search, setSearch] = useState("");
    const [cgpa, setCGPA] = useState(10);

    const yearReferences = ["24-25 Sem 1", "23-24 Sem 2", "23-24 Sem 1", "22-23 Sem 2", "22-23 Sem 1", "21-22 Sem 1", "20-21 Sem 2", "20-21 Sem 1", "19-20 Sem 2", "19-20 Sem 1"]
    const [yearRef, setYearRef] = useState(yearReferences[0]);

    const [isLoading, setIsLoading] = useState(false);
    const [ps2Data, setPS2Data] = useState([]);

    const { data: session } = useSession()

    const fetchData = async () => {
        setIsLoading(true);
        const res = await fetch("/api/ps/ps2_cutoffs", {
            method: "POST",
            body: JSON.stringify({
                year: yearRef
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();

        if (data.error) {
            alert(data.message);
            return
        } else {
            setPS2Data(data.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        localStorage.setItem("h4u_ps2_yearRef", yearRef);
        fetchData();
    }, [yearRef])

    return (
        <>
            <Head>
                <title>PS 2 Cutoffs.</title>
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
                        <Link className="m-3" href={"/ps/ps2/add"}>
                            <button className="btn btn-outline w-full">
                                Add your own response?
                            </button>
                        </Link>

                        <Link className="m-3" href={"/ps"}>
                            <button className="btn btn-outline w-full">
                                Are you looking for chronicles?
                            </button>
                        </Link>

                        <input
                            type="text"
                            placeholder="Filter using CGPA..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={(e) => setCGPA(parseFloat(e.target.value) || 10)}
                        />

                        <input
                            type="text"
                            placeholder="Search for Company..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select className="select select-bordered w-full max-w-xs" onChange={(e) => setYearRef(e.target.value)}>
                            <option disabled selected>Which year to use as reference?</option>
                            {
                                yearReferences.map((year) => (
                                    <option value={year} key={year} selected={yearRef == year}>{year}</option>
                                ))
                            }
                        </select>

                        <p className="m-2">NOTE: This data is crowdsourced and might not be accurate.</p>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Responses: {ps2Data.length}</h1>
                    </div>

                    <div className='px-2 md:px-20'>
                        {
                            !isLoading ?
                                ps2Data
                                    .filter((d: PS_Station) => (d.station as string).toLowerCase().includes(search.toLowerCase()) && d.min <= cgpa)
                                    .sort((a: PS_Station, b: PS_Station) => b.min - a.min)
                                    .map((station: PS_Station) => (
                                        <div className="py-1 m-2 rounded-xl" key={(station.station as string) + station.year}>
                                            <div role="alert" className="alert">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>

                                                <span>{(station.station as string).toUpperCase()}</span>

                                                <div>
                                                    <div className="tooltip" data-tip="Min. CGPA"><button className="btn btn-sm btn-primary disabled mx-1">Min: {station.min.toFixed(3)}</button></div>
                                                    <div className="tooltip" data-tip="Max. CGPA"><button className="btn btn-sm btn-primary disabled mx-1">Max: {station.max.toFixed(3)}</button></div>
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
        </>
    )
}