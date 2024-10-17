import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { PreReqGroup } from "@/types/PreReq";
import Modal from "@/components/Modal";
import { toast } from 'react-toastify';

export const getStaticProps: GetStaticProps = async () => {
    const fs = require("fs");

    let prereqs = fs.readFileSync("./public/prereqs.json").toString();
    prereqs = JSON.parse(prereqs)
    let courses: GradingProps = {};
    prereqs.forEach((prereq: PreReqGroup) => {
        courses[prereq.name] = {"name": prereq.name, "images": []};
    });
    return {
        props: {
            courses,
        },
    };
};

interface ImageItem {
    image: string;
    created_by: string;
    isMidsem: boolean;
}

interface CourseGrading {
    name: string;
    images: ImageItem[];
}

interface GradingProps {
    [name: string]: CourseGrading;
}

export default function Grading({ courses }: { courses: GradingProps }) {
    const [search, setSearch] = useState("");
    const { data: session } = useSession()
    const [open, setOpen] = useState(false);
    const [course, setCourse] = useState<CourseGrading | null>(null);

    const toggleModal = () => {
        setOpen(!open);
    };

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
                        {course?.name}
                    </h3>
                    <div className="card-actions justify-begin text-primary my-3">
                        {
                            course && course.images.length > 0
                                ?
                                course.images.map((imageItem) =>
                                    <li key={imageItem.image}>{imageItem.image} (By: {imageItem.created_by})</li>
                                )
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
                            setCourse(courses[name])
                        }}>
                            <div className="card-body items-center">
                                <h2 className="card-title text-primary">{name}</h2>
                            </div>
                        </div>
                    ))
                }
            </div >}

        </>
    );
}
