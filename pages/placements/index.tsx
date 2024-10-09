import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { LinkIcon } from "@heroicons/react/24/solid";

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

    const resources = [
        {
            name: "Placements CTC Data",
            link: "/placements/ctcs"
        },
        {
            name: "Company Wise OA Questions",
            link: "https://drive.google.com/drive/folders/1NlbJI1MAfb4UfL5h5AoaeO6-UlA3hF22?usp=sharing"
        },
        {
            name: "All IIT, NIT, IIIT Placement and Intern OAs",
            link: "https://drive.google.com/drive/folders/1Siv1g-kRqmiwArvivAKikZL9DQd2mGPV?usp=sharing"
        },
        {
            name: "Placement OA Questions - ET - 2020",
            link: "https://drive.google.com/drive/u/0/folders/1F-k4zWAesz2LbP1qeNccaSi3Zrh-0pT7"
        },
        {
            name: "Placement OA Questions - ET - 2019",
            link: "https://drive.google.com/drive/folders/19ztdWFDLxKTyNrrxgSLjm3MHRo4nqVo8?usp=drive_link"
        },
        {
            name: "Placement OA Questions - ET - 2018",
            link: "https://drive.google.com/drive/folders/1I4OA8WiwrA9I1cBuFSy_vMRwXQCiWAZE?usp=drive_link"
        },
        {
            name: "Placement OA Questions - EE - 2018",
            link: "https://drive.google.com/drive/folders/1AkF0xiK2eXH6o24k_32ziOB6pdkBrfHp?usp=drive_link"
        },
    ]

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
                <div className='place-items-center p-5 max-w-7xl mx-auto'>
                    <h1 className="text-3xl text-center my-3">Placement Resources</h1>

                    <div className="collapse collapse-plus">
                        <input type="checkbox" />
                        <h1 className="collapse-title text-xl font-medium">General Resources</h1>

                        <div className="collapse-content">
                            <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                {
                                    resources.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(resource => (
                                        <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={resource.name}>
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">General</h2>
                                                <p className='text-lg'>{resource.name.toUpperCase()}</p>

                                                <div className="flex-none">
                                                    <button className="btn btn-sm btn-primary m-1" tabIndex={-1} onClick={() => window.open(resource.link)}>Know more<LinkIcon className='w-5 h-5' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div >
                    </div>

                    {
                        Object.keys(pu_chronicles).map((campus: string) => (
                            <div className="collapse collapse-plus" key={campus}>
                                <input type="checkbox" />
                                <h1 className="collapse-title text-xl font-medium">Placement Chronicles - {campus}</h1>

                                <div className="collapse-content">
                                    <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                        {
                                            pu_chronicles[campus].filter((d: string) => d.toLowerCase().includes(search.toLowerCase())).map((chron: string) => (
                                                <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={campus + "/" + chron}>
                                                    <div className="card-body">
                                                        <h2 className="text-sm font-bold uppercase">Placement Chronicles</h2>
                                                        <p className='text-lg'>Placement Chronicles {chron.toUpperCase()}</p>

                                                        <div className="flex-none">
                                                            <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                                window.open("https://github.com/thenicekat/handoutsforyou/raw/main/public/placements/chronicles/" + campus + "/" + chron, "_blank")
                                                            }}>Know more<LinkIcon className='w-5 h-5' /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div >
                            </div>
                        ))
                    }
                </div>
            }

        </>
    );
}
