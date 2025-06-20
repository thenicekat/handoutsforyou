import Head from 'next/head'
import { useState, useEffect } from 'react'
import Menu from '@/components/Menu'
import { courses } from '@/data/courses'
import { profs } from '@/data/profs'
import AutoCompleter from '@/components/AutoCompleter'
import CustomToastContainter from '@/components/ToastContainer'
import { toast } from 'react-toastify'

export default function AddReview() {
    const [course, setCourse] = useState('')
    const [prof, setProf] = useState('')

    const [review, setReview] = useState('')

    const AddReview = async () => {
        if (course == '') {
            toast.error('Please fill course!')
            return
        }
        if (prof == '') {
            toast.error('Please fill professor!')
            return
        }
        if (review == '') {
            toast.error('Please fill review!')
            return
        }

        if (courses.includes(course) == false) {
            toast.error('Please select a course from the given list!')
            return
        }
        if (profs.map((p) => p.name).includes(prof) == false) {
            toast.error('Please select a professor from the given list!')
            return
        }

        const data = await fetch('/api/courses/reviews/add', {
            method: 'POST',
            body: JSON.stringify({
                course: course,
                prof: prof,
                review: review,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        } else {
            toast.success('Thank you! Your review was added successfully!')
            setCourse('')
            setProf('')
            setReview('')
            if (localStorage.getItem('h4u_course')) {
                localStorage.removeItem('h4u_course')
            }
            if (localStorage.getItem('h4u_prof')) {
                localStorage.removeItem('h4u_prof')
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('h4u_course')) {
            setCourse(localStorage.getItem('h4u_course')!)
        }
        if (localStorage.getItem('h4u_prof')) {
            setProf(localStorage.getItem('h4u_prof')!)
        }
    }, [])

    return (
        <>
            <Head>
                <title>Course Reviews.</title>
                <meta
                    name="description"
                    content="One stop place for your PS queries, handouts, and much more"
                />
                <meta
                    name="keywords"
                    content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Course Reviews.
                    </h1>

                    <Menu />

                    <>
                        <AutoCompleter
                            name={'Course'}
                            items={courses}
                            value={course}
                            onChange={(val) => setCourse(val)}
                        />
                        <span className="m-2"></span>
                        <AutoCompleter
                            name={'Prof'}
                            items={profs.map((p) => p.name)}
                            value={prof}
                            onChange={(val) => setProf(val)}
                        />

                        <div className="text-center w-full m-2 h-60">
                            <textarea
                                className="textarea textarea-primary w-full max-w-xl h-full"
                                placeholder="Enter your Review..."
                                onChange={(e) => setReview(e.target.value)}
                                value={review}
                            ></textarea>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button
                                className="btn btn-primary"
                                onClick={AddReview}
                            >
                                Add Review
                            </button>
                        </div>
                    </>
                </div>
            </div>

            <CustomToastContainter containerId="addReview" />
        </>
    )
}
