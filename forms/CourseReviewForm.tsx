import { courses } from '@/config/courses'
import { profs } from '@/config/profs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, SelectInput, TextArea } from './FormComponents'

const courseReviewSchema = z.object({
    course: z
        .string()
        .min(1, 'Course is required')
        .refine(
            (val) => courses.includes(val),
            'Please select a valid course from the list'
        ),
    prof: z
        .string()
        .min(1, 'Professor is required')
        .refine(
            (val) => profs.map((p) => p.name).includes(val),
            'Please select a valid professor from the list'
        ),
    review: z.string().min(100, 'Review must be at least 100 characters long'),
})

export type CourseReviewFormData = z.infer<typeof courseReviewSchema>

interface CourseReviewFormProps {
    onSubmit: (data: CourseReviewFormData, reset: () => void) => void
    isLoading?: boolean
    defaultValues?: Partial<CourseReviewFormData>
}

export default function CourseReviewForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: CourseReviewFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CourseReviewFormData>({
        resolver: zodResolver(courseReviewSchema),
        defaultValues: {
            course: '',
            prof: '',
            review: '',
            ...defaultValues,
        },
    })

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
        <form
            onSubmit={handleSubmit((data) => onSubmit(data, reset))}
            className="space-y-6"
        >
            <FormField label="Course" required error={errors.course}>
                <SelectInput
                    registration={register('course')}
                    options={courseOptions}
                    placeholder="Select a course"
                    error={errors.course}
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

            <FormField
                label="Review"
                required
                error={errors.review}
                helpText="Share your experience with this course and professor."
            >
                <TextArea
                    registration={register('review')}
                    placeholder="Write your review here..."
                    rows={8}
                    error={errors.review}
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
                        'Add Review'
                    )}
                </button>
            </div>
        </form>
    )
}
