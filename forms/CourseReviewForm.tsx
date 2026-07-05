import { useCourses, useProfNames } from '@/hooks/useConstants'
import { CourseReviewFormData } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { AutoCompleterInput, FormField, TextArea } from './FormComponents'

const courseReviewSchema = z.object({
    course: z.string().min(1, 'Course is required'),
    prof: z.string().min(1, 'Professor is required'),
    review: z
        .string()
        .min(
            200,
            'Review must be at least 200 characters long. Please be genuine and descriptive about your experience.'
        ),
})

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
    const courses = useCourses()
    const profNamesList = useProfNames()
    const profNameSet = useMemo(() => new Set(profNamesList), [profNamesList])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<CourseReviewFormData>({
        resolver: zodResolver(courseReviewSchema),
        defaultValues: {
            course: '',
            prof: '',
            review: '',
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const submitReview = (data: CourseReviewFormData) => {
        if (courses.length > 0 && !courses.includes(data.course)) {
            toast.error('Please select a valid course from the list')
            return
        }
        if (profNameSet.size > 0 && !profNameSet.has(data.prof)) {
            toast.error('Please select a valid professor from the list')
            return
        }
        onSubmit(data, reset)
    }

    return (
        <form onSubmit={handleSubmit(submitReview)} className="space-y-6">
            <FormField label="Course" required error={errors.course}>
                <AutoCompleterInput
                    control={control}
                    name="course"
                    items={courses}
                    placeholder="course"
                    error={errors.course}
                />
            </FormField>

            <FormField label="Professor" required error={errors.prof}>
                <AutoCompleterInput
                    control={control}
                    name="prof"
                    items={profNamesList}
                    placeholder="professor"
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
