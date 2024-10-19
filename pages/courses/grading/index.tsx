import { GetStaticProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { PreReqGroup } from "@/types/PreReq";
import Modal from "@/components/Modal";
import { toast } from 'react-toastify';
import { CourseGrading } from "@/types/CourseGrading";

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");

    let prereqs = fs.readFileSync("./public/prereqs.json").toString();
    prereqs = JSON.parse(prereqs)
    let courses: GradingProps = {};
    prereqs.forEach((prereq: PreReqGroup) => {
        courses[prereq.name] = [];
    });
    return {
        props: {
            courses,
        },
    };
};

interface GradingProps {
    [name: string]: CourseGrading[];
}

export default function Grading({ courses }: { courses: GradingProps }) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()
    const [open, setOpen] = useState(false);
    const [course, setCourse] = useState<string | null>(null);

    const toggleModal = () => {
        setOpen(!open);
    };

    const fetchGrading = async () => {
        const res = await fetch("/api/courses/grading/get")
        const data = await res.json()
        if (!data.error) {
            console.log(data.data)
            for (let i = 0; i < data.data.length; i++) {
                courses[data.data[i].category].push(data.data[i])
            }
        } else {
            toast.error("Error fetching course grading")
        }
    }

    const groupBySemester = (courseGradings: CourseGrading[]) => {
        return courseGradings.reduce((acc, courseGrading) => {
            const { semester } = courseGrading;
            if (!acc[semester]) {
                acc[semester] = [];
            }
            acc[semester].push(courseGrading);
            return acc;
        }, {} as Record<string, CourseGrading[]>);
    };

    React.useEffect(() => {
        fetchGrading()
    }, [])

    return (
        <>
            <Head>
                <title>Course Grading.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-6xl pt-[50px] pb-[20px] px-[35px] text-primary">Course Grading.</h1>

                    <Menu />

                    {session && <input
                        type="text"
                        placeholder="Search..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={(e) => setSearch(e.target.value)}
                    />}
                </div>
            </div>

            {session && <div className='grid md:grid-cols-3 place-items-center p-5'>
                <Modal open={open}>
                    <h3 className="font-bold text-lg">
                        {course}
                    </h3>
                    <div className="card-actions justify-begin text-primary my-3">
                        {
                            course && courses[course].length > 0
                                ?
                                (() => {
                                    const groupedBySemester = groupBySemester(courses[course]);
            
                                    return (
                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            {Object.keys(groupedBySemester).map(semester => (
                                                <div key={semester}>
                                                    <h3>Semester {semester}</h3>
                                                    <ul>
                                                        {groupedBySemester[semester].map((courseGrading: CourseGrading) => (
                                                            <li key={courseGrading.image}>
                                                                <img 
                                                                    src={`data:image/jpeg;base64,${courseGrading.image}`} 
                                                                    alt={`Grading by ${courseGrading.created_by}`} 
                                                                    style={{ width: '100%' }} 
                                                                />
                                                                <p>By: {courseGrading.created_by}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()
                                :
                                <p>No images. Be the first to upload one!</p>
                        }
                        <br />
                    </div>
                    <div className="modal-action">
                        <label className="btn btn-primary" onClick={() => toggleModal()}>Close</label>
                    </div>
                </Modal>
            
                {
                    Array.from(Object.keys(courses)).filter((name) => name.toLowerCase().includes(search.toLowerCase())).map((name) => (
                        <div className="card w-11/12 bg-secondary text-neutral-content m-2 cursor-grab" key={name} onClick={() => {
                            toggleModal()
                            setCourse(name)
                            console.log(name)
                        }}>
                            <div className="card-body items-center">
                                <h2 className="card-title text-primary">{name}</h2>
                            </div>
                        </div>
                    ))
                }
            </div>}

        </>
    );
}
