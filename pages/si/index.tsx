import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SI_Company } from "../../types/SIData";

export default function SICompanies() {
    const [search, setSearch] = useState("");

    const yearReferences = ["2023-2024", "2022-2023", "2021-2022", "2020-2021"]
    const [yearRef, setYearRef] = useState(yearReferences[0]);

    const [isLoading, setIsLoading] = useState(false);
    const [SIData, setSIData] = useState([]);

    const { data: session } = useSession()

    const fetchData = async () => {
        setIsLoading(true);
        const res = await fetch("/api/si/getcompanies", {
            method: "POST",
            body: JSON.stringify({
                year: yearRef
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        console.log(data)

        if (data.error) {
            alert(data.message);
            return
        } else {
            setSIData(data.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [yearRef])

    return (
        <>
            <Head>
                <title>Summer Internships.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Summer Internships.</h1>

                    <Menu current={"ps"} />

                    {session && <>
                        <input
                            type="text"
                            placeholder="Search for Company..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select className="select select-bordered w-full max-w-xs" onChange={(e) => setYearRef(e.target.value)}>
                            <option disabled selected>Select Year?</option>
                            {
                                yearReferences.map((year) => (
                                    <option value={year} key={year} selected={yearRef == year}>{year}</option>
                                ))
                            }
                        </select>

                        <Link className="m-3" href={"/si/resources"}>
                            <button className="btn btn-outline w-full">
                                Are you looking for resources?
                            </button>
                        </Link>
                    </>}
                </div>

                <div className="w-[70vw] place-items-center flex flex-col justify-between m-2">NOTE: This content was scrapped from SI Chronicles and belongs to Placement Unit</div>
            </div>

            {session &&
                <div>
                    <div className='px-2 md:px-20'>
                        {
                            !isLoading ?
                                SIData
                                    .filter((d: SI_Company) => d.name.toLowerCase().includes(search.toLowerCase()) || d.roles.toLowerCase().includes(search.toLowerCase()))
                                    .map((station: SI_Company) => (
                                        <div className="collapse collapse-plus py-1 m-2 rounded-xl bg-secondary" key={station.name + station.roles}>
                                            <input type="checkbox" className="peer" />
                                            <div className="collapse-title bg-secondary text-primary font-bold text-lg">
                                                {station.name.toUpperCase()}: {station.roles.toUpperCase()}
                                            </div>
                                            <div className="collapse-content bg-secondary text-primary">
                                                <ul className="m-2 list-disc">
                                                    <li>CGPA Cutoff: {station.cgpa_cutoff}</li>
                                                    <li>Roles: {station.roles}</li>
                                                    <li>Stipend: {station.stipend}</li>
                                                    <li>Selection Rounds: {station.selection_rounds}</li>
                                                    <li>Eligibility: {station.eligibility}</li>
                                                    <li>Selects: {station.selects}</li>
                                                    {station.otherdetails && <li>Other Details: {station.otherdetails}</li>}
                                                </ul>

                                                <div className="my-4">
                                                    <button className="btn btn-outline"
                                                        onClick={() => {
                                                            window.location.href = `/si/chronicles/${yearRef}_${station.name}`
                                                        }}>
                                                        View Chronicles
                                                    </button>
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