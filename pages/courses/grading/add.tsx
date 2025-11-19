import { departments } from '@/config/departments'
import { getMetaConfig } from '@/config/meta'
import CourseGradingForm, {
    CourseGradingFormData,
} from '@/forms/CourseGradingForm'
import AddPageLayout from '@/layout/AddPage'
import { CourseGradeRow } from '@/types/Courses'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const getStaticProps: GetStaticProps = async () => {
    const depts: string[] = Object.values(departments)
        .flatMap((code: string) => code.split('/'))
        .map((code) => code.trim())
        .filter((code) => code.length > 0)

    return {
        props: {
            depts,
        },
    }
}

export default function AddGrading({ depts }: { depts: string[] }) {
    const [formData, setFormData] = useState<CourseGradingFormData | null>(null)
    const [parsedData, setParsedData] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [defaultValues, setDefaultValues] = useState<
        Partial<CourseGradingFormData>
    >({})

    const filterDepartmentCodes = (course: string): string[] => {
        let values: string[] = []
        if (course !== '') {
            const allowed = course.split(' ')[0]
            values = depts.filter((code) => allowed.includes(code))
            if (values.length == 1) {
                values = []
            }
        }
        values.push('ALL')
        return values
    }

    const parseGradingData = (input: string): string => {
        const lines = input.split('\n').map((line) => line.trim())
        const gradeData: CourseGradeRow[] = []
        const rowPattern = /^Row\s*\d+$/

        for (let i = 0; i < lines.length; i++) {
            if (rowPattern.test(lines[i])) {
                const dataLines = lines
                    .slice(i + 1, i + 5)
                    .filter((line) => line.length > 0)

                const gradeRow: CourseGradeRow = {
                    grade: '',
                    numberOfStudents: 0,
                }

                gradeRow.grade = dataLines[0]

                if (dataLines[1]) {
                    gradeRow.numberOfStudents = parseInt(dataLines[1], 10) || 0
                }

                if (dataLines[2]) {
                    const minMarks = parseFloat(dataLines[2])
                    if (!isNaN(minMarks)) {
                        if (dataLines.length === 3) {
                            gradeRow.maxMarks = minMarks
                        } else {
                            gradeRow.minMarks = minMarks
                        }
                    }
                }

                if (dataLines[3]) {
                    const maxMarks = parseFloat(dataLines[3])
                    if (!isNaN(maxMarks)) {
                        gradeRow.maxMarks = maxMarks
                    }
                }

                gradeData.push(gradeRow)
            }
        }

        const headers = [
            'Grade',
            'Number of Students',
            'Min Marks',
            'Max Marks',
        ]
        const rows = gradeData.map((row) => [
            row.grade,
            row.numberOfStudents.toString(),
            row.minMarks?.toString() ?? '',
            row.maxMarks?.toString() ?? '',
        ])

        const csvLines = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ]

        if (csvLines.length === 1) {
            toast.error('Could not parse properly!')
            return ''
        }

        return csvLines.join('\n')
    }

    const handleFormSubmit = (data: CourseGradingFormData) => {
        if (!parsedData) {
            // First step: Parse the data
            if (
                data.dept !== 'ALL' &&
                (!depts.includes(data.dept) ||
                    !data.course.split(' ')[0].includes(data.dept))
            ) {
                toast.error(
                    "Please select a valid department for the course, or choose 'ALL'!"
                )
                return
            }

            const parsed = parseGradingData(data.gradingData)
            if (parsed) {
                setFormData(data)
                setParsedData(parsed)
            }
        } else {
            // Second step: Submit the data
            handleSubmit(data)
        }
    }

    const handleSubmit = async (data: CourseGradingFormData) => {
        if (!parsedData || parsedData.trim() === '') {
            toast.error('Please ensure the grading data is not empty!')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/courses/grading/add', {
                method: 'POST',
                body: JSON.stringify({
                    course: data.course,
                    dept: data.dept,
                    prof: data.prof,
                    sem: data.semester,
                    data: parsedData,
                    average_mark: parseFloat(data.averageMark || '0'),
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await response.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success('Grading data added successfully! Thank you!')

                setFormData(null)
                setParsedData(null)
                setDefaultValues({})

                localStorage.removeItem('h4u_grading_course')
                localStorage.removeItem('h4u_grading_prof')
            }
        } catch (error) {
            toast.error('An error occurred while submitting the data')
        }
        setIsLoading(false)
    }

    const handleBack = () => {
        setParsedData(null)
    }

    useEffect(() => {
        const savedCourse = localStorage.getItem('h4u_grading_course')
        const savedProf = localStorage.getItem('h4u_grading_prof')
        if (savedCourse || savedProf) {
            setDefaultValues({
                course: savedCourse || '',
                prof: savedProf || '',
            })
        }
    }, [])

    return (
        <AddPageLayout
            title="Course Grading"
            metaConfig={getMetaConfig('courses/grading')}
            containerId="addGrading"
        >
            {!parsedData ? (
                <CourseGradingForm
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    defaultValues={formData || defaultValues}
                    depts={depts}
                    filterDepartmentCodes={filterDepartmentCodes}
                    parsedData={parsedData}
                    averageMark={formData?.averageMark || null}
                    showParsedData={false}
                />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <div>
                            <span className="font-bold">Course:</span>{' '}
                            {formData?.course}
                        </div>
                        <div>
                            <span className="font-bold">Professor:</span>{' '}
                            {formData?.prof}
                        </div>
                        <div>
                            <span className="font-bold">Semester:</span>{' '}
                            {formData?.semester}
                        </div>
                        <div>
                            <span className="font-bold">Department:</span>{' '}
                            {formData?.dept}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-gray-300 text-sm font-medium">
                            Parsed Data (Editable)
                        </label>
                        <textarea
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 h-60"
                            value={parsedData}
                            onChange={(e) => setParsedData(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            className="btn btn-outline"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        <button
                            className="btn btn-primary btn-lg min-w-48"
                            onClick={() => formData && handleSubmit(formData)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Grading Data'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </AddPageLayout>
    )
}
