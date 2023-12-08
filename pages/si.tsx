import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../Components/Menu";

export default function PS({ }: any) {
    const [search, setSearch] = useState("");

    const chronicles = [
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
                <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Summer Internships For You.</h1>

                    <Menu current={"si"} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className='grid md:grid-cols-2 place-items-center p-5'>
                {
                    chronicles.map(chronicle => (
                        <div className="card w-96 bg-neutral text-neutral-content m-2">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">SI Chronicles {chronicle.name}</h2>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary" onClick={
                                        () => window.open(chronicle.link)
                                    }>View</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </>
    );
}
