import { FormField, TextArea } from '@/components/FormField'
import { PS1Item } from '@/types/PS'
import Link from 'next/link'

interface PS1ReviewFormProps {
    userResponses: PS1Item[]
    selectedResponse: PS1Item | null
    onResponseSelect: (response: PS1Item) => void
    review: string
    setReview: (value: string) => void
    isLoading: boolean
}

export default function PS1ReviewForm({
    userResponses,
    selectedResponse,
    onResponseSelect,
    review,
    setReview,
    isLoading
}: PS1ReviewFormProps) {
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
                    No PS1 Responses Found
                </h2>
                <p className="text-gray-300 mb-6">
                    You need to submit your PS1 responses before writing a review.
                </p>
                <Link
                    href="/ps/cutoffs/ps1"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
                >
                    Submit PS1 Response
                </Link>
            </div>
        )
    }

    return (
        <>
            <FormField label="Your PS1 Responses" className="mb-8">
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
                                Batch: {response.year_and_sem} | Round: {response.allotment_round}
                            </div>
                            <div className="text-sm text-gray-300">
                                CGPA: {response.cgpa}
                            </div>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Review" required>
                <TextArea
                    value={review}
                    onChange={setReview}
                    placeholder={
                        selectedResponse
                            ? `Write your review for ${selectedResponse.station} (${selectedResponse.year_and_sem}, ${selectedResponse.allotment_round})`
                            : `Select a PS1 response above to write a review...`
                    }
                    rows={8}
                />
            </FormField>
        </>
    )
}

