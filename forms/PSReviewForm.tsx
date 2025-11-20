import { PS1Item, PS2Item } from '@/types/PS'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField, TextArea } from './FormComponents'

const psReviewSchema = z.object({
    review: z.string().min(100, 'Review must be at least 100 characters long'),
})

export type PSReviewFormData = z.infer<typeof psReviewSchema>

interface PSReviewFormProps<T = PS1Item | PS2Item> {
    isPS1: boolean
    userResponses: T[]
    selectedResponse: T | null
    onResponseSelect: (response: T) => void
    onSubmit: (data: PSReviewFormData) => void
    isLoading: boolean
    isSubmitting?: boolean
    defaultValues?: Partial<PSReviewFormData>
}

export default function PSReviewForm<T extends PS1Item | PS2Item>({
    isPS1,
    userResponses,
    selectedResponse,
    onResponseSelect,
    onSubmit,
    isLoading,
    isSubmitting = false,
    defaultValues,
}: PSReviewFormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<PSReviewFormData>({
        resolver: zodResolver(psReviewSchema),
        defaultValues: {
            review: '',
            ...defaultValues,
        },
    })

    const review = watch('review')
    const psType = isPS1 ? 'PS1' : 'PS2'
    const addUrl = isPS1 ? '/ps/cutoffs/ps1' : '/ps/cutoffs/ps2'

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto"></div>
                <p className="text-gray-300 mt-4">Loading your responses...</p>
            </div>
        )
    }

    if (userResponses.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-white mb-4">
                    No {psType} Responses Found
                </h2>
                <p className="text-gray-300 mb-6">
                    You need to submit your {psType} responses before writing a
                    review.
                </p>
                <Link
                    href={addUrl}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold p-4 rounded-lg hover:scale-105 transition-transform"
                >
                    Submit {psType} Response
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField label={`Your ${psType} Responses`} className="mb-8">
                <div className="space-y-3">
                    {userResponses.map((response) => (
                        <div
                            key={response.id}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${
                                selectedResponse?.id === response.id
                                    ? 'bg-white/20 border-2 border-amber-400'
                                    : 'bg-white/10 border border-white/20 hover:bg-white/15'
                            }`}
                            onClick={() => onResponseSelect(response)}
                        >
                            <div className="font-semibold text-white">
                                {response.station}
                            </div>
                            <div className="text-sm text-gray-300">
                                Batch: {response.year_and_sem} | Round:{' '}
                                {response.allotment_round}
                            </div>
                            <div className="text-sm text-gray-300">
                                CGPA: {response.cgpa}
                            </div>
                            {!isPS1 && 'stipend' in response && (
                                <div className="text-sm text-gray-300">
                                    Stipend: ₹{response.stipend}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Review" required error={errors.review}>
                <TextArea
                    registration={register('review')}
                    placeholder={
                        selectedResponse
                            ? `Write your review for ${selectedResponse.station} (${selectedResponse.year_and_sem}, ${selectedResponse.allotment_round})`
                            : `Select a ${psType} response above to write a review...`
                    }
                    rows={8}
                    error={errors.review}
                />
            </FormField>

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={
                        isSubmitting || !selectedResponse || !review.trim()
                    }
                    className="btn btn-primary btn-lg min-w-48"
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Submitting...
                        </>
                    ) : (
                        'Add Review'
                    )}
                </button>
            </div>
        </form>
    )
}
