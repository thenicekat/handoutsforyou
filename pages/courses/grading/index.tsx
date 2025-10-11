import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { courses } from '@/config/courses'
import { getMetaConfig } from '@/config/meta'
import { profs } from '@/config/profs'
import { CourseGrading } from '@/types/Courses'
import { MONETAG_INPAGE_PUSH_CORE, MONETAG_INPAGE_PUSH_LOADER, MONETAG_VIGNETTE_BANNER_CORE, MONETAG_VIGNETTE_BANNER_LOADER } from '@/utils/monetagExtraInline'
import { axiosInstance } from '@/utils/axiosCache'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface GradingBySemester {
    [key: string]: CourseGrading[]
}

export default function Grading() {
    const [course, setCourse] = useState('')
    const [prof, setProf] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [gradings, setGradings] = useState<GradingBySemester>({})

    const parseCSVToTable = (csv: string) => {
        const rows = csv.trim().split('\n')
        const headers = rows[0].split(',')
        const data = rows.slice(1)

        return (
            <div className="">
                <table className="table table-fixed w-full table-zebra">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    className={'break-normal text-pretty'}
                                    key={index}
                                >
                                    {header}
                                </th>
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
        )
    }

    const fetchGradings = async () => {
        if (courses.includes(course) === false && course !== '') {
            toast.error('Please select a course from the given list!')
            return
        }
        if (profs.map((p) => p.name).includes(prof) === false && prof !== '') {
            toast.error('Please select a professor from the given list!')
            return
        }
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/courses/grading/get', {
                course: course,
                prof: prof,
            })

            if (res.status !== 400) {
                const response = res.data
                if (response.error && response.status !== 400) {
                    toast.error(response.message)
                } else {
                    const gradingBySemester: GradingBySemester = {}
                    response.data.forEach((grading: CourseGrading) => {
                        if (!gradingBySemester[grading.sem]) {
                            gradingBySemester[grading.sem] = []
                        }
                        gradingBySemester[grading.sem].push(grading)
                    })
                    setGradings(gradingBySemester)
                }
            }
        } catch (error) {
            toast.error('Failed to fetch grading data')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchGradings()
    }, [])

    useEffect(() => {
        localStorage.setItem('h4u_grading_course', course)
        localStorage.setItem('h4u_grading_prof', prof)
    }, [course, prof])

    return (
        <>
            <Meta {...getMetaConfig('courses/grading')} />

            {MONETAG_INPAGE_PUSH_CORE && (
                <Script
                    id="monetag-inpage-push-core-grading"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_CORE,
                    }}
                />
            )}

            {MONETAG_INPAGE_PUSH_LOADER && (
                <Script
                    id="monetag-inpage-push-grading"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_LOADER,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_CORE && (
                <Script
                    id="monetag-vignette-core-grading"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_CORE,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_LOADER && (
                <Script
                    id="monetag-vignette-grading"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_LOADER,
                    }}
                />
            )}

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Course Grading.
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
                            name={'Professor'}
                            items={profs.map((p) => p.name)}
                            value={prof}
                            onChange={(val) => setProf(val)}
                        />

                        <p className="text-center p-2 m-2">
                            This is a list of all the courses and their midsem
                            grading. P.S. You can choose the prof/course you
                            want to filter for.
                        </p>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link
                                className="m-3 w-full hidden md:block"
                                href={'/courses/grading/add'}
                            >
                                <button className="btn btn-outline w-full">
                                    Add Grading
                                </button>
                            </Link>

                            <Link className="m-3 w-full" href={''}>
                                <button
                                    className="btn btn-outline w-full"
                                    onClick={fetchGradings}
                                >
                                    Filter Grading
                                </button>
                            </Link>
                        </div>
                    </>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 md:px-20 p-4">
                {isLoading ? (
                    <div className="grid place-items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-lg mt-4">Loading...</p>
                    </div>
                ) : (
                    <>
                        {Object.keys(gradings)
                            .sort((a, b) => b.localeCompare(a))
                            .map((sem) => (
                                <div
                                    key={course + prof + sem}
                                    className="mb-4 w-full"
                                >
                                    <div className="collapse collapse-plus w-full">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-lg md:text-2xl font-medium">
                                            {sem} ({gradings[sem].length}{' '}
                                            entries)
                                        </div>
                                        <div className="collapse-content w-full overflow-x-auto">
                                            {gradings[sem].map((grading) => (
                                                <div
                                                    className="card bg-base-100 shadow-xl mb-4 w-full"
                                                    key={grading.id}
                                                >
                                                    <div className="card-body">
                                                        <h2 className="card-title text-center md:text-left text-base sm:text-lg md:text-lg break-words">
                                                            {grading.course} -
                                                            Prof. {grading.prof}
                                                        </h2>
                                                        {grading.dept !==
                                                            'ALL' && (
                                                            <p className="text-sm text-gray-500">
                                                                For the branch:{' '}
                                                                {grading.dept}
                                                            </p>
                                                        )}
                                                        <div className="-mx-4 sm:-mx-6 md:-mx-8">
                                                            <div className="min-w-min px-4 sm:px-6 md:px-8">
                                                                {parseCSVToTable(
                                                                    grading.data
                                                                )}
                                                            </div>
                                                            <p className="text-center p-2 m-2">
                                                                The average mark
                                                                for this course
                                                                was:{' '}
                                                                {grading.average_mark ||
                                                                    'N/A'}
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
            <CustomToastContainer containerId="courseGrading" />
        </>
    )
}
