import Head from "next/head";
import { useState } from "react";
import Menu from "../../Components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { supabase } from '../api/supabase';
import { CourseReview } from "../../types/CourseReview";
import { courses } from "../../data/courses";
import { profs } from "../../data/profs";
import AutoCompleter from "../../Components/AutoCompleter";

export default function Reviews({ }: {}) {
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");

    const [reviews, setReviews] = useState([] as CourseReview[]);

    const { data: session } = useSession()

    const fetchReviews = async () => {
        if (course == "" && prof == "") {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
            if (error) console.log(error)
            else {
                setReviews(data)
            }
        }
        else if (course == "") {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('prof', prof)

            if (error) console.log(error)
            else {
                setReviews(data)
            }
        }
        else if (prof == "") {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('course', course)

            if (error) console.log(error)
            else {
                setReviews(data)
            }
        }
        else {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('course', course)
                .eq('prof', prof)

            if (error) console.log(error)
            else {
                setReviews(data)
            }
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
                        <AutoCompleter name={"Course"} items={courses} value={course} onChange={(val) => setCourse(val)} />
                        <span className="m-2"></span>
                        <AutoCompleter name={"Prof"} items={profs} value={prof} onChange={(val) => setProf(val)} />


                        <Link className="m-3" href={"/courses/addreview"}>
                            <button className="btn btn-outline w-full">
                                Add a Review
                            </button>
                        </Link>

                        <Link className="m-3" href={"#"}>
                            <button className="btn btn-outline w-full" onClick={fetchReviews}>
                                Fetch Reviews
                            </button>
                        </Link>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    <div className='px-2 md:px-20'>
                        {
                            reviews.length > 0 ? reviews.map((review) => (
                                <div className="card shadow-lg compact bg-base-100 text-base-content mt-5" key={review.id}>
                                    <div className="card-body">
                                        <h2 className="card-title text-center">Course Name: {review.course} by Professor: {review.prof}</h2>
                                        <p>{review.review}</p>
                                    </div>
                                </div>
                            )) :
                                <div className="card shadow-lg compact bg-base-100 text-base-content mt-5">
                                    <div className="card-body">
                                        <h2 className="card-title text-center">
                                            Please enter criteria! Supports only prof based search and only course based search as well.
                                            If you see this message even after entering criteria, it means that there are no reviews for the entered criteria
                                        </h2>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}