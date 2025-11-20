import { courses } from '@/config/courses'
import { profs } from '@/config/profs'
import { gradedSemesters } from '@/config/years_sems'
import { CourseGradeRow } from '@/types/Courses'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import {
    AutoCompleterInput,
    FormField,
    SelectInput,
    TextArea,
    TextInput,
} from './FormComponents'

const courseGradingSchema = z.object({
    course: z
        .string()
        .min(1, 'Course is required')
        .refine(
            (val) => courses.includes(val),
            'Please select a valid course from the list'
        ),
    dept: z.string().min(1, 'Department is required'),
    prof: z
        .string()
        .min(1, 'Professor is required')
        .refine(
            (val) => profs.map((p) => p.name).includes(val),
            'Please select a valid professor from the list'
        ),
    semester: z
        .string()
        .min(1, 'Semester is required')
        .refine(
            (val) => gradedSemesters.includes(val),
            'Please select a valid semester from the list'
        ),
    gradingData: z.string().min(10, 'Grading data is required'),
    averageMark: z.string().optional(),
})

export type CourseGradingFormData = z.infer<typeof courseGradingSchema>

interface CourseGradingFormProps {
    onSubmit: (data: CourseGradingFormData, parsedData: string) => void
    isLoading?: boolean
    defaultValues?: Partial<CourseGradingFormData>
    depts: string[]
    filterDepartmentCodes: (course: string) => string[]
    resetTrigger?: number
}

export default function CourseGradingForm({
    onSubmit,
    isLoading = false,
    defaultValues,
    depts,
    filterDepartmentCodes,
    resetTrigger,
}: CourseGradingFormProps) {
    const [parsedData, setParsedData] = useState<string | null>(null)
    const [showParsedData, setShowParsedData] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        control,
    } = useForm<CourseGradingFormData>({
        resolver: zodResolver(courseGradingSchema),
        defaultValues: {
            course: '',
            dept: '',
            prof: '',
            semester: '',
            gradingData: '',
            averageMark: '',
            ...defaultValues,
        },
    })

    const course = watch('course')

    const semesterOptions = gradedSemesters.map((sem) => ({
        value: sem,
        label: sem,
    }))

    const deptOptions = filterDepartmentCodes(course || '').map((d) => ({
        value: d,
        label: d,
    }))

    const profNames = profs.map((prof) => prof.name)

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const parseGradingData = (input: string): string => {
        const lines = input
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
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
                setParsedData(parsed)
                setShowParsedData(true)
            }
        } else {
            // Second step: Submit the data
            onSubmit(data, parsedData)
        }
    }

    const handleBack = () => {
        setParsedData(null)
        setShowParsedData(false)
    }

    const resetForm = () => {
        setParsedData(null)
        setShowParsedData(false)
        reset({
            course: '',
            dept: '',
            prof: '',
            semester: '',
            gradingData: '',
            averageMark: '',
        })
    }

    // Reset form when resetTrigger changes
    useEffect(() => {
        if (resetTrigger) {
            resetForm()
        }
    }, [resetTrigger])

    if (showParsedData && parsedData) {
        const formData = watch()
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                    <div>
                        <span className="font-bold">Course:</span>{' '}
                        {formData.course}
                    </div>
                    <div>
                        <span className="font-bold">Professor:</span>{' '}
                        {formData.prof}
                    </div>
                    <div>
                        <span className="font-bold">Semester:</span>{' '}
                        {formData.semester}
                    </div>
                    <div>
                        <span className="font-bold">Department:</span>{' '}
                        {formData.dept}
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
                        type="button"
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-primary btn-lg min-w-48"
                        onClick={() => handleFormSubmit(formData)}
                        disabled={isLoading}
                        type="button"
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
        )
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField label="Course" required error={errors.course}>
                <AutoCompleterInput
                    control={control}
                    name="course"
                    items={courses}
                    placeholder="course"
                    error={errors.course}
                />
            </FormField>

            <FormField label="Department" required error={errors.dept}>
                <SelectInput
                    registration={register('dept')}
                    options={deptOptions}
                    placeholder="Select department"
                    error={errors.dept}
                />
            </FormField>

            <FormField label="Professor" required error={errors.prof}>
                <AutoCompleterInput
                    control={control}
                    name="prof"
                    items={profNames}
                    placeholder="professor"
                    error={errors.prof}
                />
            </FormField>

            <FormField label="Semester" required error={errors.semester}>
                <SelectInput
                    registration={register('semester')}
                    options={semesterOptions}
                    placeholder="Select semester"
                    error={errors.semester}
                />
            </FormField>

            <FormField
                label="Grading Data"
                required
                error={errors.gradingData}
                helpText="Paste the raw grading data from the official source. The system will automatically parse it."
            >
                <TextArea
                    registration={register('gradingData')}
                    placeholder="Paste the grading data here..."
                    rows={10}
                    error={errors.gradingData}
                />
            </FormField>

            <FormField label="Average Mark" error={errors.averageMark}>
                <TextInput
                    registration={register('averageMark')}
                    placeholder="Enter average marks"
                    error={errors.averageMark}
                />
            </FormField>

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg min-w-48"
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Processing...
                        </>
                    ) : (
                        'Parse & Preview'
                    )}
                </button>
            </div>
        </form>
    )
}
