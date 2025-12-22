import AutoCompleter from '@/components/AutoCompleter'
import { courses as courseNames } from '@/config/courses'
import { pyqYears } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from './FormComponents'

const handoutSchema = z.object({
    course: z.string().min(1, 'Course name is required'),
    semester: z.string().min(1, 'Semester is required'),
    file: z.any().refine(val => val instanceof File, 'File is required'),
})

export type HandoutFormData = z.infer<typeof handoutSchema>

interface HandoutFormProps {
    onSubmit: (data: HandoutFormData, reset: () => void) => void
    isLoading?: boolean
    defaultValues?: Partial<HandoutFormData>
}

export default function HandoutForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: HandoutFormProps) {
    const [uploadCourse, setUploadCourse] = useState('')
    const [uploadSemester, setUploadSemester] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        setError,
        clearErrors,
    } = useForm<HandoutFormData>({
        resolver: zodResolver(handoutSchema),
        defaultValues: {
            course: '',
            semester: '',
            file: null,
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (defaultValues) {
            if (defaultValues.course) setUploadCourse(defaultValues.course)
            if (defaultValues.semester)
                setUploadSemester(defaultValues.semester)
        }
    }, [defaultValues])

    const validateFile = (file: File) => {
        const allowedExtensions = ['pdf', 'docx', 'doc']
        const extension = file.name.split('.').pop()
        if (
            !extension ||
            !allowedExtensions.includes(extension.toLowerCase())
        ) {
            setError('file', {
                type: 'manual',
                message: `Please upload: ${allowedExtensions.join(', ')}`,
            })
            return false
        }
        clearErrors('file')
        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
        if (file) {
            if (validateFile(file)) {
                setValue('file', file)
            } else {
                setSelectedFile(null)
                setValue('file', null)
            }
        }
    }

    const handleCourseChange = (value: string) => {
        setUploadCourse(value)
        setValue('course', value)
    }

    const handleSemesterChange = (value: string) => {
        setUploadSemester(value)
        setValue('semester', value)
    }

    const resetForm = () => {
        setUploadCourse('')
        setUploadSemester('')
        setSelectedFile(null)
        reset()
    }

    return (
        <form
            onSubmit={handleSubmit(data => onSubmit(data, resetForm))}
            className="space-y-6"
        >
            <FormField label="Course Name" required error={errors.course}>
                <AutoCompleter
                    items={courseNames}
                    value={uploadCourse}
                    onChange={handleCourseChange}
                    name="course"
                />
                {errors.course && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.course.message}
                    </p>
                )}
            </FormField>

            <FormField label="Semester" required error={errors.semester}>
                <AutoCompleter
                    items={pyqYears}
                    value={uploadSemester}
                    onChange={handleSemesterChange}
                    name="semester"
                />
                {errors.semester && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.semester.message}
                    </p>
                )}
            </FormField>

            <FormField label="File" required>
                <input
                    type="file"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-black hover:file:bg-amber-500"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                />
                {errors.file && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.file.message as string}
                    </p>
                )}
                {selectedFile && (
                    <p className="text-gray-300 text-sm mt-2">
                        Selected: {selectedFile.name}
                    </p>
                )}
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
                            Uploading...
                        </>
                    ) : (
                        'Upload Handout'
                    )}
                </button>
            </div>
        </form>
    )
}
