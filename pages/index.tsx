import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const YearComponent = dynamic(() => import("./../Components/YearComponent"), {
  loading: () => (
    <div className="grid place-items-center">
      <p className="text-xl">Loading...</p>
    </div>
  ),
});

export const getStaticProps: GetStaticProps = async () => {
  const fs = require("fs");
  const handoutsMap: any = {};

  const semsWithYears = fs.readdirSync("./public/handouts/");

  semsWithYears.forEach((sem: any) => {
    const semWiseHandouts = fs.readdirSync("./public/handouts/" + sem);
    handoutsMap[sem] = semWiseHandouts;
  });

  return {
    props: {
      handoutsMap,
    },
  };
};

export default function Home({ handoutsMap }: any) {
  const [search, setSearch] = useState("");

  return (
    <>
      <Head>
        <title>Handouts for You.</title>
        <meta name="description" content="Handouts app for bits hyderabad" />
        <meta name="description" content="BPHC Handouts" />
        <meta name="description" content="Handouts for you." />
        <meta
          name="description"
          content="handouts, bits pilani hyderabad campus"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Search box */}
      <div className="grid place-items-center">
        <div className="w-[50vw] place-items-center flex flex-col justify-between">
          <h1 className="text-5xl p-3">Handouts For You.</h1>
          <p className="py-3">
            NOTE: Contains all BITS Pilani, Hyderabad Campus handouts for
            18-19/20-21/21-22/22-23 but only GS and HSS handouts for 19-20. If
            you have any handout and it is missing here, Please send the handout
            through{" "}
            <Link
              className="text-cyan-400 underline"
              href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"}
            >
              email
            </Link>
          </p>
          <div className="py-3">
            <Link className="m-4" href={"/minors.html"}>
              <button className="btn btn-outline btn-primary">
                Info. about Minors
              </button>
            </Link>
            <Link className="m-4" href={"/notes"}>
              <button className="btn btn-outline btn-primary">
                Notes and Resources
              </button>
            </Link>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Handouts List */}
      <div className="px-2 md:px-20">
        {Object.keys(handoutsMap)
          .reverse()
          .map((handoutMap: any) => {
            return (
              <YearComponent
                handouts={handoutsMap[handoutMap]}
                year={handoutMap}
                key={handoutMap}
                searchWord={search}
              />
            );
          })}
      </div>
    </>
  );
}
