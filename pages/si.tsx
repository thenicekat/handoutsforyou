import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../Components/Menu";
import { useSession } from "next-auth/react";

export default function PS({ }: any) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    const chronicles = [
        {
            name: "2020-2021",
            link: "https://github.com/Divyateja04/handoutsforyou/raw/main/public/si/20-21.pdf"
        },
        {
            name: "2021-2022",
            link: "https://github.com/Divyateja04/handoutsforyou/raw/main/public/si/21-22.pdf"
        },
        {
            name: "2022-2023",
            link: "https://github.com/Divyateja04/handoutsforyou/raw/main/public/si/22-23.pdf"
        }
    ]

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

                    <Menu current={"si"} />

                    {session && <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />}
                </div>
            </div>

            {session && <div className='place-items-center p-5'>
                {
                    chronicles.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(chronicle => (
                        <div key={chronicle.link} className='m-2 py-1 rounded-xl'>
                            <div className="alert shadow-sm">
                                <div>
                                    <span>SI Chronicles {chronicle.name}</span>
                                </div>
                                <div className="flex-none">
                                    <button className="btn btn-primary" onClick={
                                        () => window.open(chronicle.link)
                                    }>View</button></div>
                            </div>
                        </div>
                    ))
                }
            </div>}

        </>
    );
}
