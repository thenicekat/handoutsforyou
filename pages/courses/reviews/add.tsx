import { getMetaConfig } from '@/config/meta'
import CourseReviewForm, {
    CourseReviewFormData,
} from '@/forms/CourseReviewForm'
import AddPageLayout from '@/layout/AddPage'
import axiosInstance from '@/utils/axiosCache'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddReview() {
    const [isLoading, setIsLoading] = useState(false)
    const [defaultValues, setDefaultValues] = useState<
        Partial<CourseReviewFormData>
    >({})

    const handleSubmit = async (
        data: CourseReviewFormData,
        resetForm: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/reviews/add',
                {
                    course: data.course,
                    prof: data.prof,
                    review: data.review,
                }
            )

            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
                // Clear localStorage
                localStorage.removeItem('h4u_course')
                localStorage.removeItem('h4u_prof')
                resetForm() // Reset form using React Hook Form
            }
        } catch (error) {
            toast.error('Error: ' + error)
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
