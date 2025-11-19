import AddPageLayout from '@/components/AddPageLayout'
import CourseReviewForm from '@/components/forms/CourseReviewForm'
import SubmitButton from '@/components/SubmitButton'
import { getMetaConfig } from '@/config/meta'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddReview() {
    const [course, setCourse] = useState('')
    const [prof, setProf] = useState('')
    const [review, setReview] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const addReview = async () => {
        if (!course || !prof || !review) {
            toast.error('Please fill all required fields')
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/reviews/add', {
                method: 'POST',
                body: JSON.stringify({
                    course,
                    prof,
                    review,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json()
            
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
                setCourse('')
                setProf('')
                setReview('')
                // Clear localStorage
                localStorage.removeItem('h4u_course')
                localStorage.removeItem('h4u_prof')
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
        if (savedCourse) setCourse(savedCourse)
        if (savedProf) setProf(savedProf)
    }, [])

    return (
        <AddPageLayout
            title="Add Course Review"
            metaConfig={getMetaConfig('courses/reviews')}
            containerId="addReview"
        >
            <CourseReviewForm
                course={course}
                setCourse={setCourse}
                prof={prof}
                setProf={setProf}
                review={review}
                setReview={setReview}
            />
            
            <SubmitButton
                onClick={addReview}
                isLoading={isLoading}
                className="mt-6"
            >
                Add Review
            </SubmitButton>
        </AddPageLayout>
    )
}
