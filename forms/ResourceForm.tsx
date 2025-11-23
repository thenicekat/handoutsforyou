import { higherStudiesCategories, zobCategories } from '@/config/categories'
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

type ResourceType = 'course' | 'higherStudies' | 'placement' | 'general'

interface ResourceFormProps {
    onSubmit: (data: ResourceFormData, reset: () => void) => void
    isLoading?: boolean
    defaultValues?: Partial<ResourceFormData>
    resourceType: ResourceType
}

export default function ResourceForm({
    onSubmit,
    isLoading = false,
    defaultValues,
    resourceType,
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

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    // Get category options based on resource type
    const getCategoryConfig = () => {
        switch (resourceType) {
            case 'course':
                return {
                    categoryOptions: Object.keys(departments).map(dept => ({
                        value: dept,
                        label: dept,
                    })),
                    categoryLabel: 'Department',
                    categoryPlaceholder: 'Select department',
                    allowTextCategory: false,
                }
            case 'higherStudies':
                return {
                    categoryOptions: higherStudiesCategories.map(category => ({
                        value: category,
                        label: category,
                    })),
                    categoryLabel: 'Category',
                    categoryPlaceholder: 'Select category',
                    allowTextCategory: false,
                }
            case 'placement':
                return {
                    categoryOptions: zobCategories.map(category => ({
                        value: category,
                        label: category,
                    })),
                    categoryLabel: 'Category',
                    categoryPlaceholder: 'Select category',
                    allowTextCategory: false,
                }
            case 'general':
            default:
                return {
                    categoryOptions: [],
                    categoryLabel: 'Category',
                    categoryPlaceholder: 'Enter category',
                    allowTextCategory: true,
                }
        }
    }

    const categoryConfig = getCategoryConfig()

    return (
        <form
            onSubmit={handleSubmit(data => onSubmit(data, reset))}
            className="space-y-6"
        >
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

            <FormField
                label={categoryConfig.categoryLabel}
                required
                error={errors.category}
            >
                {categoryConfig.allowTextCategory ? (
                    <TextInput
                        registration={register('category')}
                        placeholder={categoryConfig.categoryPlaceholder}
                        error={errors.category}
                    />
                ) : (
                    <SelectInput
                        registration={register('category')}
                        options={categoryConfig.categoryOptions}
                        placeholder={categoryConfig.categoryPlaceholder}
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
