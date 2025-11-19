import AutoCompleter from '@/components/AutoCompleter'
import { FormField, TextInput } from '@/components/FormField'
import { departments } from '@/config/departments'

interface ResourceFormProps {
    name: string
    setName: (value: string) => void
    link: string
    setLink: (value: string) => void
    createdBy: string
    setCreatedBy: (value: string) => void
    category: string
    setCategory: (value: string) => void
    isCourseDepartment?: boolean
}

export default function ResourceForm({
    name,
    setName,
    link,
    setLink,
    createdBy,
    setCreatedBy,
    category,
    setCategory,
    isCourseDepartment = false,
}: ResourceFormProps) {
    return (
        <>
            <FormField label="Resource Name" required>
                <TextInput
                    value={name}
                    onChange={setName}
                    placeholder="Enter resource name"
                />
            </FormField>

            <FormField label="Link" required>
                <TextInput
                    type="url"
                    value={link}
                    onChange={setLink}
                    placeholder="https://..."
                />
            </FormField>

            <FormField label="Your Name" required>
                <TextInput
                    value={createdBy}
                    onChange={setCreatedBy}
                    placeholder="Enter your name"
                />
            </FormField>

            <FormField label="Category" required>
                {isCourseDepartment ? (
                    <AutoCompleter
                        items={Object.keys(departments)}
                        value={category}
                        onChange={setCategory}
                        name="department"
                    />
                ) : (
                    <TextInput
                        value={category}
                        onChange={setCategory}
                        placeholder="Enter category"
                    />
                )}
            </FormField>
        </>
    )
}
