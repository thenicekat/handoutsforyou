import { getMetaConfig } from '@/config/meta'
import ResourceForm, {
    ResourceFormData,
    ResourceFormRef,
} from '@/forms/ResourceForm'
import AddPageLayout from '@/layout/AddPage'
import axiosInstance from '@/utils/axiosCache'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddResources() {
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<ResourceFormRef>(null)

    const handleSubmit = async (data: ResourceFormData) => {
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
                formRef.current?.reset()
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
                ref={formRef}
                resourceType="course"
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </AddPageLayout>
    )
}
