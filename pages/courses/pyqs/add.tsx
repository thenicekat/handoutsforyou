import { getMetaConfig } from '@/config/meta'
import PYQUploadForm from '@/forms/PYQUploadForm'
import AddPageLayout from '@/layout/AddPage'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPYQ() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (form: {
        course: string
        professor: string
        year: string
        file: File
    }) => {
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('course', form.course)
            formData.append('year', form.year)
            formData.append('professor', form.professor)
            formData.append('file', form.file)

            const response = await fetch('/api/courses/pyqs/add', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!data.error) {
                toast.success('Thank you! Your PYQ was uploaded successfully!')
                window.location.href = '/courses/pyqs'
            } else {
                toast.error(data.message || 'Failed to upload PYQ')
            }
        } catch (error) {
            toast.error('Error uploading PYQ: ' + error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AddPageLayout
            title="Upload PYQ"
            metaConfig={getMetaConfig('courses/pyqs')}
            containerId="addPYQ"
        >
            <PYQUploadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </AddPageLayout>
    )
}
