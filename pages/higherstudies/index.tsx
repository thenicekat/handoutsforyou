import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";


export default function HigherStudies() {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    const mastersResources = [
        {
            name: "GRADUATE APPLICATIONS: EVERYTHING YOU NEED TO KNOW",
            created_by: "Mahith Tunuguntla",
            link: "https://docs.google.com/document/d/1FjYQYsvS2fLqtGPoMzaC60y9p_e-U13U6tjKOdlYZqo/edit"
        },
    ]

    const mbaResources = [
        {
            name: "BITS2BSchool Facebook Group",
            created_by: "BITS2BSchool",
            link: "https://www.facebook.com/groups/238673429575065"
        }
    ]

    return (
        <>
            <Head>
                <title>Higher Studies.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Higher Studies.</h1>

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
                    <h1 className="text-3xl text-center my-3">Resources</h1>

                    <div className="collapse collapse-plus">
                        <input type="checkbox" />
                        <h1 className="collapse-title text-xl font-medium">Masters&apos; Resources x {mastersResources.length}</h1>

                        <div className="collapse-content">
                            <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                {
                                    mastersResources.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(resource => (
                                        <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={resource.name}>
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">{resource.created_by}</h2>
                                                <p className='text-lg'>{resource.name.toUpperCase()}</p>

                                                <div className="flex">
                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                        window.open(resource.link)
                                                    }}>View</button>

                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                        navigator.clipboard.writeText(resource.link)
                                                        toast.info("Link copied!")
                                                    }}><DocumentDuplicateIcon className='w-5 h-5' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div >
                    </div>

                    <div className="collapse collapse-plus">
                        <input type="checkbox" />
                        <h1 className="collapse-title text-xl font-medium">MBA Resources x {mbaResources.length}</h1>

                        <div className="collapse-content">
                            <div className='px-2 p-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                                {
                                    mbaResources.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(resource => (
                                        <div className="card w-72 h-96 bg-base-100 text-base-content m-2" key={resource.name}>
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">{resource.created_by}</h2>
                                                <p className='text-lg'>{resource.name.toUpperCase()}</p>

                                                <div className="flex">
                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                        window.open(resource.link)
                                                    }}>View</button>

                                                    <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                        navigator.clipboard.writeText(resource.link)
                                                        toast.info("Link copied!")
                                                    }}><DocumentDuplicateIcon className='w-5 h-5' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div >
                    </div>
                </div>
            }
            <CustomToastContainer containerId="higherStudies" />
        </>
    );
}
