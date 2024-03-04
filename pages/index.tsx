import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession } from 'next-auth/react';
import Menu from "../Components/Menu";
import Link from "next/link";

const HandoutsPerYear = dynamic(() => import("./../Components/HandoutsPerYear"), {
  loading: () => (
    <div className="grid place-items-center">
      <p className="text-xl m-3">
        Loading...
      </p>
    </div >
  ),
});

export const getStaticProps: GetStaticProps = async () => {
  const fs = require("fs");
  const handoutsMap: any = {};

  const semsWithYears = fs.readdirSync("./public/handouts/");

  semsWithYears.forEach((sem: string) => {
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
  const { data: session } = useSession()
  const [search, setSearch] = useState("");
  const [actualSearch, setActualSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchHandouts = () => {
    setIsLoading(true)
    setActualSearch(search)
    setIsLoading(false)
  }

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
        <div className="w-[70vw] place-items-center flex flex-col justify-between">
          <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Handouts for You.</h1>
          <Menu current={"home"} />
          {session &&
            <>
              <input type="text" placeholder="Search..." className="input input-secondary w-full max-w-xs" onChange={e => setSearch(e.target.value)} />
              <Link className="m-3 w-full max-w-xs" href={""}>
                <button className="btn btn-outline w-full" onClick={fetchHandouts}>
                  Filter Handouts
                </button>
              </Link>
            </>}
        </div>
      </div>

      {/* Handouts List */}
      {session && !isLoading && <div className="px-2 md:px-20">
        {Object.keys(handoutsMap)
          .reverse()
          .map((handoutMap: any) => {
            return (
              <>
                <HandoutsPerYear
                  handouts={handoutsMap[handoutMap]}
                  year={handoutMap}
                  key={handoutMap}
                  searchWord={actualSearch}
                />
                <hr />
              </>
            );
          })}
      </div>}

      {
        isLoading && <div className="grid place-items-center">
          <p className="text-xl m-3">Loading...</p>
        </div>
      }
    </>
  );
}
