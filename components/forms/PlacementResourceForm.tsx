import AutoCompleter from '@/components/AutoCompleter'
import { FormField, TextInput } from '@/components/FormField'
import { zobCategories } from '@/config/categories'

interface PlacementResourceFormProps {
    name: string
    setName: (value: string) => void
    link: string
    setLink: (value: string) => void
    createdBy: string
    setCreatedBy: (value: string) => void
    category: string
    setCategory: (value: string) => void
}

export default function PlacementResourceForm({
    name,
    setName,
    link,
    setLink,
    createdBy,
    setCreatedBy,
    category,
    setCategory,
}: PlacementResourceFormProps) {
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
                    items={zobCategories}
                    value={category}
                    onChange={setCategory}
                    name="category"
                />
            </FormField>
        </>
    )
}
