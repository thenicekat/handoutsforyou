import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");
    let pu_chronicles: {
        [key: string]: string[]
    } = {}
    let dirs = fs.readdirSync("./public/placements/chronicles/");
    for (let dir of dirs) {
        pu_chronicles[dir] = []
        let files = fs.readdirSync("./public/placements/chronicles/" + dir)
        for (let file in files) {
            pu_chronicles[dir].push(files[file])
        }
    }

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
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Placements.</h1>

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
                    {
                        Object.keys(pu_chronicles).map((campus: string) => (
                            <>
                                <h1 key={campus} className="text-2xl text-center my-3">{campus}</h1>
                                <div className='grid md:grid-cols-3 place-items-center p-5'>
                                    {
                                        pu_chronicles[campus]
                                            .filter((d: string) => d.toLowerCase().includes(search.toLowerCase()))
                                            .map((chron: string) => (
                                                <div key={chron} className='m-2 p-1 rounded-xl w-full'>
                                                    <div className="bg-secondary flex border-2 border-secondary rounded-xl p-2 align-middle justify-between">
                                                        <div className="flex items-center">
                                                            <span>Placement Season {chron}</span>
                                                        </div>
                                                        <div>
                                                            <button className="btn btn-primary" onClick={
                                                                () => window.open("https://github.com/thenicekat/handoutsforyou/raw/main/public/placements/chronicles/" + campus + "/" + chron)
                                                            }>
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    }
                                </div>
                            </>
                        ))
                    }
                </div>}

        </>
    );
}
