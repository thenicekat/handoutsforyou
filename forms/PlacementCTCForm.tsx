import { placementYears } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    FormField,
    NumberInput,
    SelectInput,
    TextArea,
    TextInput,
} from './FormComponents'

const placementCTCSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    campus: z.string().min(1, 'Campus is required'),
    academicYear: z.string().min(1, 'Academic year is required'),
    base: z.number().min(0, 'Base salary cannot be negative'),
    joiningBonus: z.number().min(0, 'Joining bonus cannot be negative'),
    relocationBonus: z.number().min(0, 'Relocation bonus cannot be negative'),
    variableBonus: z.number().min(0, 'Variable bonus cannot be negative'),
    monetaryValueOfBenefits: z
        .number()
        .min(0, 'Benefits value cannot be negative'),
    description: z
        .string()
        .min(30, 'Description should be at least 30 characters'),
})

export type PlacementCTCFormData = z.infer<typeof placementCTCSchema>

interface PlacementCTCFormProps {
    onSubmit: (data: PlacementCTCFormData, reset: () => void) => void
    isLoading?: boolean
    defaultValues?: Partial<PlacementCTCFormData>
}

export default function PlacementCTCForm({
    onSubmit,
    isLoading = false,
    defaultValues,
}: PlacementCTCFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<PlacementCTCFormData>({
        resolver: zodResolver(placementCTCSchema),
        defaultValues: {
            name: '',
            campus: '',
            academicYear: '',
            base: 0,
            joiningBonus: 0,
            relocationBonus: 0,
            variableBonus: 0,
            monetaryValueOfBenefits: 0,
            description: '',
            ...defaultValues,
        },
    })

    // Watch all numeric fields to calculate total CTC
    const [
        base,
        joiningBonus,
        relocationBonus,
        variableBonus,
        monetaryValueOfBenefits,
    ] = watch([
        'base',
        'joiningBonus',
        'relocationBonus',
        'variableBonus',
        'monetaryValueOfBenefits',
    ])

    const totalCTC =
        (base || 0) +
        (joiningBonus || 0) +
        (relocationBonus || 0) +
        (variableBonus || 0) +
        (monetaryValueOfBenefits || 0)

    const campusOptions = [
        { value: 'PS', label: 'PS' },
        { value: 'Hyderabad', label: 'Hyderabad' },
        { value: 'Pilani', label: 'Pilani' },
        { value: 'Goa', label: 'Goa' },
        { value: 'Offcampus', label: 'Offcampus' },
    ]

    const academicYearOptions = placementYears.map((year) => ({
        value: year,
        label: year,
    }))

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <form
            onSubmit={handleSubmit((data) => onSubmit(data, reset))}
            className="space-y-8"
        >
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

                    <FormField label="Campus" required error={errors.campus}>
                        <SelectInput
                            registration={register('campus')}
                            options={campusOptions}
                            placeholder="Select campus"
                            error={errors.campus}
                        />
                    </FormField>

                    <FormField
                        label="Academic Year"
                        required
                        error={errors.academicYear}
                        className="md:col-span-2"
                    >
                        <SelectInput
                            registration={register('academicYear')}
                            options={academicYearOptions}
                            placeholder="Select academic year"
                            error={errors.academicYear}
                        />
                    </FormField>
                </div>
            </div>

            {/* Compensation Details Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                    Compensation Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Base Salary" required error={errors.base}>
                        <NumberInput
                            registration={register('base', {
                                valueAsNumber: true,
                            })}
                            placeholder="0"
                            min={0}
                            error={errors.base}
                        />
                    </FormField>

                    <FormField
                        label="Joining Bonus"
                        error={errors.joiningBonus}
                    >
                        <NumberInput
                            registration={register('joiningBonus', {
                                valueAsNumber: true,
                            })}
                            placeholder="0"
                            min={0}
                            error={errors.joiningBonus}
                        />
                    </FormField>

                    <FormField
                        label="Relocation Bonus"
                        error={errors.relocationBonus}
                    >
                        <NumberInput
                            registration={register('relocationBonus', {
                                valueAsNumber: true,
                            })}
                            placeholder="0"
                            min={0}
                            error={errors.relocationBonus}
                        />
                    </FormField>

                    <FormField
                        label="Variable Bonus"
                        error={errors.variableBonus}
                    >
                        <NumberInput
                            registration={register('variableBonus', {
                                valueAsNumber: true,
                            })}
                            placeholder="0"
                            min={0}
                            error={errors.variableBonus}
                        />
                    </FormField>

                    <FormField
                        label="Monetary Value of Benefits"
                        error={errors.monetaryValueOfBenefits}
                        className="md:col-span-2"
                        helpText="Note: ESOPs are not counted as monetary benefits. Only stocks are counted."
                    >
                        <NumberInput
                            registration={register('monetaryValueOfBenefits', {
                                valueAsNumber: true,
                            })}
                            placeholder="0"
                            min={0}
                            error={errors.monetaryValueOfBenefits}
                        />
                    </FormField>
                </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                    Description
                </h2>

                <FormField
                    label="Role Description"
                    required
                    error={errors.description}
                >
                    <TextArea
                        registration={register('description')}
                        placeholder="Enter description of the role and the CTC for this role..."
                        rows={6}
                        error={errors.description}
                    />
                </FormField>
            </div>

            {/* Total CTC Display */}
            <div className="bg-base-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2 text-base-content">
                    Total CTC
                </h3>
                <p className="text-3xl font-bold text-primary">
                    ₹{totalCTC.toLocaleString('en-IN')}
                </p>
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
                        'Submit CTC Details'
                    )}
                </button>
            </div>
        </form>
    )
}
