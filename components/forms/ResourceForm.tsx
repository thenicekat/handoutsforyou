import { departments } from '@/config/departments'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, SelectInput, TextInput } from './FormComponents'

const resourceSchema = z.object({
    name: z.string().min(1, 'Resource name is required'),
    link: z.string().url('Please enter a valid URL'),
    createdBy: z.string().min(1, 'Your name is required'),
    category: z.string().min(1, 'Category is required'),
})

export type ResourceFormData = z.infer<typeof resourceSchema>

interface ResourceFormProps {
    onSubmit: (data: ResourceFormData) => void
    isLoading?: boolean
    defaultValues?: Partial<ResourceFormData>
    isCourseDepartment?: boolean
}

export default function ResourceForm({
    onSubmit,
    isLoading = false,
    defaultValues,
    isCourseDepartment = false,
}: ResourceFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ResourceFormData>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            name: '',
            link: '',
            createdBy: '',
            category: '',
            ...defaultValues,
        },
    })

    const departmentOptions = Object.keys(departments).map((dept) => ({
        value: dept,
        label: dept,
    }))

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Resource Name" required error={errors.name}>
                <TextInput
                    registration={register('name')}
                    placeholder="Enter resource name"
                    error={errors.name}
                />
            </FormField>

            <FormField label="Link" required error={errors.link}>
                <TextInput
                    type="url"
                    registration={register('link')}
                    placeholder="https://..."
                    error={errors.link}
                />
            </FormField>

            <FormField label="Your Name" required error={errors.createdBy}>
                <TextInput
                    registration={register('createdBy')}
                    placeholder="Enter your name"
                    error={errors.createdBy}
                />
            </FormField>

            <FormField label="Category" required error={errors.category}>
                {isCourseDepartment ? (
                    <SelectInput
                        registration={register('category')}
                        options={departmentOptions}
                        placeholder="Select department"
                        error={errors.category}
                    />
                ) : (
                    <TextInput
                        registration={register('category')}
                        placeholder="Enter category"
                        error={errors.category}
                    />
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
                            Submitting...
                        </>
                    ) : (
                        'Add Resource'
                    )}
                </button>
            </div>
        </form>
    )
}
