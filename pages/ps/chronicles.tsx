import { GetStaticProps } from "next";
import Head from "next/head";
import Menu from "@/components/Menu";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");
    let ps1_chronicles = fs.readdirSync("./public/ps/ps1_chronicles/");
    let ps2_chronicles = fs.readdirSync("./public/ps/ps2_chronicles/");

    return {
        props: {
            ps1_chronicles,
            ps2_chronicles,
        },
    };
};

export default function PSChronicles({ ps1_chronicles, ps2_chronicles }: { ps1_chronicles: string[], ps2_chronicles: string[] }) {

    return (
        <>
            <Head>
                <title>PS Chronicles</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary text-center mb-8">Practice School</h1>
                    <Menu />
                </div>

                <div className="space-y-12 mt-12">
                    <section>
                        <h2 className="text-3xl font-semibold text-center mb-8">PS1 Chronicles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {ps1_chronicles.map((chron: string) => (
                                <div key={chron} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="card-body p-4">
                                        <h3 className="card-title text-lg">PS1 {chron}</h3>
                                        <div className="card-actions justify-end mt-2">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => window.open(`https://github.com/thenicekat/handoutsforyou/raw/main/public/ps/ps1_chronicles/${chron}`)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold text-center mb-8">PS2 Chronicles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {ps2_chronicles.map((chron: string) => (
                                <div key={chron} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="card-body p-4">
                                        <h3 className="card-title text-lg">PS2 {chron}</h3>
                                        <div className="card-actions justify-end mt-2">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => window.open(`https://github.com/thenicekat/handoutsforyou/raw/main/public/ps/ps2_chronicles/${chron}`)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
