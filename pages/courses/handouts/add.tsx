import { getMetaConfig } from '@/config/meta'
import HandoutUploadForm from '@/forms/HandoutUploadForm'
import AddPageLayout from '@/layout/AddPage'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddHandout() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (form: { yearFolder: string; file: File }) => {
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('yearFolder', form.yearFolder)
            formData.append('file', form.file)

            const response = await fetch('/api/courses/handouts/add', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.error) {
                toast.error(data.message || 'Failed to upload handout')
            } else {
                toast.success(
                    'Thank you! Your handout was uploaded successfully!'
                )
                window.location.href = '/courses/handouts'
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AddPageLayout
            title="Upload Handout"
            metaConfig={getMetaConfig('courses/handouts')}
            containerId="addHandout"
        >
            <HandoutUploadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </AddPageLayout>
    )
}
