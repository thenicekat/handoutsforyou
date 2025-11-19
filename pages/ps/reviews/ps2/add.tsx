import AddPageLayout from '@/components/AddPageLayout'
import PS2ReviewForm from '@/components/forms/PS2ReviewForm'
import SubmitButton from '@/components/SubmitButton'
import { getMetaConfig } from '@/config/meta'
import { PS2Item } from '@/types/PS'
import { axiosInstance } from '@/utils/axiosCache'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPS2Review() {
    const [userResponses, setUserResponses] = useState<PS2Item[]>([])
    const [selectedResponse, setSelectedResponse] = useState<PS2Item | null>(
        null
    )
    const [review, setReview] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchUserResponses = async () => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/ps/cutoffs/get', {
                type: 'ps2',
            })

            if (response.status === 200) {
                const data = response.data
                if (!data.error) {
                    setUserResponses(data.data)
                } else {
                    toast.error(data.message)
                }
            } else {
                toast.error('Failed to fetch your responses')
            }
        } catch (error) {
            console.error('Error fetching user responses:', error)
            toast.error('An error occurred while fetching your responses')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResponseSelect = (response: PS2Item) => {
        setSelectedResponse(response)
    }

    const addReview = async () => {
        if (!selectedResponse) {
            toast.error('Please select a PS2 response')
            return
        }
        if (!review.trim()) {
            toast.error('Review cannot be empty!')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await axiosInstance.post('/api/ps/reviews/add', {
                type: 'PS2',
                batch: selectedResponse.year_and_sem,
                station: selectedResponse.station,
                review: review,
                allotment_round: selectedResponse.allotment_round,
            })
            const res = response.data

            if (res.error) {
                toast.error(res.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
                setReview('')
                setSelectedResponse(null)
                window.location.href = '/ps'
            }
        } catch (error) {
            console.error('Error adding review:', error)
            toast.error('Failed to add review')
        }
        setIsSubmitting(false)
    }

    useEffect(() => {
        fetchUserResponses()
    }, [])

    return (
        <AddPageLayout
            title="Add PS2 Review"
            metaConfig={getMetaConfig('ps/reviews/ps2')}
            containerId="addPSReview"
        >
            <PS2ReviewForm
                userResponses={userResponses}
                selectedResponse={selectedResponse}
                onResponseSelect={handleResponseSelect}
                review={review}
                setReview={setReview}
                isLoading={isLoading}
            />

            {userResponses.length > 0 && (
                <SubmitButton
                    onClick={addReview}
                    isLoading={isSubmitting}
                    disabled={!selectedResponse || !review.trim()}
                    className="mt-6"
                >
                    Add Review
                </SubmitButton>
            )}
        </AddPageLayout>
    )
}
