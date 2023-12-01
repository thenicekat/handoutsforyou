import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Menu from "../Components/Menu";

export default function PS({ }: any) {
    const [search, setSearch] = useState("");

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
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School For You.</h1>

                    <Menu current={"ps"} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

        </>
    );
}
