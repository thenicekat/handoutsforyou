import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react'
import Menu from '../Components/Menu';

type DataLinkType = {
    name: string,
    link: string
}

export default function Notes() {
    const [input, setInput] = useState("");
    const groupWiseResources: DataLinkType[] = [
        {
            name: "Acad Sem Wise Tracker Template",
            link: "https://docs.google.com/spreadsheets/d/1hrfrx9yIHyq7ik6XhxsRTTx275SxbZo6I-ZUOho9oL8/edit?usp=sharing"
        },
        {
            name: "All Semester - Computer Science Course Resources",
            link: "https://hyderabadbitspilaniacin0-my.sharepoint.com/:f:/g/personal/f20210075_hyderabad_bits-pilani_ac_in/EjmBjVxy6AJDh3ZAIgaiMsUBqr8bEQp1r3IPdI4PtD5ZkA?e=sgO558"
        },
        {
            name: "Sudhanshu's 2-1 Phoenix Resources - EM, EMT, ED, DD, Intro to Dev Studies, EVS",
            link: "https://drive.google.com/drive/folders/1YWAHsJySYLsQVkQtS-B45JoWUFcuCjBc?usp=share_link"
        },
        {
            name: "Sudhanshu's 2-2 Phoenix Resources - Consys, Mass Comm, MEC, MPi, POE, Pop Lit",
            link: "https://drive.google.com/drive/folders/1_f1yZnfg1ATSluRBBwNu6hnPyyGX0sVz?usp=drive_link"
        },
        {
            name: "C Programming - CP Notes",
            link: "/notes/CP/cp.html"
        },
        {
            name: "Probability and Statistics - PnS Notes",
            link: "/notes/PnS Notes.pdf"
        },
        {
            name: "Mathematics 2 - M2 Notes",
            link: "/notes/M2 Notes.pdf"
        },
        {
            name: "Technical Report Writing - TRW Notes",
            link: "/notes/TRW/trw.html"
        },
        {
            name: "Mathematics 3 - M3 Notes",
            link: "/notes/M3 Compre Notes.pdf"
        },
        {
            name: "Digital Design - DD Notes",
            link: "/notes/DD Notes.pdf"
        },
        {
            name: "Principles of Economics - POE Notes",
            link: "/notes/POE/poe.html"
        },
        {
            name: "Computer Mediated Communications - CMC Notes",
            link: "/notes/CMC/cmc.html"
        },
        {
            name: "Globalization Notes",
            link: "/notes/Glob/Glob.html"
        },
        {
            name: "Machine Learning Notes",
            link: "/notes/ML Notes.pdf"
        },
        {
            name: "Linguistics Incomplete Notes",
            link: "/notes/Linguistics/Linguistics.html"
        },
        {
            name: "FoFa Incomplete Notes",
            link: "/notes/FoFa/FoFa.html"
        },
    ];

    return (
        <>
            <Head>
                <title>Notes and Resources.</title>
                <meta name="description" content="Handouts app for bits hyderabad" />
                <meta name="description" content="BPHC Handouts" />
                <meta name="description" content="Handouts for you." />
                <meta
                    name="description"
                    content="handouts, bits pilani hyderabad campus"
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='grid place-items-center'>
                <div className='w-[50vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-6xl p-[35px]'>Notes and Resources.</h1>
                    <Menu current={"notes"} />
                    <input type="text" placeholder="Search..." className="input input-bordered w-full max-w-xs" onChange={e => setInput(e.target.value)} />
                </div>
                <h5 className='text-lg'>Contain PYQs and Solutions if available, textbooks, textbook solutions, slides and notes</h5>
            </div>

            <div className='grid place-items-center p-5'>
                <div className="w-100 place-items-center flex flex-col justify-between border border-primary-300 rounded-box">
                    <div>
                        {
                            groupWiseResources.filter(d => d.name.toLowerCase().includes(input.toLowerCase())).map(data => (
                                <div key={data.link} className='py-1'>
                                    <div className="alert shadow-sm">
                                        <div>
                                            <svg className="stroke-info flex-shrink-0 w-6 h-6 invert" viewBox="0 0 20 20">
                                                <path d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"></path>
                                            </svg>
                                            <span>{data.name.toUpperCase()}</span>
                                        </div>
                                        <div className="flex-none">
                                            <Link href={data.link} target='_blank'><button className="btn btn-sm">View</button></Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
