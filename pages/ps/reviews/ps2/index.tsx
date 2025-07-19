import { getMetaConfig } from '@/config/meta'
import Meta from '@/components/Meta'
import { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Link from 'next/link'
import CustomToastContainer from '@/components/ToastContainer'
import { toast } from 'react-toastify'
import { PS_Review } from '@/types/PSData'
import { axiosInstance } from '@/utils/axiosCache'

export default function PS2Reviews() {
    const [station, setStation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [reviews, setReviews] = useState([] as PS_Review[])

    const fetchReviews = async () => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/ps/reviews/get', {
                type: 'PS2'
            })
            if (response.status !== 400) {
                const res = response.data
                if (res.error && res.status !== 400) {
                    toast.error(res.message)
                    setIsLoading(false)
                } else {
                    let reviews: PS_Review[] = res.data as PS_Review[]
                    reviews = reviews.sort((a, b) => {
                        if (a.station > b.station) return 1
                        else if (a.station < b.station) return -1
                        else return 0
                    })
                    setReviews(reviews)
                    setIsLoading(false)
                }
            }
        } catch (error) {
            console.error('Error fetching PS2 reviews:', error)
            toast.error('Failed to fetch reviews')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('ps/reviews/ps2')} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary text-center mb-8">
                        PS2 Reviews
                    </h1>
                    <Menu />

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="flex items-center gap-4 w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search station..."
                                className="input input-bordered input-primary flex-1"
                                onChange={(e) => setStation(e.target.value)}
                            />
                            <Link
                                href="/ps/reviews/ps2/add/"
                                className="btn btn-primary"
                            >
                                Add Review
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <h2 className="text-2xl font-semibold text-primary">
                            Total Reviews: {reviews.length}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {!isLoading ? (
                            reviews
                                .filter((review) =>
                                    review.station
                                        .toLowerCase()
                                        .includes(station.toLowerCase())
                                )
                                .map((review) => (
                                    <div
                                        className="card shadow-lg bg-base-100 break-words text-base-content"
                                        key={review.created_at}
                                    >
                                        <div className="card-body">
                                            <h2 className="card-title text-center">
                                                Station Name: {review.station}{' '}
                                                Batch: {review.batch}
                                            </h2>
                                            <p className="whitespace-pre-wrap">
                                                {review.review}
                                            </p>
                                            <p className="text-sm text-base-content/70 mt-2">
                                                Submitted at:{' '}
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleString('en-IN', {})}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="flex justify-center">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CustomToastContainer containerId="ps2Reviews" />
        </>
    )
}
