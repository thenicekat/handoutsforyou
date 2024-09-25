import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Menu from "@/components/Menu";


export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");
    let ps1_chronicles = fs.readdirSync("./public/ps/ps1_chronicles/");

    return {
        props: {
            ps1_chronicles,
        },
    };
};

export default function PS1Chronicles({ ps1_chronicles }: { ps1_chronicles: string[] }) {
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <title>PS 1 Chronicles.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu />
                </div>
            </div>

            {session &&
                <div>
                    <h1 className="text-3xl text-center my-3">PS1 Chronicles</h1>
                    <div className='grid md:grid-cols-3 place-items-center p-5'>
                        {
                            ps1_chronicles.map((chron: string) => (
                                <div key={chron} className='m-2 py-1 rounded-xl'>
                                    <div className="alert ">
                                        <div>
                                            <span>PS1 {chron}</span>
                                        </div>
                                        <div className="flex-none">
                                            <button className="btn btn-primary" onClick={
                                                () => window.open("https://github.com/thenicekat/handoutsforyou/raw/main/public/ps/ps1_chronicles/" + chron)
                                            }>View</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}