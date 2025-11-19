import AddPageLayout from '@/components/AddPageLayout'
import ResourceForm from '@/components/forms/ResourceForm'
import SubmitButton from '@/components/SubmitButton'
import { getMetaConfig } from '@/config/meta'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddResources() {
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
            const res = await fetch('/api/courses/resources/add', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    link,
                    created_by: createdBy,
                    category,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json()

            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success(
                    'Thank you! Your resource was added successfully!'
                )
                setName('')
                setLink('')
                setCreatedBy('')
                setCategory('')
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
                name={name}
                setName={setName}
                link={link}
                setLink={setLink}
                createdBy={createdBy}
                setCreatedBy={setCreatedBy}
                category={category}
                setCategory={setCategory}
                isCourseDepartment={true}
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
