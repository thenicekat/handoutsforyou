import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");

    let siChronicles: {
        [key: string]: string[]
    } = {}
    let dirs = fs.readdirSync("./public/si/");
    for (let dir of dirs) {
        siChronicles[dir] = []
        let files = fs.readdirSync("./public/si/" + dir)
        for (let file in files) {
            siChronicles[dir].push(files[file])
        }
    }

    return {
        props: {
            siChronicles
        },
    };
};

export default function SI({ siChronicles }: any) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    const resources = [
        {
            name: "Summer Internship Guide: Harshit Juneja",
            link: "https://docs.google.com/document/d/1q6i_IVYwhOSpt8IpyrT4n5N4DfDi4oq0r-pBTsWebjE/edit?usp=sharing"
        },
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
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[15px] text-primary">Summer Internships.</h1>

                    <Menu />

                    {session && <input
                        type="text"
                        placeholder="Search..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />}
                </div>
            </div>

            {session &&
                <div className='place-items-center p-5'>
                    <h1 className="text-3xl text-center my-3">SI Resources</h1>
                    {
                        resources.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(chronicle => (
                            <div key={chronicle.link} className='m-2 py-1 rounded-xl'>
                                <div role="alert" className="alert">
                                    <svg className="stroke-info shrink-0 w-6 h-6" viewBox="0 0 20 20">
                                        <path d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"></path>
                                    </svg>
                                    <span>{chronicle.name}</span>
                                    <div>
                                        <button className="btn btn-sm btn-primary" onClick={
                                            () => window.open(chronicle.link)
                                        }>View</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <div>
                        <h1 className="text-3xl text-center my-3">SI Chronicles</h1>
                        {
                            Object.keys(siChronicles).map((campus: string) => (
                                <>
                                    <h1 key={campus} className="text-2xl text-center my-3">{campus}</h1>
                                    <div className='grid md:grid-cols-3 place-items-center p-5'>
                                        {
                                            siChronicles[campus]
                                                .filter((d: string) => d.toLowerCase().includes(search.toLowerCase()))
                                                .map((chron: string) => (
                                                    <div key={chron} className='m-2 p-1 rounded-xl w-full'>
                                                        <div className="bg-secondary flex border-2 border-secondary rounded-xl p-2 align-middle justify-between">
                                                            <div className="flex items-center">
                                                                <span>SI Chronicles {chron}</span>
                                                            </div>
                                                            <div>
                                                                <button className="btn btn-primary" onClick={
                                                                    () => window.open("https://github.com/thenicekat/handoutsforyou/raw/main/public/si/" + campus + "/" + chron)
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
                    </div>
                </div>}

        </>
    );
}
