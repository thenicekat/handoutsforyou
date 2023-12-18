import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CGPAGroup, PS_Station } from "../types/PSData";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");

    let ps2_data = fs.readFileSync("./public/ps/ps1_data.json").toString();
    ps2_data = JSON.parse(ps2_data)

    return {
        props: {
            ps2_data,
        },
    };
};

export default function PS2({ ps2_data }: { ps2_data: PS_Station[] }) {
    const [search, setSearch] = useState("");
    const [cgpa, setCGPA] = useState(10);
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>PS 1 Responses.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu current={"ps"} />

                    {session && <>
                        <input
                            type="text"
                            placeholder="Please enter your CGPA..."
                            className="input input-bordered w-full max-w-xs m-3"
                            onChange={(e) => setCGPA(parseFloat(e.target.value))}
                        />

                        <input
                            type="text"
                            placeholder="Search for Company..."
                            className="input input-bordered w-full max-w-xs m-3"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <p>NOTE: This data is crowdsourced and might not be accuracte.</p>

                        {/* <select className="select select-bordered w-full max-w-xs" onChange={(e) => setYearRef(e.target.value)}>
                            <option disabled selected>Which year to use as reference?</option>
                            {
                                yearReferences.map((year) => (
                                    <option value={year} key={year}>{year}</option>
                                ))
                            }
                        </select> */}

                        <Link className="m-3" href={"/ps"}>
                            <button className="btn btn-outline w-full">
                                Are you looking for chronicles?
                            </button>
                        </Link>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    <div className='px-2 md:px-20'>
                        {
                            ps2_data
                                .filter((d: PS_Station) => (d.name as string).toLowerCase().includes(search.toLowerCase()))
                                .map((station: PS_Station) => (
                                    Object.keys(station)
                                        .filter(key => key != "name" && (station[key] as CGPAGroup).mincgpa <= cgpa)
                                        .map((key) => {
                                            return <div className="py-1 m-2 border-solid border-[1px] border-white rounded-xl" key={(station.name as string)}>
                                                <div className="alert shadow-sm">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <span>{(station.name as string).toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex-none">
                                                        <button className="btn btn-sm btn-primary disabled">{key}</button>
                                                        <button className="btn btn-sm btn-primary disabled">{(station[key] as CGPAGroup).mincgpa}</button>
                                                        <button className="btn btn-sm btn-primary disabled">{(station[key] as CGPAGroup).maxcgpa}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        })

                                ))
                        }
                    </div>
                </div >}

        </>
    );
}
