import { courses } from '@/config/courses'
import { profs } from '@/config/profs'
import { gradedSemesters } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, SelectInput, TextArea, TextInput } from './FormComponents'

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
    onSubmit: (data: CourseGradingFormData) => void
    isLoading?: boolean
    defaultValues?: Partial<CourseGradingFormData>
    depts: string[]
    filterDepartmentCodes: (course: string) => string[]
    parsedData?: string | null
    averageMark?: string | null
    showParsedData?: boolean
}

export default function CourseGradingForm({
    onSubmit,
    isLoading = false,
    defaultValues,
    depts,
    filterDepartmentCodes,
    parsedData,
    averageMark,
    showParsedData = false,
}: CourseGradingFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
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

    const courseOptions = courses.map((course) => ({
        value: course,
        label: course,
    }))

    const profOptions = profs.map((prof) => ({
        value: prof.name,
        label: prof.name,
    }))

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Course" required error={errors.course}>
                <SelectInput
                    registration={register('course')}
                    options={courseOptions}
                    placeholder="Select a course"
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
                <SelectInput
                    registration={register('prof')}
                    options={profOptions}
                    placeholder="Select a professor"
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

            <FormField
                label="Average Mark (Optional)"
                error={errors.averageMark}
            >
                <TextInput
                    registration={register('averageMark')}
                    placeholder="Enter average marks if available"
                    error={errors.averageMark}
                />
            </FormField>

            {averageMark && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="text-green-400 font-semibold">
                        Average Mark: {averageMark}
                    </div>
                </div>
            )}

            {showParsedData && parsedData && (
                <FormField label="Parsed Data Preview">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                            {parsedData}
                        </pre>
                    </div>
                </FormField>
            )}

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
                    ) : showParsedData ? (
                        'Submit Grading Data'
                    ) : (
                        'Parse & Preview'
                    )}
                </button>
            </div>
        </form>
    )
}
