import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, TextInput } from './FormComponents'

const handoutUploadSchema = z.object({
    yearFolder: z
        .string()
        .min(1, 'Folder name is required')
        .min(3, 'Folder name should be at least 3 characters'),
    file: z
        .any()
        .refine(
            files => files instanceof FileList && files.length > 0,
            'File is required'
        )
        .refine(files => {
            if (!(files instanceof FileList)) return false
            const file = files[0]
            const ext = file?.name.split('.').pop()?.toLowerCase() || ''
            return ['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)
        }, 'Invalid file type. Allowed: pdf, doc, docx, ppt, pptx.')
        .refine(files => {
            if (!(files instanceof FileList)) return false
            return files[0]?.size <= 25 * 1024 * 1024
        }, 'File too large. Max size is 25MB.'),
})

export type HandoutUploadFormData = z.infer<typeof handoutUploadSchema>

interface HandoutUploadFormProps {
    onSubmit: (data: { yearFolder: string; file: File }) => void
    isLoading?: boolean
    defaultValues?: Partial<Omit<HandoutUploadFormData, 'file'>>
}

export default function HandoutUploadForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: HandoutUploadFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<HandoutUploadFormData>({
        resolver: zodResolver(handoutUploadSchema),
        defaultValues: {
            yearFolder: '',
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const handleFormSubmit = (data: HandoutUploadFormData) => {
        const file = data.file[0]
        onSubmit({ yearFolder: data.yearFolder, file })
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
                label="Year / Semester Folder Name"
                required
                error={errors.yearFolder}
                helpText="e.g. 2024-25 Sem 1"
            >
                <TextInput
                    registration={register('yearFolder')}
                    placeholder="e.g. 2024-25 Sem 1"
                    error={errors.yearFolder}
                />
            </FormField>

            <FormField
                label="File"
                required
                error={errors.file as any}
                helpText="Allowed: pdf, doc, docx, ppt, pptx. Max size: 25MB"
            >
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
                        'Upload Handout'
                    )}
                </button>
            </div>
        </form>
    )
}
