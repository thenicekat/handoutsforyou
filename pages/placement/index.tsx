import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");
    let pu_chronicles = fs.readdirSync("./public/placements/chronicles/");

    return {
        props: {
            pu_chronicles
        },
    };
};

export default function Placement({ pu_chronicles }: any) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>Placements.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Placements.</h1>

                    <Menu />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {session &&
                <div>
                    <h1 className="text-3xl text-center my-3">Placement Chronicles</h1>
                    <div className='grid md:grid-cols-4 place-items-center p-5'>
                        {
                            pu_chronicles.filter((d: string) => d.toLowerCase().includes(search.toLowerCase())).map((chron: string) => (
                                <div key={chron} className='m-2 py-1 rounded-xl'>
                                    <div className="alert ">
                                        <div>
                                            <span>Placement Season {chron}</span>
                                        </div>
                                        <div className="flex-none">
                                            <button className="btn btn-primary" onClick={
                                                () => window.open("https://github.com/Divyateja04/handoutsforyou/raw/main/public/ps/ps1_chronicles/" + chron)
                                            }>View</button></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>}

        </>
    );
}
