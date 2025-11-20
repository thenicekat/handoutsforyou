import { getMetaConfig } from '@/config/meta'
import PlacementCTCForm, {
    PlacementCTCFormData,
} from '@/forms/PlacementCTCForm'
import AddPageLayout from '@/layout/AddPage'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPlacementCTCs() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (
        data: PlacementCTCFormData,
        resetForm: () => void
    ) => {
        setIsLoading(true)

        try {
            const res = await axiosInstance.post('/api/zob/ctcs/add', {
                company: data.name.trim(),
                campus: data.campus,
                academicYear: data.academicYear,
                base: data.base,
                joiningBonus: data.joiningBonus,
                relocationBonus: data.relocationBonus,
                variableBonus: data.variableBonus,
                monetaryValueOfBenefits: data.monetaryValueOfBenefits,
                description: data.description.trim(),
            })
            const result = res.data
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success('Thank you! CTC was added successfully!')
                resetForm() // Reset form using React Hook Form
            }
        } catch (error) {
            toast.error('Error: ' + error)
        }
        setIsLoading(false)
    }

    return (
        <AddPageLayout
            title="Add Placement CTC"
            metaConfig={getMetaConfig('zob/ctcs')}
            containerId="addPlacementCTC"
        >
            <PlacementCTCForm onSubmit={handleSubmit} isLoading={isLoading} />
        </AddPageLayout>
    )
}
