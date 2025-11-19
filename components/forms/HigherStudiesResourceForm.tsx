import AutoCompleter from '@/components/AutoCompleter'
import { FormField, TextInput } from '@/components/FormField'
import { higherStudiesCategories } from '@/config/categories'

interface HigherStudiesResourceFormProps {
    name: string
    setName: (value: string) => void
    link: string
    setLink: (value: string) => void
    createdBy: string
    setCreatedBy: (value: string) => void
    category: string
    setCategory: (value: string) => void
}

export default function HigherStudiesResourceForm({
    name,
    setName,
    link,
    setLink,
    createdBy,
    setCreatedBy,
    category,
    setCategory,
}: HigherStudiesResourceFormProps) {
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
                <AutoCompleter
                    items={higherStudiesCategories}
                    value={category}
                    onChange={setCategory}
                    name="category"
                />
            </FormField>
        </>
    )
}
