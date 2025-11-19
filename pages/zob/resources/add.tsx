import AddPageLayout from '@/components/AddPageLayout'
import PlacementResourceForm, {
    PlacementResourceFormData,
} from '@/components/forms/PlacementResourceForm'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPlacementResources() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: PlacementResourceFormData) => {
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
                // Form will be reset automatically by React Hook Form
                window.location.reload() // Refresh to clear form
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
            <PlacementResourceForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </AddPageLayout>
    )
}
