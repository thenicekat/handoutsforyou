import { siYears } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, SelectInput, TextArea, TextInput } from './FormComponents'

const siCompanySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    roles: z.string().min(1, 'Roles are required'),
    year: z.string().min(1, 'Year is required'),
    cgpaCutoff: z.string().min(1, 'CGPA cutoff is required'),
    stipend: z.string().min(1, 'Stipend information is required'),
    eligibility: z.string().min(1, 'Eligibility criteria is required'),
    otherDetails: z.string().optional(),
})

export type SICompanyFormData = z.infer<typeof siCompanySchema>

interface SICompanyFormProps {
    onSubmit: (data: SICompanyFormData) => void
    isLoading?: boolean
    defaultValues?: Partial<SICompanyFormData>
}

export default function SICompanyForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: SICompanyFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SICompanyFormData>({
        resolver: zodResolver(siCompanySchema),
        defaultValues: {
            name: '',
            roles: '',
            year: '',
            cgpaCutoff: '',
            stipend: '',
            eligibility: '',
            otherDetails: '',
            ...defaultValues,
        },
    })

    const yearOptions = siYears.map((yr) => ({
        value: yr,
        label: yr,
    }))

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Details Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                    Company Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Company Name"
                        required
                        error={errors.name}
                    >
                        <TextInput
                            registration={register('name')}
                            placeholder="Enter company name"
                            error={errors.name}
                        />
                    </FormField>

                    <FormField label="Roles" required error={errors.roles}>
                        <TextInput
                            registration={register('roles')}
                            placeholder="Enter available roles"
                            error={errors.roles}
                        />
                    </FormField>

                    <FormField label="Year" required error={errors.year}>
                        <SelectInput
                            registration={register('year')}
                            options={yearOptions}
                            placeholder="Select year"
                            error={errors.year}
                        />
                    </FormField>

                    <FormField
                        label="CGPA Cutoff"
                        required
                        error={errors.cgpaCutoff}
                    >
                        <TextInput
                            registration={register('cgpaCutoff')}
                            placeholder="e.g., 7.5 or Above 8.0"
                            error={errors.cgpaCutoff}
                        />
                    </FormField>
                </div>
            </div>

            {/* Internship Details Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                    Internship Details
                </h2>

                <div className="grid grid-cols-1 gap-6">
                    <FormField label="Stipend" required error={errors.stipend}>
                        <TextInput
                            registration={register('stipend')}
                            placeholder="e.g., ₹25,000/month or Unpaid"
                            error={errors.stipend}
                        />
                    </FormField>

                    <FormField
                        label="Eligibility Criteria"
                        required
                        error={errors.eligibility}
                    >
                        <TextArea
                            registration={register('eligibility')}
                            placeholder="Enter eligibility criteria (e.g., Branch requirements, academic performance, etc.)"
                            rows={4}
                            error={errors.eligibility}
                        />
                    </FormField>
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                    Additional Information
                </h2>

                <FormField
                    label="Other Details"
                    helpText="Any other relevant information about the internship, company culture, work location, etc."
                >
                    <TextArea
                        registration={register('otherDetails')}
                        placeholder="Optional: Any additional details about the company or internship"
                        rows={6}
                    />
                </FormField>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg min-w-48"
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Submitting...
                        </>
                    ) : (
                        'Submit SI Company Details'
                    )}
                </button>
            </div>
        </form>
    )
}
