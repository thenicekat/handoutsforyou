import { getMetaConfig } from '@/config/meta'
import PSReviewForm, { PSReviewFormData } from '@/forms/PSReviewForm'
import AddPageLayout from '@/layout/AddPage'
import { PS1Item } from '@/types/PS'
import { axiosInstance } from '@/utils/axiosCache'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPS1Review() {
    const [userResponses, setUserResponses] = useState<PS1Item[]>([])
    const [selectedResponse, setSelectedResponse] = useState<PS1Item | null>(
        null
    )
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchUserResponses = async () => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/ps/cutoffs/get', {
                type: 'ps1',
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

    const handleResponseSelect = (response: PS1Item) => {
        setSelectedResponse(response)
    }

    const handleSubmit = async (data: PSReviewFormData) => {
        if (!selectedResponse) {
            toast.error('Please select a PS1 response')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await axiosInstance.post('/api/ps/reviews/add', {
                type: 'PS1',
                batch: selectedResponse.year_and_sem,
                station: selectedResponse.station,
                review: data.review,
                allotment_round: selectedResponse.allotment_round,
            })
            const res = response.data

            if (res.error) {
                toast.error(res.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
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
            title="Add PS1 Review"
            metaConfig={getMetaConfig('ps/reviews/ps1')}
            containerId="addPSReview"
        >
            <PSReviewForm
                isPS1={true}
                userResponses={userResponses}
                selectedResponse={selectedResponse}
                onResponseSelect={handleResponseSelect}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
            />
        </AddPageLayout>
    )
}
