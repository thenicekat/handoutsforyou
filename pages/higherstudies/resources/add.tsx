import AddPageLayout from '@/components/AddPageLayout'
import HigherStudiesResourceForm from '@/components/forms/HigherStudiesResourceForm'
import SubmitButton from '@/components/SubmitButton'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddHSResources() {
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [category, setCategory] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const addResource = async () => {
        if (!name || !link || !createdBy || !category) {
            toast.error('Please fill all required fields')
            return
        }

        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/higherstudies/resources/add', {
                name,
                link,
                created_by: createdBy,
                category,
            })
            const data = res.data
            
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! Your resource was added successfully!')
                setName('')
                setLink('')
                setCreatedBy('')
                setCategory('')
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
            <HigherStudiesResourceForm
                name={name}
                setName={setName}
                link={link}
                setLink={setLink}
                createdBy={createdBy}
                setCreatedBy={setCreatedBy}
                category={category}
                setCategory={setCategory}
            />
            
            <SubmitButton
                onClick={addResource}
                isLoading={isLoading}
                className="mt-6"
            >
                Add Resource
            </SubmitButton>
        </AddPageLayout>
    )
}
