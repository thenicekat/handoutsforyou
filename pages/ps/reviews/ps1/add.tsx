import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { PS1Item } from '@/types/PS'
import { axiosInstance } from '@/utils/axiosCache'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPS1Review() {
    const [userResponses, setUserResponses] = useState([] as PS1Item[])
    const [PSType, setPSType] = useState('')
    const [PSBatch, setPSBatch] = useState('')
    const [PSStation, setPSStation] = useState('')
    const [PSReview, setPSReview] = useState('')
    const [PSAllotmentRound, setPSAllotmentRound] = useState('')
    const [selectedResponse, setSelectedResponse] = useState<PS1Item | null>(
        null
    )
    const [isLoading, setIsLoading] = useState(true)

    const fetchUserResponses = async () => {
        setIsLoading(true)
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
            setIsLoading(false)
        }
    }

    const handleResponseSelect = (response: PS1Item) => {
        setSelectedResponse(response)
        setPSType('PS1')
        setPSBatch(response.year_and_sem)
        setPSStation(response.station)
        setPSAllotmentRound(response.allotment_round)
    }

    const AddReview = async () => {
        if (!PSType || !PSBatch || !PSStation) {
            toast.error('Please fill in all PS details')
            return
        }
        if (!PSReview) {
            toast.error('Review cannot be empty!')
            return
        }
        try {
            const response = await axiosInstance.post('/api/ps/reviews/add', {
                type: PSType,
                batch: PSBatch,
                station: PSStation,
                review: PSReview,
                allotment_round: PSAllotmentRound,
            })
            const res = response.data
            if (res.error) {
                toast.error(res.message)
            } else {
                toast.success('Thank you! Your review was added successfully!')
                setPSReview('')
                setPSType('')
                setPSBatch('')
                setPSStation('')
                setPSAllotmentRound('')
                setSelectedResponse(null)
                window.location.href = '/ps'
            }
        } catch (error) {
            console.error('Error adding review:', error)
            toast.error('Failed to add review')
        }
    }

    useEffect(() => {
        fetchUserResponses()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('ps/reviews/ps1')} />
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        PS Reviews.
                    </h1>

                    <Menu />

                    <>
                        {isLoading ? (
                            <div className="grid place-items-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-lg mt-4">
                                    Loading your responses...
                                </p>
                            </div>
                        ) : userResponses.length === 0 ? (
                            <div className="text-center py-16">
                                <h2 className="text-2xl font-bold mb-4">
                                    No PS1 Responses Found
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to submit your PS1 responses before
                                    writing a review.
                                </p>
                                <Link
                                    href="/ps/cutoffs/ps1"
                                    className="btn btn-primary"
                                >
                                    Submit PS1 Response
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="w-full max-w-xl mb-8">
                                    <h2 className="text-2xl mb-4">
                                        Your PS1 Responses
                                    </h2>
                                    <div className="space-y-4">
                                        {userResponses.map((response) => (
                                            <div
                                                key={response.id}
                                                className={`p-4 border rounded-lg cursor-pointer bg-black ${selectedResponse?.id === response.id ? 'bg-black/70' : ''}`}
                                                onClick={() =>
                                                    handleResponseSelect(
                                                        response
                                                    )
                                                }
                                            >
                                                <div className="font-semibold">
                                                    {response.station}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Batch:{' '}
                                                    {response.year_and_sem} |
                                                    Round:{' '}
                                                    {response.allotment_round}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    CGPA: {response.cgpa}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center w-full m-2 h-60">
                                    <textarea
                                        className="textarea textarea-primary w-full max-w-xl h-full"
                                        placeholder={
                                            selectedResponse
                                                ? 'You are writing a review for the following PS1 response: ' +
                                                  selectedResponse?.station +
                                                  ' ' +
                                                  selectedResponse?.year_and_sem +
                                                  ' ' +
                                                  selectedResponse?.allotment_round
                                                : 'Select a PS1 response to write a review...'
                                        }
                                        onChange={(e) =>
                                            setPSReview(e.target.value)
                                        }
                                        value={PSReview}
                                    ></textarea>
                                </div>

                                <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                    <button
                                        className="btn btn-primary"
                                        onClick={AddReview}
                                    >
                                        Add Review
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                </div>
            </div>
            <CustomToastContainer containerId="addPSReview" />
        </>
    )
}
