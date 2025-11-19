import AddPageLayout from '@/components/AddPageLayout'
import { FormField, SelectInput } from '@/components/FormField'
import SubmitButton from '@/components/SubmitButton'
import PSCutoffForm from '@/components/forms/PSCutoffForm'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPS1Response() {
    const router = useRouter()
    const { edit } = router.query
    const isEditMode = edit === 'true'

    const [idNumber, setIdNumber] = useState('')
    const [yearAndSem, setYearAndSem] = useState('')
    const [allotmentRound, setAllotmentRound] = useState('')
    const [station, setStation] = useState('')
    const [cgpa, setCGPA] = useState(0)
    const [preference, setPreference] = useState(1)
    const [isPublic, setIsPublic] = useState(true)
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
                setIdNumber(response.id_number || '')
                setYearAndSem(response.year_and_sem || '')
                setAllotmentRound(response.allotment_round || '')
                setStation(response.station || '')
                setCGPA(response.cgpa || 0)
                setPreference(response.preference || 1)
                setIsPublic(response.public === true)
                setResponseId(response.id)
            }
        } else {
            setIdNumber('')
            setYearAndSem('')
            setAllotmentRound('')
            setStation('')
            setCGPA(0)
            setPreference(1)
            setIsPublic(true)
            setResponseId(null)
        }
    }, [selectedResponse])

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

    const AddResponse = async () => {
        setIsLoading(true)

        if (ps1Years.indexOf(yearAndSem) === -1) {
            toast.error('Invalid Year, Please select from the dropdown!')
            setIsLoading(false)
            return
        }

        if (psAllotmentRounds.indexOf(allotmentRound) === -1) {
            toast.error(
                'Invalid Allotment Round, Please select from the dropdown!'
            )
            setIsLoading(false)
            return
        }

        if (!cgpa || !preference) {
            toast.error('Missing one of the fields: cgpa or preference!')
            setIsLoading(false)
            return
        }

        const endpoint = isEditMode
            ? '/api/ps/cutoffs/edit'
            : '/api/ps/cutoffs/add'
        const payload = {
            typeOfPS: 'ps1',
            idNumber: idNumber,
            yearAndSem: yearAndSem,
            allotmentRound: allotmentRound,
            station: station,
            cgpa: cgpa,
            preference: preference,
            public: isPublic ? 1 : 0,
            ...(isEditMode && responseId && { id: responseId }),
        }

        try {
            const res = await axiosInstance.post(endpoint, payload)

            const data = res.data
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success(
                    isEditMode
                        ? 'Your response was updated successfully!'
                        : 'Thank you! Your response was added successfully!'
                )

                setIdNumber('')
                setYearAndSem('')
                setAllotmentRound('')
                setStation('')
                setCGPA(0)
                setPreference(0)
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
                        <SelectInput
                            value={selectedResponse}
                            onChange={setSelectedResponse}
                            options={responseOptions}
                            placeholder="Select a response to edit"
                        />
                    ) : (
                        <div className="text-gray-300">
                            You do not have any responses to edit.
                        </div>
                    )}
                </FormField>
            )}

            <PSCutoffForm
                isPS1={true}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                yearAndSem={yearAndSem}
                setYearAndSem={setYearAndSem}
                station={station}
                setStation={setStation}
                cgpa={cgpa.toString()}
                setCgpa={(value) => setCGPA(parseFloat(value) || 0)}
                preference={preference.toString()}
                setPreference={(value) => setPreference(parseFloat(value) || 1)}
                allotmentRound={allotmentRound}
                setAllotmentRound={setAllotmentRound}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
            />

            <SubmitButton
                onClick={AddResponse}
                isLoading={isLoading}
                disabled={isEditMode && !selectedResponse}
                className="mt-6"
            >
                {isEditMode ? 'Update Response' : 'Add Response'}
            </SubmitButton>
        </AddPageLayout>
    )
}
