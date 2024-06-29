import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Menu from "../../Components/Menu";

export default function PS() {
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>Practice School.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu />
                </div>

                <div className="flex flex-col md:flex-row w-1/2 justify-center">
                    <Link className="m-3 w-full" href={"/ps/ps1/data"}>
                        <button className="btn btn-outline w-full">
                            PS1 CGPA Cutoffs
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps2/data"}>
                        <button className="btn btn-outline w-full">
                            PS2 CGPA Cutoffs
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row w-1/2 justify-center">
                    <Link className="m-3 w-full" href={"/ps/ps1/chronicles"}>
                        <button className="btn btn-outline w-full">
                            PS1 Chronicles
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps2/chronicles"}>
                        <button className="btn btn-outline w-full">
                            PS2 Chronicles
                        </button>
                    </Link>
                </div>
            </div>


            {session &&
                <div>
                    <h1 className="text-3xl text-center my-3">PS Dashboard</h1>
                    <div className='grid md:grid-cols-4 place-items-center p-5'>

                    </div>
                </div>}

        </>
    );
}
