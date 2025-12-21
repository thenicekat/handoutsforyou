import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import MonetagAd from '@/components/MonetagAd'
import CustomToastContainer from '@/components/ToastContainer'
import { courses as courseNames } from '@/config/courses'
import { getMetaConfig } from '@/config/meta'
import { pyqYears } from '@/config/years_sems'
import axiosInstance from '@/utils/axiosCache'
import { googleDriveService } from '@/utils/googleDrive'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const HandoutsPerYear = dynamic(() => import('@/components/HandoutsPerYear'), {
    loading: () => (
        <div className="grid place-items-center">
            <p className="text-lg m-3">Loading...</p>
        </div>
    ),
})

export const getStaticProps: GetStaticProps = async () => {
    try {
        const handoutsFolderId = process.env.GOOGLE_DRIVE_HANDOUTS_FOLDER_ID
        if (!handoutsFolderId) {
            throw new Error(
                'GOOGLE_DRIVE_HANDOUTS_FOLDER_ID environment variable is not set'
            )
        }

        const handoutsMap =
            await googleDriveService.getHandouts(handoutsFolderId)

        return {
            props: {
                handoutsMap,
            },
            revalidate: 24 * 60 * 60, // Regenerate list of handouts every 24 hours.
        }
    } catch (error) {
        console.error('Error fetching handouts:', error)
        return {
            props: {
                handoutsMap: {},
                error: 'Failed to fetch handouts from Google Drive',
            },
            revalidate: 300, // Try again in 5 minutes on error.
        }
    }
}

export default function Handouts({
    handoutsMap,
    error,
}: {
    handoutsMap: { [key: string]: any[] }
    error?: string
}) {
    const [search, setSearch] = useState('')
    const [actualSearch, setActualSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const [showUploadForm, setShowUploadForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadCourse, setUploadCourse] = useState('')
    const [uploadSemester, setUploadSemester] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const filterHandouts = async () => {
        setIsLoading(true)
        await axiosInstance.get('/api/auth/check')
        setActualSearch(search)
        setIsLoading(false)
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!uploadCourse || !uploadSemester || !selectedFile) {
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
            formData.append('semester', uploadSemester)
            formData.append('file', selectedFile)

            const response = await fetch('/api/courses/handouts/add', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!data.error) {
                toast.success('Handout uploaded successfully!')
                setShowUploadForm(false)
                setUploadCourse('')
                setUploadSemester('')
                setSelectedFile(null)
                window.location.reload()
            } else {
                toast.error(data.message || 'Failed to upload handout')
            }
        } catch (error) {
            toast.error('Error uploading handout: ' + error)
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

    useEffect(() => {
        filterHandouts()
    }, [])

    if (error) {
        return (
            <div className="grid place-items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-red-500 mb-4">
                        Error Loading Handouts
                    </h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Meta {...getMetaConfig('courses/handouts')} />

            <MonetagAd
                adFormat="interstitial-banner"
                id="monetag-interstitial-banner-inline-handouts"
            />

            {showUploadForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-2xl font-bold mb-4">
                            Upload Handout
                        </h2>
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
                                    Semester
                                </label>
                                <AutoCompleter
                                    items={pyqYears}
                                    value={uploadSemester}
                                    onChange={setUploadSemester}
                                    name="semester"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    File
                                </label>
                                <input
                                    type="file"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={e =>
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

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Handouts.
                    </h1>
                    <Menu />
                    <>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-secondary w-full max-w-xs"
                            onChange={e => setSearch(e.target.value)}
                        />
                        <div className="flex flex-col md:flex-row gap-3 m-3 w-full max-w-xs">
                            <button
                                className="btn btn-outline flex-1"
                                onClick={filterHandouts}
                            >
                                Filter Handouts
                            </button>
                            <button
                                className="btn btn-outline flex-1"
                                onClick={() => setShowUploadForm(true)}
                            >
                                Upload Handout
                            </button>
                        </div>
                    </>
                </div>
            </div>

            {!isLoading && (
                <div className="px-2 md:px-20">
                    {Object.keys(handoutsMap)
                        .reverse()
                        .map((handoutMap: string) => {
                            return (
                                <>
                                    <HandoutsPerYear
                                        handouts={handoutsMap[handoutMap]}
                                        semester={handoutMap}
                                        key={handoutMap}
                                        searchWord={actualSearch}
                                    />
                                    <hr />
                                </>
                            )
                        })}
                </div>
            )}

            {isLoading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}

            <CustomToastContainer containerId="courseHandouts" />
        </>
    )
}
