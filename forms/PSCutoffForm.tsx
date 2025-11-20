import { ps1Years, ps2Semesters, psAllotmentRounds } from '@/config/years_sems'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox, FormField, SelectInput, TextInput } from './FormComponents'

const basePSCutoffSchema = z.object({
    idNumber: z
        .string()
        .min(1, 'ID Number is required')
        .max(13, 'ID Number must be 13 digits or less'),
    yearAndSem: z
        .string()
        .min(1, 'Year/Semester is required')
        .refine(
            (val) => ps1Years.includes(val) || ps2Semesters.includes(val),
            'Please select a valid year/semester from the list'
        ),
    station: z.string().min(1, 'Station is required'),
    cgpa: z
        .float32()
        .min(0, 'CGPA must be positive')
        .max(10, 'CGPA cannot exceed 10'),
    preference: z.number().min(1, 'Preference must be at least 1'),
    allotmentRound: z
        .string()
        .min(1, 'Allotment Round is required')
        .refine(
            (val) => psAllotmentRounds.includes(val),
            'Please select a valid allotment round from the list'
        ),
    isPublic: z.boolean(),
})

// PS1 schema (no additional fields)
const ps1CutoffSchema = basePSCutoffSchema

// PS2 schema (with additional fields)
const ps2CutoffSchema = basePSCutoffSchema
    .extend({
        stipend: z
            .number()
            .min(0, 'Stipend must be positive')
            .max(1200000, 'Stipend seems too high'),
        offshoot: z.number().min(0, 'Offshoot must be positive'),
        offshootTotal: z.number().min(0, 'Offshoot Total must be positive'),
        offshootType: z.string().min(1, 'Offshoot Type is required'),
    })
    .refine((data) => data.offshoot <= data.offshootTotal, {
        message: 'Offshoot cannot be greater than Offshoot Total',
        path: ['offshoot'],
    })

export type PS1CutoffFormData = z.infer<typeof ps1CutoffSchema>
export type PS2CutoffFormData = z.infer<typeof ps2CutoffSchema>
export type PSCutoffFormData = PS1CutoffFormData | PS2CutoffFormData

interface PSCutoffFormProps {
    isPS1: boolean
    onSubmit: (data: any) => void
    isLoading?: boolean
    defaultValues?: Partial<PSCutoffFormData>
}

export default function PSCutoffForm({
    isPS1,
    onSubmit,
    isLoading = false,
    defaultValues,
}: PSCutoffFormProps) {
    const schema = isPS1 ? ps1CutoffSchema : ps2CutoffSchema

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PSCutoffFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            idNumber: '',
            yearAndSem: '',
            station: '',
            cgpa: 0,
            preference: 1,
            allotmentRound: '',
            isPublic: true,
            ...(isPS1
                ? {}
                : {
                      stipend: 0,
                      offshoot: 0,
                      offshootTotal: 0,
                      offshootType: '',
                  }),
            ...defaultValues,
        },
    })

    const yearOptions = isPS1
        ? ps1Years.map((year) => ({ value: year, label: year }))
        : ps2Semesters.map((sem) => ({ value: sem, label: sem }))

    const roundOptions = psAllotmentRounds.map((round) => ({
        value: round,
        label: round,
    }))

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="ID Number" required error={errors.idNumber}>
                <TextInput
                    registration={register('idNumber')}
                    placeholder="Enter your 13-digit ID number"
                    error={errors.idNumber}
                />
            </FormField>

            <FormField
                label={isPS1 ? 'Batch' : 'Year and Semester'}
                required
                error={errors.yearAndSem}
            >
                <SelectInput
                    registration={register('yearAndSem')}
                    options={yearOptions}
                    placeholder={
                        isPS1 ? 'Select Batch' : 'Select Year and Semester'
                    }
                    error={errors.yearAndSem}
                />
            </FormField>

            <FormField label="Station" required error={errors.station}>
                <TextInput
                    registration={register('station')}
                    placeholder="Enter station name"
                    error={errors.station}
                />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="CGPA" required error={errors.cgpa}>
                    <TextInput
                        type="number"
                        registration={register('cgpa', { valueAsNumber: true })}
                        placeholder="0.00"
                        error={errors.cgpa}
                    />
                </FormField>

                <FormField
                    label="Preference"
                    required
                    error={errors.preference}
                >
                    <TextInput
                        type="number"
                        registration={register('preference', {
                            valueAsNumber: true,
                        })}
                        placeholder="1"
                        error={errors.preference}
                    />
                </FormField>
            </div>

            <FormField
                label="Allotment Round"
                required
                error={errors.allotmentRound}
            >
                <SelectInput
                    registration={register('allotmentRound')}
                    options={roundOptions}
                    placeholder="Select Round"
                    error={errors.allotmentRound}
                />
            </FormField>

            {!isPS1 && (
                <>
                    <FormField
                        label="Stipend (₹)"
                        required
                        error={(errors as any).stipend}
                    >
                        <TextInput
                            type="number"
                            registration={register('stipend', {
                                valueAsNumber: true,
                            })}
                            placeholder="Enter stipend amount"
                            error={(errors as any).stipend}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            label="Offshoot"
                            required
                            error={(errors as any).offshoot}
                        >
                            <TextInput
                                type="number"
                                registration={register('offshoot', {
                                    valueAsNumber: true,
                                })}
                                placeholder="0"
                                error={(errors as any).offshoot}
                            />
                        </FormField>

                        <FormField
                            label="Offshoot Total"
                            required
                            error={(errors as any).offshootTotal}
                        >
                            <TextInput
                                type="number"
                                registration={register('offshootTotal', {
                                    valueAsNumber: true,
                                })}
                                placeholder="0"
                                error={(errors as any).offshootTotal}
                            />
                        </FormField>

                        <FormField
                            label="Offshoot Type"
                            required
                            error={(errors as any).offshootType}
                        >
                            <TextInput
                                registration={register('offshootType')}
                                placeholder="Type"
                                error={(errors as any).offshootType}
                            />
                        </FormField>
                    </div>
                </>
            )}

            <FormField label="">
                <Checkbox
                    registration={register('isPublic')}
                    label="Make this data public (helps other students)"
                />
            </FormField>

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
                        `Add ${isPS1 ? 'PS1' : 'PS2'} Response`
                    )}
                </button>
            </div>
        </form>
    )
}
