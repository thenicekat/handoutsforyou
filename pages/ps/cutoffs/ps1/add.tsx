import AddPageLayout from '@/components/AddPageLayout'
import { getMetaConfig } from '@/config/meta'
import { FormField } from '@/forms/FormComponents'
import PSCutoffForm, { PS1CutoffFormData } from '@/forms/PSCutoffForm'
import { axiosInstance } from '@/utils/axiosCache'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPS1Response() {
    const router = useRouter()
    const { edit } = router.query
    const isEditMode = edit === 'true'

    const [responseId, setResponseId] = useState<number | null>(null)

    const [userResponses, setUserResponses] = useState<any[]>([])
    const [selectedResponse, setSelectedResponse] = useState<string>('')

    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingResponses, setIsFetchingResponses] = useState(false)

    useEffect(() => {
        if (isEditMode) {
            fetchUserResponses()
        }
    }, [isEditMode])

    useEffect(() => {
        if (selectedResponse) {
            const response = userResponses.find(
                (r) => r.id.toString() === selectedResponse
            )
            if (response) {
                setResponseId(response.id)
            }
        } else {
            setResponseId(null)
        }
    }, [selectedResponse, userResponses])

    const fetchUserResponses = async () => {
        setIsFetchingResponses(true)
        try {
            const response = await axiosInstance.post('/api/ps/cutoffs/get', {
                type: 'ps1',
            })

            if (response.status === 200) {
                const data = response.data
                if (!data.error) {
                    setUserResponses(data.data)
                } else {
                    toast.error(data.message)
                }
            } else {
                toast.error('Failed to fetch your responses')
            }
        } catch (error) {
            console.error('Error fetching user responses:', error)
            toast.error('An error occurred while fetching your responses')
        } finally {
            setIsFetchingResponses(false)
        }
    }

    const handleSubmit = async (data: PS1CutoffFormData) => {
        setIsLoading(true)

        const endpoint = isEditMode
            ? '/api/ps/cutoffs/edit'
            : '/api/ps/cutoffs/add'
        const payload = {
            typeOfPS: 'ps1',
            idNumber: data.idNumber,
            yearAndSem: data.yearAndSem,
            allotmentRound: data.allotmentRound,
            station: data.station,
            cgpa: data.cgpa,
            preference: data.preference,
            public: data.isPublic ? 1 : 0,
            ...(isEditMode && responseId && { id: responseId }),
        }

        try {
            const res = await axiosInstance.post(endpoint, payload)

            const result = res.data
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    isEditMode
                        ? 'Your response was updated successfully!'
                        : 'Thank you! Your response was added successfully!'
                )

                setResponseId(null)
                setSelectedResponse('')

                window.location.href = '/ps/cutoffs/ps1/'
            }
        } catch (error) {
            console.error('Error adding/updating PS1 response:', error)
            toast.error('Failed to save response')
        }
        setIsLoading(false)
    }

    const responseOptions = userResponses.map((response) => ({
        value: response.id.toString(),
        label: `${response.station} - ${response.year_and_sem} - ${response.allotment_round}`,
    }))

    return (
        <AddPageLayout
            title={isEditMode ? 'Edit PS1 Response' : 'Add PS1 Response'}
            metaConfig={getMetaConfig('ps/cutoffs/ps1')}
            containerId="addPS1Response"
        >
            {isEditMode && (
                <FormField label="Select Response to Edit" className="mb-6">
                    {isFetchingResponses ? (
                        <div className="text-gray-300">
                            Loading your responses...
                        </div>
                    ) : userResponses.length > 0 ? (
                        <select
                            value={selectedResponse}
                            onChange={(e) =>
                                setSelectedResponse(e.target.value)
                            }
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="" className="bg-gray-800">
                                Select a response to edit
                            </option>
                            {responseOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className="bg-gray-800"
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="text-gray-300">
                            You do not have any responses to edit.
                        </div>
                    )}
                </FormField>
            )}

            <PSCutoffForm
                isPS1={true}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                defaultValues={
                    selectedResponse
                        ? (() => {
                              const response = userResponses.find(
                                  (r) => r.id.toString() === selectedResponse
                              )
                              return response
                                  ? {
                                        idNumber: response.id_number || '',
                                        yearAndSem: response.year_and_sem || '',
                                        allotmentRound:
                                            response.allotment_round || '',
                                        station: response.station || '',
                                        cgpa: response.cgpa || 0,
                                        preference: response.preference || 1,
                                        isPublic: response.public === true,
                                    }
                                  : undefined
                          })()
                        : undefined
                }
            />
        </AddPageLayout>
    )
}
