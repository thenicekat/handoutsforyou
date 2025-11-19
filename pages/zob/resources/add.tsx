import AddPageLayout from '@/components/AddPageLayout'
import ResourceForm, {
    ResourceFormData,
    ResourceFormRef,
} from '@/components/forms/ResourceForm'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPlacementResources() {
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<ResourceFormRef>(null)

    const handleSubmit = async (data: ResourceFormData) => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/zob/resources/add', {
                name: data.name,
                link: data.link,
                created_by: data.createdBy,
                category: data.category,
            })
            const result = res.data

            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your resource was added successfully!'
                )
                // Reset form using React Hook Form's reset method
                formRef.current?.reset()
            }
        } catch (error) {
            console.error('Error adding placement resource:', error)
            toast.error('Failed to add resource')
        }
        setIsLoading(false)
    }

    return (
        <AddPageLayout
            title="Add Placement Resource"
            metaConfig={getMetaConfig('zob/resources')}
            containerId="addZobResources"
        >
            <ResourceForm
                ref={formRef}
                resourceType="placement"
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </AddPageLayout>
    )
}
