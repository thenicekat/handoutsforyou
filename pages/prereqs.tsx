import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "../Components/Menu";
import { useSession } from "next-auth/react";

type PreReq = {
    prereq_name: string,
    pre_cop: string
}

type PreReqGroup = {
    name: string,
    all_one: string,
    prereqs: PreReq[]
};

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");

    let prereqs = fs.readFileSync("./public/prereqs.json").toString();
    prereqs = JSON.parse(prereqs)

    return {
        props: {
            prereqs,
        },
    };
};


export default function Prereqs({ prereqs }: { prereqs: PreReqGroup[] }) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>Course Prerequisites.</title>
                <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Course Prerequisites.</h1>

                    <Menu current={"ps"} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {session && <div className='grid md:grid-cols-3 place-items-center p-5'>
                {
                    prereqs.filter((d: PreReqGroup) => d.name.toLowerCase().includes(search.toLowerCase())).map((preqgroup: PreReqGroup) => (
                        <div className="card w-9/12 bg-neutral text-neutral-content m-2" key={preqgroup.name}>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{preqgroup.name}</h2>
                                <div className="card-actions justify-end">
                                    {preqgroup.prereqs.length > 0 ? preqgroup.prereqs.map((preq) => <p key={preq.prereq_name}>{preq.prereq_name}</p>) : <p>No Prerequisites</p>}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div >}

        </>
    );
}
