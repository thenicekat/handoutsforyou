import { higherStudiesCategories } from '@/config/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, SelectInput, TextInput } from './FormComponents'

const higherStudiesResourceSchema = z.object({
    name: z.string().min(1, 'Resource name is required'),
    link: z.string().url('Please enter a valid URL'),
    createdBy: z.string().min(1, 'Your name is required'),
    category: z
        .string()
        .min(1, 'Category is required')
        .refine(
            (val) => higherStudiesCategories.includes(val),
            'Please select a valid category from the list'
        ),
})

export type HigherStudiesResourceFormData = z.infer<
    typeof higherStudiesResourceSchema
>

interface HigherStudiesResourceFormProps {
    onSubmit: (data: HigherStudiesResourceFormData) => void
    isLoading?: boolean
    defaultValues?: Partial<HigherStudiesResourceFormData>
}

export default function HigherStudiesResourceForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: HigherStudiesResourceFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<HigherStudiesResourceFormData>({
        resolver: zodResolver(higherStudiesResourceSchema),
        defaultValues: {
            name: '',
            link: '',
            createdBy: '',
            category: '',
            ...defaultValues,
        },
    })

    const categoryOptions = higherStudiesCategories.map((category) => ({
        value: category,
        label: category,
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
                <SelectInput
                    registration={register('category')}
                    options={categoryOptions}
                    placeholder="Select category"
                    error={errors.category}
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
