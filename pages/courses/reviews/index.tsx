import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "../../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CourseReview } from "../../../types/CourseReview";
import { courses } from "./data/courses";
import { profs } from "./data/profs";
import AutoCompleter from "../../../Components/AutoCompleter";
import { departments } from "./data/departments";

export default function Reviews({ }: {}) {
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [dept, setDept] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [reviews, setReviews] = useState([] as CourseReview[]);

    const { data: session } = useSession()

    const fetchReviews = async () => {
        setIsLoading(true)
        const data = await fetch("/api/reviews/get", {
            method: "POST",
            body: JSON.stringify({ course: course, prof: prof }),
            headers: { "Content-Type": "application/json" }
        })
        const reviews = await data.json()
        setReviews(reviews.data as CourseReview[])
        setIsLoading(false)
        filterByDept(departments[dept])
    }

    const filterByDept = (dept: string) => {
        if (dept === "" || dept === undefined) return;
        let deptsToCheck = dept.split("/").map((d) => d.trim())
        let filteredReviews = new Set();
        reviews.forEach((review) => {
            deptsToCheck.forEach((d) => {
                if (review.course.split(" ")[0].includes(d)) filteredReviews.add(review)
            })
        })
        setReviews(Array.from(filteredReviews) as CourseReview[])
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    useEffect(() => {
        localStorage.setItem("h4u_course", course)
        localStorage.setItem("h4u_prof", prof)
    })

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

                    <Menu />

                    {session && <>
                        <AutoCompleter name={"Course"} items={courses} value={course} onChange={(val) => setCourse(val)} />
                        <span className="m-2"></span>
                        <AutoCompleter name={"Prof"} items={profs} value={prof} onChange={(val) => setProf(val)} />
                        <span className="m-2"></span>
                        <AutoCompleter name={"Department"} items={Object.keys(departments)} value={dept} onChange={(val) => {
                            setDept(val)
                        }} />

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="m-3 w-full" href={"/courses/reviews/add"}>
                                <button className="btn btn-outline w-full">
                                    Add a Review
                                </button>
                            </Link>

                            <Link className="m-3 w-full" href={""}>
                                <button className="btn btn-outline w-full" onClick={fetchReviews}>
                                    Filter Reviews
                                </button>
                            </Link>
                        </div>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Reviews: {reviews.length}</h1>
                    </div>

                    <div className='px-2 md:px-20 p-2'>
                        {
                            !isLoading ?
                                reviews
                                    .sort((a, b) => {
                                        if (a.course > b.course) return 1
                                        else if (a.course < b.course) return -1
                                        else return 0
                                    })
                                    .map((review) => (
                                        <div className="card shadow-lg bg-base-100 text-base-content mt-5" key={review.created_at}>
                                            <div className="card-body">
                                                <h2 className="card-title text-center">Course Name: {review.course} by Professor: {review.prof}</h2>
                                                <p>{review.review}</p>
                                                <p className="italic">Submitted at: {new Date(review.created_at).toLocaleString("en-IN", {})}</p>
                                            </div>
                                        </div>
                                    )) :
                                <div className="flex justify-center">
                                    <h1 className="text-3xl text-primary">Loading...</h1>
                                </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}