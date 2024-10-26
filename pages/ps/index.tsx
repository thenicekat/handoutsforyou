import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Menu from "@/components/Menu";
import { useEffect, useState } from "react";
import CustomToastContainer from "@/components/ToastContainer";
import { toast } from "react-toastify";
import { PS1Item, PS2Item } from "@/types/PSData";

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
                toast.error(res.message);
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
                    <Link className="m-3 w-full" href={"/ps/ps1/chronicles"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS1 Chronicles
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps1/"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS1 CGPA Cutoffs
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps1/reviews"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS1 Reviews
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row w-1/2 justify-center">
                    <Link className="m-3 w-full" href={"/ps/ps2/chronicles"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS2 Chronicles
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps2/"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS2 CGPA Cutoffs
                        </button>
                    </Link>

                    <Link className="m-3 w-full" href={"/ps/ps2/reviews"}>
                        <button className="btn btn-outline w-full" tabIndex={-1}>
                            PS2 Reviews
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

                            <div className='grid md:grid-cols-2 place-items-center p-3'>
                                {data.ps1 && data.ps1.length > 0 ? data.ps1.map((item: PS1Item, index: number) => {
                                    return (
                                        <div key={index} className='p-3 border border-gray-300 rounded-md w-3/4'>
                                            <div className='text-xl text-center'>PS1</div>
                                            <div className='text-lg font-semibold'>Station: {item.station}</div>
                                            <div className='text-lg font-semibold'>CGPA: {item.cgpa}</div>
                                            <div className='text-lg font-semibold'>Preference: {item.preference}</div>
                                            <div className='text-lg font-semibold'>Allotment Round: {item.allotment_round}</div>
                                            <div className='text-lg font-semibold'>Year and Semester: {item.year_and_sem}</div>

                                            <div className="m-3 w-full text-center">
                                                <button className="btn btn-outline w-1/2" onClick={() => {
                                                    localStorage.setItem("h4u_ps_review_data", JSON.stringify({
                                                        type: "PS1",
                                                        batch: item.year_and_sem,
                                                        station: item.station,
                                                    }))
                                                    window.location.href = "/ps/reviews/add"
                                                }}>
                                                    Add Review.
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }) :
                                    <div className="m-3 w-full text-center">
                                        <Link href={"/ps/ps1/add"}>
                                            <button className="btn btn-outline w-1/2" tabIndex={-1}>
                                                No PS1 Data Found! Click here to add.
                                            </button>
                                        </Link>
                                    </div>
                                }

                                {data.ps2 && data.ps2.length > 0 ? data.ps2.map((item: PS2Item, index: number) => {
                                    return (
                                        <div key={index} className='p-3 border border-gray-300 rounded-md w-3/4'>
                                            <div className='text-xl text-center'>PS2</div>
                                            <div className='text-lg font-semibold'>Station: {item.station}</div>
                                            <div className='text-lg font-semibold'>Stipend: {item.stipend}</div>
                                            <div className='text-lg font-semibold'>CGPA: {item.cgpa}</div>
                                            <div className='text-lg font-semibold'>Preference: {item.preference}</div>
                                            <div className='text-lg font-semibold'>Allotment Round: {item.allotment_round}</div>
                                            <div className='text-lg font-semibold'>Year and Semester: {item.year_and_sem}</div>
                                            <div className='text-lg font-semibold'>Offshoot: {item.offshoot}</div>
                                            <div className='text-lg font-semibold'>Offshoot Total: {item.offshoot_total}</div>
                                            <div className='text-lg font-semibold'>Offshoot Type: {item.offshoot_type}</div>

                                            <div className="m-3 w-full text-center">
                                                <button className="btn btn-outline w-1/2" onClick={() => {
                                                    localStorage.setItem("h4u_ps_review_data", JSON.stringify({
                                                        type: "PS2",
                                                        batch: item.year_and_sem,
                                                        station: item.station,
                                                    }))
                                                    window.location.href = "/ps/reviews/add"
                                                }}>
                                                    Add Review.
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }) :
                                    <div className="m-3 w-full text-center">
                                        <Link href={"/ps/ps2/add"}>
                                            <button className="btn btn-outline w-1/2" tabIndex={-1}>
                                                No PS2 Data Found! Click here to add.
                                            </button>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </>
                        :
                        <div className='text-lg text-center font-semibold'>Loading...</div>
                    }
                </div>
            }
            <CustomToastContainer containerId="ps" />
        </>
    );
}
