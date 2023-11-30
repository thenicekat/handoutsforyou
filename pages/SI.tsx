import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Menu from "../Components/Menu";

export default function SI({ }: any) {
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
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">SI For You.</h1>

                    <Menu current={"si"} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            <div className="px-2 md:px-20">
                <p>
                    Drive starts after 2-2, come in 3-1,3-2. All companies hold coding and interview rounds. SI gives you a good stipend and a chance of PPO. In general CG cutoff - 7.5 and there are Restrictions in branches. These companies will come on superset and you apply there with your resume. Create resume for company you want to apply to, then coding round, 1/2 interview rounds. If you get SI, cant go for 4-1 PS, PS will be in 4-2 and placements in 4-1. <a href="https://docs.google.com/presentation/d/1Gk-_2DuInZjV1yo0RvJ3iGSwG_4MPGvrUtw6bmwud_s/edit#slide=id.gb83e9fc38f_0_84">SI Presentation</a>
                    <br />
                    If you get offer, you have to accept it. otherwise you may not be allowed to sit for placements. You can go for off campus SI and this drive is diff for diff campuses. Once you get offer, the drive for you in done. You won&apos;t know the order in which the companies come, so it is up to you to decide which ones to apply for. The higher stipend ones may come earlier/later and you may miss out on those.
                    <br />
                    placement points → if you hit 0 from 10, you can&apos;t sit for SI/placements anymore
                </p>
            </div>
        </>
    );
}
