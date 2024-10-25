import Head from "next/head";
import { GetStaticProps } from "next";
import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import { courses } from "@/data/courses";
import { profs } from "@/data/profs";
import { departments } from "@/data/departments";
import AutoCompleter from "@/components/AutoCompleter";
import CustomToastContainer from "@/components/ToastContainer";
import { toast } from "react-toastify";
import { GradeRow } from "@/types/CourseGrading";
import { gradedSemesters } from "@/data/years_sems";

export const getStaticProps: GetStaticProps = async () => {
    const depts: string[] = Object.values(departments)
        .flatMap((code: string) => code.split('/'))
        .map(code => code.trim())
        .filter(code => code.length > 0);

    return {
        props: {
            depts,
        },
    };
};

export default function AddGrading({ depts }: { depts: string[] }) {
    const [course, setCourse] = useState("");
    const [dept, setDept] = useState("");
    const [prof, setProf] = useState("");
    const [semester, setSemester] = useState("");
    const [gradingData, setGradingData] = useState("");

    const [averageMark, setAverageMark] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<string | null>(null);

    const { data: session } = useSession();

    const filterDepartmentCodes = (course: string): string[] => {
        let values: string[] = [];
        if (course !== "") {
            const allowed = course.split(' ')[0];
            values = depts.filter(code => allowed.includes(code));
            if (values.length == 1) {
                values = [];
            }
        }
        values.push("ALL");
        return values;
    };

    const parseGradingData = (input: string): string => {
        const lines = input.split('\n').map(line => line.trim());
        const gradeData: GradeRow[] = [];
        const rowPattern = /^Row\s*\d+$/;

        for (let i = 0; i < lines.length; i++) {
            if (rowPattern.test(lines[i])) {
                const dataLines = lines.slice(i + 1, i + 5).filter(line => line.length > 0);

                const gradeRow: GradeRow = {
                    grade: '',
                    numberOfStudents: 0
                };

                gradeRow.grade = dataLines[0];

                if (dataLines[1]) {
                    gradeRow.numberOfStudents = parseInt(dataLines[1], 10) || 0;
                }

                if (dataLines[2]) {
                    const minMarks = parseFloat(dataLines[2]);
                    if (!isNaN(minMarks)) {
                        if (dataLines.length === 3) {
                            gradeRow.maxMarks = minMarks;
                        } else {
                            gradeRow.minMarks = minMarks;
                        }
                    }
                }

                if (dataLines[3]) {
                    const maxMarks = parseFloat(dataLines[3]);
                    if (!isNaN(maxMarks)) {
                        gradeRow.maxMarks = maxMarks;
                    }
                }

                gradeData.push(gradeRow);
            }
        }

        const headers = ['Grade', 'Number of Students', 'Min Marks', 'Max Marks'];
        const rows = gradeData.map(row => [
            row.grade,
            row.numberOfStudents.toString(),
            row.minMarks?.toString() ?? '',
            row.maxMarks?.toString() ?? ''
        ]);

        const csvLines = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ];

        if (csvLines.length === 1) {
            toast.error("Could not parse properly!")
            return '';
        }

        return csvLines.join('\n');
    };

    const handleNext = () => {
        if (course === "") {
            toast.error("Please fill course!");
            return;
        }
        if (dept === "") {
            toast.error("Please fill department! (If grading is not separate for different branches, please select 'ALL')");
            return;
        }
        if (prof === "") {
            toast.error("Please fill professor!");
            return;
        }
        if (semester === "") {
            toast.error("Please fill semester!");
            return;
        }
        if (gradingData === "") {
            toast.error("Please fill grading data!");
            return;
        }

        if (!courses.includes(course)) {
            toast.error("Please select a course from the given list!");
            return;
        }
        if (!profs.includes(prof)) {
            toast.error("Please select a professor from the given list!");
            return;
        }
        if (dept !== "ALL" && (!depts.includes(dept) || !course.split(' ')[0].includes(dept))) {
            toast.error("Please select a valid department for the course, or choose 'ALL'!");
            return;
        }

        const parsed = parseGradingData(gradingData);
        setParsedData(parsed);
    };

    const handleSubmit = async () => {
        if (!parsedData || parsedData.trim() === "") {
            toast.error("Please ensure the grading data is not empty!");
            return;
        }

        try {
            const response = await fetch("/api/courses/grading/add", {
                method: "POST",
                body: JSON.stringify({
                    course: course,
                    dept: dept,
                    prof: prof,
                    sem: semester,
                    data: parsedData,
                    created_by: session?.user?.email,
                    average_mark: parseFloat(averageMark ?? "0")
                }),
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();
            if (result.error) {
                toast.error(result.message);
            } else {
                toast.success("Grading data added successfully! Thank you!");

                setCourse("");
                setDept("");
                setAverageMark(null);
                setProf("");
                setSemester("");
                setGradingData("");
                setParsedData(null);

                localStorage.removeItem("h4u_grading_course");
                localStorage.removeItem("h4u_grading_prof");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the data");
        }
    };

    const handleBack = () => {
        setParsedData(null);
    };

    useEffect(() => {
        if (localStorage.getItem("h4u_grading_course")) {
            setCourse(localStorage.getItem("h4u_grading_course")!);
        }
        if (localStorage.getItem("h4u_grading_prof")) {
            setProf(localStorage.getItem("h4u_grading_prof")!);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Course Grading.</title>
                <meta name="description" content="Add course grading information" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Course Grading.
                    </h1>

                    <Menu />

                    {session && (
                        <>
                            {parsedData === null ? (
                                <>
                                    <AutoCompleter
                                        name={"Course"}
                                        items={courses}
                                        value={course}
                                        onChange={(val) => setCourse(val)}
                                    />

                                    <span className="m-2"></span>

                                    <AutoCompleter
                                        name={"Prof"}
                                        items={profs}
                                        value={prof}
                                        onChange={(val) => setProf(val)}
                                    />

                                    <span className="m-2"></span>

                                    <div className="w-full max-w-xl">
                                        <div className="flex flex-col md:flex-row md:gap-4">
                                            <div className="w-full md:w-1/2">
                                                <AutoCompleter
                                                    name={"Semester"}
                                                    items={gradedSemesters}
                                                    value={semester}
                                                    onChange={(val) => setSemester(val)}
                                                />
                                            </div>
                                            <div className="mt-2 md:mt-0 w-full md:w-1/2">
                                                <AutoCompleter
                                                    name={"Department"}
                                                    items={filterDepartmentCodes(course)}
                                                    value={dept}
                                                    onChange={(val) => setDept(val)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center w-full m-2 h-60">
                                        <textarea
                                            className="textarea w-full max-w-xl h-56"
                                            placeholder="Enter grading data... (Copy paste the grade analysis table from ERP, your text should have the lines Row1, then the data and so on)"
                                            value={gradingData}
                                            onChange={(e) => setGradingData(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="w-full max-w-xl">
                                        <input
                                            type="text"
                                            className="input input-secondary w-full"
                                            value={averageMark || ""}
                                            onChange={(e) => setAverageMark(e.target.value)}
                                            placeholder={`Please enter the average marks...`}
                                            tabIndex={0}
                                        />
                                    </div>

                                    <div className="text-center flex-wrap w-3/4 justify-between m-2">
                                        <button className="btn btn-primary" onClick={handleNext}>
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Edit State
                                <div className="w-full max-w-xl space-y-4">
                                    <div className="text-lg">
                                        <span className="font-bold">Course:</span> {course}
                                    </div>
                                    <div className="text-lg">
                                        <span className="font-bold">Professor:</span> {prof}
                                    </div>
                                    <div className="text-lg">
                                        <span className="font-bold">Semester:</span> {semester}
                                    </div>
                                    <div className="text-lg">
                                        <span className="font-bold">Department:</span> {dept}
                                    </div>

                                    <textarea
                                        className="textarea textarea-primary w-full h-60"
                                        value={parsedData}
                                        onChange={(e) => setParsedData(e.target.value)}
                                    ></textarea>

                                    <div className="flex justify-center space-x-4">
                                        <button className="btn btn-outline" onClick={handleBack}>
                                            Back
                                        </button>
                                        <button className="btn btn-primary" onClick={handleSubmit}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CustomToastContainer containerId="addGrading" />
        </>
    );
}
