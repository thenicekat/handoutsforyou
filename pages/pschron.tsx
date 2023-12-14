import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";

type PS_Station = {
    name: string
    last_paid_stipend: number
    min_cgpa: number
    max_cgpa: number
}

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");
    let ps_chronicles = fs.readdirSync("./public/ps/chronicles/");

    return {
        props: {
            ps_chronicles,
        },
    };
};


export default function PS({ ps_chronicles }: any) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>Practice School.</title>
                <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu current={"ps"} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {session &&
                <div>
                    <h1 className="text-3xl text-center my-3">PS Chronicles</h1>
                    <div className='grid md:grid-cols-4 place-items-center p-5'>
                        {
                            ps_chronicles.filter((d: string) => d.toLowerCase().includes(search.toLowerCase())).map((chron: string) => (
                                <div className="card w-72 bg-neutral text-neutral-content m-2" key={chron}>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">PS Chronicles {chron.split(" ")[0]} Semester {chron.split(" ")[1]}</h2>
                                        <div className="card-actions justify-end">
                                            <button className="btn btn-primary" onClick={
                                                () => window.open("https://github.com/Divyateja04/handoutsforyou/raw/main/public/ps/chronicles/" + chron)
                                            }>View</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>}

        </>
    );
}
