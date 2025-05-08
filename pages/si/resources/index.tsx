import { GetStaticProps } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Resource } from "@/types/Resource";
import { LinkIcon } from "@heroicons/react/24/solid";

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

interface ResourceByCategory {
    [key: string]: Resource[]
}

export default function SummerInternships({ siChronicles }: any) {
    const [input, setInput] = useState("");
    const { session } = useAuth()
    const [resources, setResources] = useState<ResourceByCategory>({})
    const [search, setSearch] = useState("");

    const resourcesList = [
        {
            name: "Summer Internship Companies Data",
            link: "/si/companies"
        },
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
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">Summer Internships.</h1>

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
                    <h1 className="text-3xl text-center my-3">Summer Internship Resources</h1>

                    <div className="collapse collapse-plus">
                        <input type="checkbox" />
                        <h1 className="collapse-title text-lg font-medium">General Resources x {resourcesList.length}</h1>

                        <div className="collapse-content">
                            <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                {
                                    resourcesList.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(resource => (
                                        <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={resource.name}>
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">General</h2>
                                                <p className='text-lg'>{resource.name.toUpperCase()}</p>

                                                <div className="flex-none">
                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => window.open(resource.link)}>Know more<LinkIcon className='w-5 h-5' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div >
                    </div>

                    {
                        Object.keys(siChronicles).map((campus: string) => (
                            <div className="collapse collapse-plus" key={campus}>
                                <input type="checkbox" />
                                <h1 className="collapse-title text-lg font-medium">SI Chronicles - {campus} x {siChronicles[campus].length}</h1>

                                <div className="collapse-content">
                                    <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                        {
                                            siChronicles[campus].filter((d: string) => d.toLowerCase().includes(search.toLowerCase())).map((chron: string) => (
                                                <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={campus + "/" + chron}>
                                                    <div className="card-body">
                                                        <h2 className="text-sm font-bold uppercase">SI Chronicles</h2>
                                                        <p className='text-lg'>SI Chronicles {chron.toUpperCase()}</p>

                                                        <div className="flex-none">
                                                            <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                                window.open("https://github.com/thenicekat/handoutsforyou/raw/main/public/si/" + campus + "/" + chron, "_blank")
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
