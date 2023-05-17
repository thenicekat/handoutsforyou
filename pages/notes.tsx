import { useState } from 'react'

export default function Notes() {
    const [input, setInput] = useState("");
    const groupdata = [
        {
            name: "1-1 Resources - MeOW, EEE, M1, Chem, Workshop",
            link: "https://drive.google.com/drive/folders/1CnTsW7eex3adZY0TgLsTeNPRF2RTX4y4?usp=share_link"
        },

        {
            name: "1-2 Resources - CP, TRW, Bio, M2, PnS, EG",
            link: "https://drive.google.com/drive/folders/1bkFqiiPP1bN-w-ezvtQ5j5mSkyNTttaM?usp=share_link"
        },
        {
            name: "2-1 CS Resources - Logic, Disco, DD, M3, PoE, OOPL, CMC",
            link: "https://drive.google.com/drive/folders/1A1jvtyWRMzu14oq1wc6vFxeS-tKJrQEN?usp=sharing"
        },
        {
            name: "2-2 CS Resources - DSA, DBMS, MPi, ML, Globalization, EVS",
            link: "https://drive.google.com/drive/folders/1uRiJ7Mrbwtjvm3J5ljPsKzJ3mI5XAyus?usp=share_link"
        },
        {
            name: "2-1 Phoenix Resources - EM, EMT, ED, DD, Intro to Dev Studies, EVS",
            link: "https://drive.google.com/drive/folders/1YWAHsJySYLsQVkQtS-B45JoWUFcuCjBc?usp=share_link"
        }
    ];
    const coursewise = [
        {
            name: "Mathematics 1 - M1 Notes",
            link: "https://drive.google.com/file/d/1d-fdqKVl5kTf3Yx649teiAooxAxWMuiR/view?usp=share_link"
        },
        {
            name: "C Programming - CP Notes",
            link: "/notes/CP/cp.html"
        },
        {
            name: "Probability and Statistics - PnS Notes",
            link: "https://drive.google.com/file/d/1P4KFVTR-GlMEltfyAi4rg2laaJkcBJjh/view"
        },
        {
            name: "Mathematics 2 - M2 Notes",
            link: "https://drive.google.com/file/d/1Yjd1U4yDskDln5Sl_6h02hpRtNoqpl6g/view"
        },
        {
            name: "Technical Report Writing - TRW Notes",
            link: "/notes/TRW/trw.html"
        },
        {
            name: "Mathematics 3 - M3 Notes",
            link: "https://drive.google.com/file/d/19GvuOCJne0yfholKESraZ54HASAtTUFm/view?usp=share_link"
        },
        {
            name: "Object Oriented Programming - OOPL Notes",
            link: "/notes/OOP/oop.html"
        },
        {
            name: "Digital Design - DD Notes",
            link: "https://drive.google.com/file/d/1uDqE4AYudKAuAd5P5Fv61GNjwbI8cvnm/view?usp=share_link"
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
            link: "https://drive.google.com/file/d/1c-oJ1Qu9ffpk0_X0t9hdkAIH9PslOL0H/view?usp=sharing"
        },
        {
            name: "DBMS Notes",
            link: "/notes/DBMS/dbms.html"
        },
        {
            name: "Linguistics Incomplete Notes",
            link: "/notes/Linguistics/Linguistics.html"
        },
        {
            name: "FoFa Incomplete Notes",
            link: "/notes/FoFa/FoFa.html"
        },
    ]

    return (
        <>
            <div className='grid place-items-center'>
                <div className='w-[50vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-6xl p-[35px]'>Notes and Resources.</h1>
                    <input type="text" placeholder="Search..." className="input input-bordered w-full max-w-xs" onChange={e => setInput(e.target.value)} />
                </div>
            </div>

            <div className='grid place-items-center py-3'>
                <div className="w-100 place-items-center flex flex-col justify-between">
                    <h1 className='text-4xl p-3'>BITS Combined Resources</h1>
                    <h3 className='text-xl'>(Contains PYQs and Solutions if available, textbooks, textbook solutions, slides and notes)</h3>
                    <div>
                    {
                        groupdata.filter(d => d.name.toLowerCase().includes(input.toLowerCase())).map(data => (
                            <a href={data.link} key={data.link} className='text-xl text-pink-600 dark:text-pink-500 hover:underline'><h4 className='py-1'>{data.name}</h4></a>
                        ))
                    }
                    </div>
                </div>
            </div>

            <div className='grid place-items-center py-3'>
                <div className="w-100 place-items-center flex flex-col justify-between">
                    <h1 className='text-4xl p-3'>Course Wise Notes</h1>
                    <div>
                    {
                        coursewise.filter(d => d.name.toLowerCase().includes(input.toLowerCase())).map(data => (
                            <a href={data.link} key={data.link} className='text-xl text-pink-600 dark:text-pink-500 hover:underline'><h4 className='py-1'>{data.name}</h4></a>
                        ))
                    }
                    </div>
                    <hr />
                </div>
            </div>
        </>
    )
}
