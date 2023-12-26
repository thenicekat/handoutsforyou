import Head from "next/head";
import { useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { supabase } from '../api/supabase';
import { CourseReview } from "../../types/CourseReview";
import { courses } from "../../data/courses";
import { profs } from "../../data/profs";


export default function AddReview({ }: {}) {
    const [crsSearch, setCrsSearch] = useState("");
    const [course, setCourse] = useState("");

    const [profSearch, setProfSearch] = useState("");
    const [prof, setProf] = useState("");

    const [review, setReview] = useState("");

    const { data: session } = useSession()

    const AddReview = async () => {
        if (course == "") {
            alert("Please fill course!")
            return
        }
        if (prof == "") {
            alert("Please fill professor!")
            return
        }
        if (review == "") {
            alert("Please fill review!")
            return
        }

        const { error } = await supabase
            .from('reviews')
            .insert([
                { course: course, prof: prof, review: review, created_by: session?.user?.email }
            ])

        if (error) console.log(error)
        else {
            alert("Review Added!")
            setCourse("")
            setProf("")

        }
    }

    return (
        <>
            <Head>
                <title>Course Reviews.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Course Reviews.</h1>

                    <Menu current={"reviews"} />

                    {session && <>
                        <div className="text-center flex-wrap w-3/4 justify-between m-2">
                            <input
                                type="text"
                                placeholder="Search for Courses..."
                                className="input input-bordered w-full max-w-xs"
                                onChange={(e) => setCrsSearch(e.target.value)}
                            />

                            <select className="select select-bordered w-full max-w-xs" onChange={(e) => setCourse(e.target.value)}>
                                {crsSearch.length == 0 && <option disabled selected>Select Course</option>}
                                {
                                    courses.filter(crs => (crs.toLowerCase().includes(crsSearch.toLowerCase()))).map((course) => (
                                        <option value={course} key={course}>{course}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-2">
                            <input
                                type="text"
                                placeholder="Search for Profs..."
                                className="input input-bordered w-full max-w-xs"
                                onChange={(e) => setProfSearch(e.target.value)}
                            />

                            <select className="select select-bordered w-full max-w-xs" onChange={(e) => setProf(e.target.value)}>
                                {profSearch.length == 0 && <option disabled selected>Select Prof</option>}
                                {
                                    profs.filter(prs => (prs.toLowerCase().includes(profSearch.toLowerCase()))).map((prof) => (
                                        <option value={prof} key={prof}>{prof}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="text-center w-full h-52 m-2">
                            <input
                                type="textarea"
                                placeholder="Enter your Review..."
                                className="input input-bordered w-full max-w-xs h-full"
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-2">
                            <button className="btn btn-primary" onClick={AddReview}>Add Review</button>
                        </div>
                    </>}
                </div>
            </div>

        </>
    )
}