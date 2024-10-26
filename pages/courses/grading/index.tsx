import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CourseGrading } from "@/types/CourseGrading";
import { courses } from "@/data/courses";
import { profs } from "@/data/profs";
import AutoCompleter from "@/components/AutoCompleter";
import CustomToastContainer from "@/components/ToastContainer";
import { toast } from "react-toastify";

interface GradingBySemester {
    [key: string]: CourseGrading[]
}

export default function Grading() {
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gradings, setGradings] = useState<GradingBySemester>({});

    const { data: session } = useSession();

    const parseCSVToTable = (csv: string) => {
        const rows = csv.trim().split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1);

        return (
            <div className="">
                <table className="table table-fixed w-full table-zebra">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th className={"break-normal text-pretty"} key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.split(',').map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const fetchGradings = async () => {
        if (courses.includes(course) === false && course !== "") {
            toast.error("Please select a course from the given list!");
            return;
        }
        if (profs.includes(prof) === false && prof !== "") {
            toast.error("Please select a professor from the given list!");
            return;
        }

        setIsLoading(true);
        const res = await fetch("/api/courses/grading/get", {
            method: "POST",
            body: JSON.stringify({ course: course, prof: prof }),
            headers: { "Content-Type": "application/json" }
        });

        if (res.status !== 400) {
            const response = await res.json();
            if (response.error && response.status !== 400) {
                toast.error(response.message);
            } else {
                const gradingBySemester: GradingBySemester = {};
                response.data.forEach((grading: CourseGrading) => {
                    if (!gradingBySemester[grading.sem]) {
                        gradingBySemester[grading.sem] = [];
                    }
                    gradingBySemester[grading.sem].push(grading);
                });
                setGradings(gradingBySemester);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchGradings();
    }, []);

    useEffect(() => {
        localStorage.setItem("h4u_grading_course", course);
        localStorage.setItem("h4u_grading_prof", prof);
    });

    return (
        <>
            <Head>
                <title>Course Grading.</title>
                <meta name="description" content="Course grading information and statistics" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Course Grading.</h1>

                    <Menu />

                    {session && <>
                        <AutoCompleter name={"Course"} items={courses} value={course} onChange={(val) => setCourse(val)} />
                        <span className="m-2"></span>
                        <AutoCompleter name={"Prof"} items={profs} value={prof} onChange={(val) => setProf(val)} />
                        <p className="text-center p-2 m-2">P.S. You can search only using profs, and only using courses.</p>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="m-3 w-full hidden md:block" href={"/courses/grading/add"}>
                                <button className="btn btn-outline w-full">
                                    Add Grading
                                </button>
                            </Link>

                            <Link className="m-3 w-full" href={""}>
                                <button className="btn btn-outline w-full" onClick={fetchGradings}>
                                    Filter Grading
                                </button>
                            </Link>
                        </div>
                    </>}
                </div>
            </div>

            {session && (
                <div className="max-w-7xl mx-auto px-2 md:px-20 p-4">
                    {isLoading ? (
                        <div className="flex justify-center">
                            <h1 className="text-3xl text-primary">Loading...</h1>
                        </div>
                    ) : (
                        <>
                            {Object.keys(gradings).sort((a, b) => b.localeCompare(a)).map((sem) => (
                                <div key={course} className="mb-4 w-full">
                                    <div className="collapse collapse-plus w-full">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-xl md:text-2xl font-medium">
                                            {sem} ({gradings[sem].length} entries)
                                        </div>
                                        <div className="collapse-content w-full overflow-x-auto">
                                            {gradings[sem].map((grading) => (
                                                <div className="card bg-base-100 shadow-xl mb-4 w-full" key={grading.id}>
                                                    <div className="card-body">
                                                        <h2 className="card-title text-center md:text-left text-base sm:text-lg md:text-xl break-words">
                                                            {grading.course} - Prof. {grading.prof}
                                                        </h2>
                                                        {grading.dept !== "ALL" &&
                                                            <p className="text-sm text-gray-500">
                                                                For the branch: {grading.dept}
                                                            </p>
                                                        }
                                                        <div className="-mx-4 sm:-mx-6 md:-mx-8">
                                                            <div className="min-w-min px-4 sm:px-6 md:px-8">
                                                                {parseCSVToTable(grading.data)}
                                                            </div>
                                                            <p className="text-center p-2 m-2">
                                                                The average mark for this course was: {grading.average_mark || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
            <CustomToastContainer containerId="courseGrading" />
        </>
    );
}
