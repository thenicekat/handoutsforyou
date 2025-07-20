import { Resource } from '@/types/Resource'
import {
    CursorArrowRippleIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/solid'
import React from 'react'
import { toast } from 'react-toastify'
import { axiosInstance } from '@/utils/axiosCache'

type Props = {
    resource: Resource
    incrementEP: string
}

export default function CardWithScore({ resource, incrementEP }: Props) {
    const incrementScore = async (id: number, shouldOpen: boolean) => {
        try {
            const res = await axiosInstance.get(`${incrementEP}?id=${id}`)
            const data = res.data
            if (data.error) {
                toast(data.message)
            } else {
                if (shouldOpen) window.open(data.data[0].link, '_blank')
            }
        } catch (error) {
            console.error('Error incrementing score:', error)
            toast('Failed to increment score')
        }
    }

    return (
        <div
            className="card w-72 h-96 bg-base-100 text-base-content m-2"
            key={resource.name}
        >
            <div className="card-body">
                <h2 className="text-sm font-bold uppercase">
                    {resource.created_by}
                </h2>
                <h2 className="text-md font-bond uppercase flex">
                    {resource.score} Clicks{' '}
                    <CursorArrowRippleIcon className="w-4 h-4 m-1" />
                </h2>
                <p className="text-lg">{resource.name.toUpperCase()}</p>

                <div className="flex">
                    <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={() => {
                            toast.info('Opening resource!')
                            incrementScore(resource.id, true)
                        }}
                    >
                        View
                    </button>

                    <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={() => {
                            incrementScore(resource.id, false)
                            navigator.clipboard.writeText(resource.link)
                            toast.info('Link copied!')
                        }}
                    >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
