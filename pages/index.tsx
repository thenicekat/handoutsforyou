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
        <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
        <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Search box */}
      <div className="grid place-items-center">
        <div className="w-[50vw] place-items-center flex flex-col justify-between">
          <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px]">Handouts For You.</h1>
          
          <p>Made with &lt;3 by <Link
            className="text-black underline"
            href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"}
          >
            Divyateja Pasupuleti
          </Link>
          {' '} and {' '}
          <Link
            className="text-black underline"
            href={"mailto:f20211989@hyderabad.bits-pilani.ac.in"}
          >
            Vashisth Choudhari
          </Link>
          </p>


          <div className="py-3">
            <Link className="m-5" href={"/minors.html"}>
              <button className="btn btn-outline">
                Info. about Minors
              </button>
            </Link>
            <Link className="m-5" href={"/notes"}>
              <button className="btn btn-outline">
                Notes and Resources
              </button>
            </Link>
            <Link className="m-5" href={"/faqs"}>
              <button className="btn btn-outline">
                FAQs about Campus
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
