import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'

import CustomToastContainer from '@/components/ToastContainer'
import { courses } from '@/config/courses'
import { departments } from '@/config/departments'
import { getMetaConfig } from '@/config/meta'
import { profs } from '@/config/profs'
import { CourseReview } from '@/types/Courses'
import { axiosInstance } from '@/utils/axiosCache'
import {
    MONETAG_INPAGE_PUSH_CORE,
    MONETAG_INPAGE_PUSH_LOADER,
    MONETAG_VIGNETTE_BANNER_CORE,
    MONETAG_VIGNETTE_BANNER_LOADER,
} from '@/utils/monetagExtraInline'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Reviews() {
    const [course, setCourse] = useState('')
    const [prof, setProf] = useState('')
    const [dept, setDept] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [reviews, setReviews] = useState([] as CourseReview[])

    const fetchReviews = async () => {
        if (courses.includes(course) == false && course !== '') {
            toast.error('Please select a course from the given list!')
            return
        }
        if (profs.map((p) => p.name).includes(prof) == false && prof !== '') {
            toast.error('Please select a professor from the given list!')
            return
        }
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/courses/reviews/get', {
                course: course,
                prof: prof,
            })
            if (res.status !== 400) {
                const reviews = res.data
                if (reviews.error && reviews.status !== 400) {
                    toast.error(reviews.message)
                } else {
                    setReviews(
                        filterByDept(
                            reviews.data as CourseReview[],
                            departments[dept]
                        )
                    )
                }
            }
        } catch (error) {
            console.error('Error fetching course reviews:', error)
            toast.error('Failed to fetch reviews')
        } finally {
            setIsLoading(false)
        }
    }

    const filterByDept = (
        courseReviews: CourseReview[],
        department: string
    ): CourseReview[] => {
        if (department === '' || department === undefined) return courseReviews
        let departmentsToCheck = department.split('/').map((d) => d.trim())
        let filteredReviews = new Set()
        courseReviews.forEach((review) => {
            departmentsToCheck.forEach((d: string) => {
                if (review.course.split(' ')[0].includes(d))
                    filteredReviews.add(review)
            })
        })
        return Array.from(filteredReviews) as CourseReview[]
    }

    useEffect(() => {
        async function checkAuth() {
            await axiosInstance.get('/api/auth/check')
        }
        checkAuth()
    }, [])

    useEffect(() => {
        localStorage.setItem('h4u_course', course)
        localStorage.setItem('h4u_prof', prof)
    }, [course, prof])

    return (
        <>
            <Meta {...getMetaConfig('courses/reviews')} />

            {MONETAG_INPAGE_PUSH_CORE && (
                <Script
                    id="monetag-inpage-push-core-reviews"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_CORE,
                    }}
                />
            )}

            {MONETAG_INPAGE_PUSH_LOADER && (
                <Script
                    id="monetag-inpage-push-reviews"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_LOADER,
                    }}
                />
            )}


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
                        <span className="m-2"></span>
                        <AutoCompleter
                            name={'Department'}
                            items={Object.keys(departments)}
                            value={dept}
                            onChange={(val) => {
                                setDept(val)
                            }}
                        />

                        <p className="text-center p-2 m-2">
                            Start by selecting a course and professor.
                        </p>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link
                                className="m-3 w-full hidden md:block"
                                href={'/courses/reviews/add'}
                            >
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Add a Review
                                </button>
                            </Link>

                            <Link className="m-3 w-full" href={''}>
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                    onClick={fetchReviews}
                                >
                                    Fetch Reviews
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link
                                className="m-3 w-full"
                                href={'/courses/reviews/add'}
                            >
                                <PlusCircleIcon />
                            </Link>
                        </div>
                    </>
                </div>
            </div>
            <div>
                <div className="flex justify-center">
                    <h1 className="text-3xl text-primary">
                        {reviews.length > 0 &&
                            `Total Reviews: ${reviews.length}`}
                    </h1>
                </div>

                <div className="px-2 md:px-20 p-2">
                    {!isLoading ? (
                        reviews
                            .sort((a, b) => {
                                if (a.course > b.course) return 1
                                else if (a.course < b.course) return -1
                                else return 0
                            })
                            .map((review) => (
                                <div
                                    className="card shadow-lg bg-base-100 break-words text-base-content mt-5"
                                    key={review.created_at}
                                >
                                    <div className="card-body">
                                        <h2 className="card-title text-center text-lg">
                                            Course Name: {review.course} by
                                            Professor: {review.prof}
                                        </h2>
                                        <p className="text-sm">
                                            {review.review}
                                        </p>
                                        <p className="italic">
                                            Submitted at:{' '}
                                            {new Date(
                                                review.created_at
                                            ).toLocaleString('en-IN', {})}
                                        </p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="grid place-items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            <p className="text-lg mt-4">Loading reviews...</p>
                        </div>
                    )}
                </div>
            </div>
            <CustomToastContainer containerId="courseReviews" />
        </>
    )
}
