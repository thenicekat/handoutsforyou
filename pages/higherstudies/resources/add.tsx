import { getMetaConfig } from '@/config/meta'
import ResourceForm, { ResourceFormData } from '@/forms/ResourceForm'
import AddPageLayout from '@/layout/AddPage'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddHSResources() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: ResourceFormData, reset: () => void) => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.post(
                '/api/higherstudies/resources/add',
                {
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }
            )
            const result = res.data

            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your resource was added successfully!'
                )
                // Reset form using React Hook Form's reset method
                reset()
            }
        } catch (error) {
            console.error('Error adding higher studies resource:', error)
            toast.error('Failed to add resource')
        }
        setIsLoading(false)
    }

    return (
        <AddPageLayout
            title="Add Higher Studies Resource"
            metaConfig={getMetaConfig('higherstudies')}
            containerId="addHSResources"
        >
            <ResourceForm
                resourceType="higherStudies"
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </AddPageLayout>
    )
}
