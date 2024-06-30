import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Menu from "../../Components/Menu";
import { useEffect, useState } from "react";

type PS1Item = {
    created_at: string;
    email: string;
    allotment_round: string;
    year_and_sem: string;
    station: string;
    cgpa: number;
    preference: number;
    id: number;
}

type PS2Item = {
    id_number: string | undefined,
    year_and_sem: string,
    allotment_round: string,
    station: string,
    cgpa: number,
    preference: number,
    offshoot: number,
    offshoot_total: number,
    offshoot_type: string,
}

export default function PS() {
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>({});

    const fetchData = async () => {
        setIsLoading(true);
        const response = await fetch("/api/ps/me", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (response.status !== 400) {
            const res = await response.json();
            if (res.error) {
                alert(res.message);
                return
            } else {
                setData(res.data);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => { fetchData() }, []);

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
                    <h1 className="text-3xl text-center my-3">Your PS Dashboard</h1>
                    <h1 className="text-xl text-center my-3">Please contribute to this project by sharing your PS details</h1>

                    {!isLoading ?
                        <>
                            <h1 className="text-2xl text-center my-3">Your PS1 Data</h1>
                            <div className='grid md:grid-cols-2 place-items-center p-5'>
                                {data.ps1 && data.ps1.length > 0 ? data.ps1.map((item: PS1Item, index: number) => {
                                    return (
                                        <div key={index} className='p-3 border border-gray-300 rounded-md'>
                                            <div className='text-lg font-semibold'>Station: {item.station}</div>
                                            <div className='text-lg font-semibold'>CGPA: {item.cgpa}</div>
                                            <div className='text-lg font-semibold'>Preference: {item.preference}</div>
                                            <div className='text-lg font-semibold'>Allotment Round: {item.allotment_round}</div>
                                            <div className='text-lg font-semibold'>Year and Semester: {item.year_and_sem}</div>
                                        </div>
                                    )
                                }) : <div className='text-lg font-semibold'>No Data found, <Link href="/ps/ps1/add">
                                    Please enter data</Link></div>}
                            </div>

                            <h1 className="text-2xl text-center my-3">Your PS2 Data</h1>
                            <div className='grid md:grid-cols-2 place-items-center p-5'>
                                {data.ps2 && data.ps2.length > 0 ? data.ps2.map((item: PS2Item, index: number) => {
                                    return (
                                        <div key={index} className='p-3 border border-gray-300 rounded-md'>
                                            <div className='text-lg font-semibold'>Station: {item.station}</div>
                                            <div className='text-lg font-semibold'>CGPA: {item.cgpa}</div>
                                            <div className='text-lg font-semibold'>Preference: {item.preference}</div>
                                            <div className='text-lg font-semibold'>Allotment Round: {item.allotment_round}</div>
                                            <div className='text-lg font-semibold'>Year and Semester: {item.year_and_sem}</div>
                                            <div className='text-lg font-semibold'>Offshoot: {item.offshoot}</div>
                                            <div className='text-lg font-semibold'>Offshoot Total: {item.offshoot_total}</div>
                                            <div className='text-lg font-semibold'>Offshoot Type: {item.offshoot_type}</div>
                                        </div>
                                    )
                                }) : <div className='text-lg font-semibold'>No Data found, <Link href="/ps/ps2/add">
                                    Please enter data</Link></div>}
                            </div>
                        </>
                        :
                        <div className='text-lg text-center font-semibold'>Loading...</div>
                    }
                </div>
            }

        </>
    );
}
