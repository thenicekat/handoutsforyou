import AddPageLayout from '@/components/AddPageLayout'
import CourseReviewForm, {
    CourseReviewFormData,
} from '@/components/forms/CourseReviewForm'
import { getMetaConfig } from '@/config/meta'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddReview() {
    const [isLoading, setIsLoading] = useState(false)
    const [defaultValues, setDefaultValues] = useState<
        Partial<CourseReviewFormData>
    >({})

    const handleSubmit = async (data: CourseReviewFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/reviews/add', {
                method: 'POST',
                body: JSON.stringify({
                    course: data.course,
                    prof: data.prof,
                    review: data.review,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()

            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
                // Clear localStorage
                localStorage.removeItem('h4u_course')
                localStorage.removeItem('h4u_prof')
                // Form will be reset automatically by React Hook Form
                window.location.reload() // Refresh to clear form
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        // Load from localStorage if available
        const savedCourse = localStorage.getItem('h4u_course')
        const savedProf = localStorage.getItem('h4u_prof')
        if (savedCourse || savedProf) {
            setDefaultValues({
                course: savedCourse || '',
                prof: savedProf || '',
                review: '',
            })
        }
    }, [])

    return (
        <AddPageLayout
            title="Add Course Review"
            metaConfig={getMetaConfig('courses/reviews')}
            containerId="addReview"
        >
            <CourseReviewForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                defaultValues={defaultValues}
            />
        </AddPageLayout>
    )
}
