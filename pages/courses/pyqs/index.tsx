import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'

import CustomToastContainer from '@/components/ToastContainer'
import { courses as courseNames } from '@/config/courses'
import { getMetaConfig } from '@/config/meta'
import { profs } from '@/config/profs'
import { pyqYears } from '@/config/years_sems'
import { CourseDetails, CoursePYQFile, CoursePYQsByYear } from '@/types/Courses'
import axiosInstance from '@/utils/axiosCache'
import {
    MONETAG_INPAGE_PUSH_CORE,
    MONETAG_INPAGE_PUSH_LOADER,
    MONETAG_VIGNETTE_BANNER_CORE,
    MONETAG_VIGNETTE_BANNER_LOADER,
} from '@/utils/monetagExtraInline'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function PYQs() {
    const [courses, setCourses] = useState<CourseDetails[]>([])
    const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(
        null
    )
    const [pyqsByYear, setPyqsByYear] = useState<CoursePYQsByYear>({})

    const [loading, setLoading] = useState(true)
    const [loadingPyqs, setLoadingPyqs] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [showUploadForm, setShowUploadForm] = useState(false)
    const [uploadCourse, setUploadCourse] = useState('')
    const [uploadYear, setUploadYear] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadProfessor, setUploadProfessor] = useState('')

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const response = await axiosInstance.get(
                '/api/courses/pyqs/get/courses'
            )

            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                setCourses(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
            toast.error('Error fetching courses')
        } finally {
            setLoading(false)
        }
    }

    const fetchPYQsForCourse = async (course: CourseDetails) => {
        setLoadingPyqs(true)
        try {
            const response = await axiosInstance.get(
                `/api/courses/pyqs/get/pyqs?courseId=${course.id}`
            )

            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                setPyqsByYear(response.data.data)
                setSelectedCourse(course)
            }
        } catch (error) {
            toast.error('Error fetching PYQs for course')
        } finally {
            setLoadingPyqs(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!uploadCourse || !uploadYear || !uploadProfessor || !selectedFile) {
            toast.error('Please fill all fields')
            return
        }
        if (!validateFile(selectedFile)) {
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('course', uploadCourse)
            formData.append('year', uploadYear)
            formData.append('professor', uploadProfessor)
            formData.append('file', selectedFile)

            const response = await fetch('/api/courses/pyqs/add', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!data.error) {
                toast.success('PYQ uploaded successfully!')
                setShowUploadForm(false)
                setUploadCourse('')
                setUploadYear('')
                setUploadProfessor('')
                setSelectedFile(null)
                fetchCourses()
            } else {
                toast.error(data.message || 'Failed to upload PYQ')
            }
        } catch (error) {
            toast.error('Error uploading PYQ: ' + error)
        } finally {
            setUploading(false)
        }
    }

    const validateFile = (file: File) => {
        const allowedExtensions = ['pdf', 'docx', 'doc']
        const extension = file.name.split('.').pop()
        if (
            !extension ||
            !allowedExtensions.includes(extension.toLowerCase())
        ) {
            toast.error('Please upload: ' + allowedExtensions.join(', '))
            return false
        }
        return true
    }

    const formatFileSize = (bytes: string | number) => {
        const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes
        if (numBytes === 0 || isNaN(numBytes)) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(numBytes) / Math.log(k))
        return (
            parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('courses/pyqs')} />

            {MONETAG_INPAGE_PUSH_CORE && (
                <Script
                    id="monetag-inpage-push-core-pyqs"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_CORE,
                    }}
                />
            )}

            {MONETAG_INPAGE_PUSH_LOADER && (
                <Script
                    id="monetag-inpage-push-pyqs"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INPAGE_PUSH_LOADER,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_CORE && (
                <Script
                    id="monetag-vignette-core-pyqs"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_CORE,
                    }}
                />
            )}

            {MONETAG_VIGNETTE_BANNER_LOADER && (
                <Script
                    id="monetag-vignette-pyqs"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_VIGNETTE_BANNER_LOADER,
                    }}
                />
            )}

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        PYQs.
                    </h1>
                    <Menu />
                </div>
            </div>

            {showUploadForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-2xl font-bold mb-4">Upload PYQ</h2>
                        <form onSubmit={handleUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Course Name
                                </label>
                                <AutoCompleter
                                    items={courseNames}
                                    value={uploadCourse}
                                    onChange={setUploadCourse}
                                    name="course"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Professor Name
                                </label>
                                <AutoCompleter
                                    items={profs.map((prof) => prof.name)}
                                    value={uploadProfessor}
                                    onChange={setUploadProfessor}
                                    name="professor"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Year
                                </label>
                                <AutoCompleter
                                    items={pyqYears}
                                    value={uploadYear}
                                    onChange={setUploadYear}
                                    name="year"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    File
                                </label>
                                <input
                                    type="file"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) =>
                                        setSelectedFile(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowUploadForm(false)}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* PYQs Content */}
            <div className="px-2 md:px-20">
                <div className="grid place-items-center text-lg p-10">
                    <p className="mb-6">
                        Previous year question papers organized by course and
                        year. You can view PDFs online or download them for
                        offline access.
                    </p>

                    <div className="flex-col block md:flex-row md:w-1/3 w-full justify-center m-3">
                        <button
                            className="btn btn-outline w-full mb-3"
                            onClick={() => setShowUploadForm(true)}
                        >
                            Upload PYQ
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        {!selectedCourse ? (
                            // Show courses list
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-center">
                                    Select a Course
                                </h3>
                                {courses.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-gray-500">
                                            No courses available yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {courses.map((course) => (
                                            <div
                                                key={course.id}
                                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                            >
                                                <div
                                                    className="card-body"
                                                    onClick={() =>
                                                        fetchPYQsForCourse(
                                                            course
                                                        )
                                                    }
                                                >
                                                    <h2 className="card-title text-primary">
                                                        {course.name}
                                                    </h2>
                                                    <p className="text-sm text-gray-500">
                                                        Created:{' '}
                                                        {new Date(
                                                            course.createdTime
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <div className="card-actions justify-end">
                                                        <button className="btn btn-sm btn-primary">
                                                            View PYQs
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Show PYQs for selected course
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        PYQs for {selectedCourse.name}
                                    </h3>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setSelectedCourse(null)
                                            setPyqsByYear({})
                                        }}
                                    >
                                        ← Back to Courses
                                    </button>
                                </div>
                                {loadingPyqs ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="loading loading-spinner loading-lg"></div>
                                    </div>
                                ) : Object.keys(pyqsByYear).length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-gray-500">
                                            No PYQs available for this course
                                            yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(pyqsByYear).map(
                                            ([year, files]) => (
                                                <div
                                                    key={year}
                                                    className="card bg-base-100 shadow-lg"
                                                >
                                                    <div className="card-body">
                                                        <h4 className="card-title text-xl text-primary mb-4">
                                                            {year}
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {files.map(
                                                                (
                                                                    file: CoursePYQFile
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            file.id
                                                                        }
                                                                        className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                                                                    >
                                                                        <div className="flex-1">
                                                                            <p className="font-medium">
                                                                                {
                                                                                    file.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {file.size &&
                                                                                    formatFileSize(
                                                                                        file.size
                                                                                    )}{' '}
                                                                                •{' '}
                                                                                {new Date(
                                                                                    file.createdTime
                                                                                ).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                        <div className="card-actions">
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => {
                                                                                    const link =
                                                                                        document.createElement(
                                                                                            'a'
                                                                                        )
                                                                                    link.href =
                                                                                        file.downloadUrl
                                                                                    link.download =
                                                                                        file.name
                                                                                    link.click()
                                                                                }}
                                                                            >
                                                                                Download
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <CustomToastContainer containerId="coursePyqs" />
        </>
    )
}
