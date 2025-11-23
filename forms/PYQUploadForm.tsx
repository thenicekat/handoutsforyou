import { courses as courseNames } from '@/config/courses'
import { profs } from '@/config/profs'
import { pyqYears } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AutoCompleterInput, FormField } from './FormComponents'

const pyqUploadSchema = z.object({
    course: z
        .string()
        .min(1, 'Course is required')
        .refine(
            val => courseNames.includes(val),
            'Please select a valid course from the list'
        ),
    professor: z
        .string()
        .min(1, 'Professor is required')
        .refine(
            val => profs.map(p => p.name).includes(val),
            'Please select a valid professor from the list'
        ),
    year: z
        .string()
        .min(1, 'Year is required')
        .refine(
            val => pyqYears.includes(val),
            'Please select a valid year from the list'
        ),
    file: z
        .any()
        .refine(files => files instanceof FileList && files.length > 0, 'File is required')
        .refine(files => {
            if (!(files instanceof FileList)) return false
            const file = files[0]
            const ext = file?.name.split('.').pop()?.toLowerCase() || ''
            return ['pdf', 'doc', 'docx'].includes(ext)
        }, 'Invalid file type. Please upload a pdf/doc/docx.')
        .refine(
            files => {
                if (!(files instanceof FileList)) return false
                return files[0]?.size <= 10 * 1024 * 1024
            },
            'File too large. Max size is 10MB.'
        ),
})

export type PYQUploadFormData = z.infer<typeof pyqUploadSchema>

interface PYQUploadFormProps {
    onSubmit: (data: {
        course: string
        professor: string
        year: string
        file: File
    }) => void
    isLoading?: boolean
    defaultValues?: Partial<Omit<PYQUploadFormData, 'file'>>
}

export default function PYQUploadForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: PYQUploadFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<PYQUploadFormData>({
        resolver: zodResolver(pyqUploadSchema),
        defaultValues: {
            course: '',
            professor: '',
            year: '',
            ...defaultValues,
        },
    })

    const profNames = profs.map(prof => prof.name)

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const handleFormSubmit = (data: PYQUploadFormData) => {
        const file = data.file[0]
        onSubmit({
            course: data.course,
            professor: data.professor,
            year: data.year,
            file,
        })
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            <FormField label="Course Name" required error={errors.course}>
                <AutoCompleterInput
                    control={control}
                    name="course"
                    items={courseNames}
                    placeholder="course"
                    error={errors.course}
                />
            </FormField>

            <FormField label="Professor" required error={errors.professor}>
                <AutoCompleterInput
                    control={control}
                    name="professor"
                    items={profNames}
                    placeholder="professor"
                    error={errors.professor}
                />
            </FormField>

            <FormField label="Year" required error={errors.year}>
                <AutoCompleterInput
                    control={control}
                    name="year"
                    items={pyqYears}
                    placeholder="year"
                    error={errors.year}
                />
            </FormField>

            <FormField
                label="File (pdf/doc/docx)"
                required
                error={errors.file as any}
                helpText="Max size: 10MB"
            >
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    {...register('file')}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-400/20 file:text-amber-500 hover:file:bg-amber-400/30 text-white w-full"
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
                            Uploading...
                        </>
                    ) : (
                        'Upload PYQ'
                    )}
                </button>
            </div>
        </form>
    )
}
