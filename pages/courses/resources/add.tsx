import { getMetaConfig } from '@/config/meta'
import ResourceForm, { ResourceFormData } from '@/forms/ResourceForm'
import AddPageLayout from '@/layout/AddPage'
import axiosInstance from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddResources() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: ResourceFormData, reset: () => void) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/resources/add',
                {
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }
            )

            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your resource was added successfully!'
                )
                // Reset form using React Hook Form's reset method
                reset()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    return (
        <AddPageLayout
            title="Add Course Resource"
            metaConfig={getMetaConfig('courses/resources')}
            containerId="addResources"
        >
            <ResourceForm
                resourceType="course"
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </AddPageLayout>
    )
}
