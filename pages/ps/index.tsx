import Head from "next/head";
import Link from "next/link";
import Menu from "@/components/Menu";

export default function PS() {
    const psResources = [
        {
            title: "PS1 CGPA Cutoffs",
            link: "/ps/cutoffs/ps1"
        },
        {
            title: "PS2 CGPA Cutoffs",
            link: "/ps/cutoffs/ps2"
        },
        {
            title: "PS Chronicles",
            link: "/ps/chronicles"
        },
        {
            title: "PS1 Reviews",
            link: "/ps/reviews/ps1"
        },
        {
            title: "PS2 Reviews",
            link: "/ps/reviews/ps2"
        },
    ]
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
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu />
                </div>
                <div className='px-2 p-2 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-items-center'>
                    {
                        psResources.map(psResource => {
                            return <div className="grid place-items-center" key={psResource.title}>
                                <div className="card h-60 w-72 bg-base-100 text-base-content m-2">
                                    <div className="card-body">
                                        <p className='text-lg'>{psResource.title.toUpperCase()}</p>

                                        <div className="flex">
                                            <button className="btn btn-sm btn-primary m-1" onClick={() => {
                                                window.location.href = psResource.link
                                            }}>View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );
}
