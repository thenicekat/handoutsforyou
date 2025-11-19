import AddPageLayout from '@/components/AddPageLayout'
import ResourceForm, {
    ResourceFormData,
    ResourceFormRef,
} from '@/components/forms/ResourceForm'
import { getMetaConfig } from '@/config/meta'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddResources() {
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<ResourceFormRef>(null)

    const handleSubmit = async (data: ResourceFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/resources/add', {
                method: 'POST',
                body: JSON.stringify({
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()

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
