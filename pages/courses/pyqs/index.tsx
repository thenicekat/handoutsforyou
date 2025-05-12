import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import Menu from "@/components/Menu";
import Link from "next/link";

export default function Home() {
    const { session } = useAuth()

    return (
        <>
            <Head>
                <title>Handouts for You.</title>
                <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-adsense-account" content="ca-pub-8538529975248100" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">PYQs.</h1>
                    <Menu />
                </div>
            </div>

            {/* PYQs List */}
            {session &&
                <div className="px-2 md:px-20">
                    <div className="grid place-items-center text-lg p-10">
                        <p>
                            Most of these previous year question papers were collected from multiple seniors drives and from dspace. Almost all of these have solutions scraped from CMS rips. Please contact us to contribute more PYQs or solutions.
                            <br /><br />

                            To access the onedrive links you might have to create an account with your BITS email ID over at: <Link className="underline" href="https://www.microsoft.com/en-us/education/products/office">Microsoft Education</Link>
                            <br /><br />

                            You might not be able to download these files. That is because there were incidents where people just downloaded the files and reported the drives. So we have disabled the download option. You can view the files online and take screenshots if you want to.
                            <br /><br />

                            Apologize for the inconvenience caused.
                        </p>

                        <div className="flex-col block md:flex-row md:w-1/3 w-full justify-center m-3">
                            <button
                                className="btn w-full mb-5"
                                tabIndex={-1}
                                onClick={
                                    () => window.open("https://hyderabadbitspilaniacin0-my.sharepoint.com/:f:/g/personal/f20210075_hyderabad_bits-pilani_ac_in/EunGAZ-G5K1ErIlgk-n2-8YBc0nDlzhtjdHTmprPgNGrzg?e=ImbC9q")
                                }
                            >
                                View PYQs
                            </button>
                            <button
                                className="btn btn-outline w-full"
                                tabIndex={-1}
                                onClick={
                                    () => window.open("https://forms.gle/CTKfG8sPgzttjC817")
                                }
                            >
                                Add PYQs
                            </button>
                        </div>
                    </div>
                </div>}
        </>
    );
}
