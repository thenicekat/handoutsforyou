import AddPageLayout from '@/components/AddPageLayout'
import { getMetaConfig } from '@/config/meta'
import SICompanyForm, { SICompanyFormData } from '@/forms/SICompanyForm'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddSICompany() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (
        data: SICompanyFormData,
        resetForm: () => void
    ) => {
        setIsLoading(true)

        try {
            const res = await axiosInstance.post('/api/zob/companies/add', {
                name: data.name.trim(),
                roles: data.roles.trim(),
                year: data.year,
                cgpaCutoff: data.cgpaCutoff.trim(),
                stipend: data.stipend.trim(),
                eligibility: data.eligibility.trim(),
                otherDetails: data.otherDetails?.trim() || '',
            })
            const result = res.data
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success('Thank you! SI Company was added successfully!')
                resetForm() // Reset form using React Hook Form
            }
        } catch (error) {
            console.error('Error adding SI company:', error)
            toast.error('Failed to add SI company. Please try again.')
        }
        setIsLoading(false)
    }

    return (
        <AddPageLayout
            title="Add SI Company"
            metaConfig={getMetaConfig('si')}
            containerId="addSICompany"
        >
            <SICompanyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </AddPageLayout>
    )
}
