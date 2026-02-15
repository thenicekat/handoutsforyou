import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { Confession } from '@/types'
import { axiosInstance } from '@/utils/axiosCache'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Confessions() {
    const [isLoading, setIsLoading] = useState(true)
    const [confessions, setConfessions] = useState<Confession[]>([])
    const [replyInputs, setReplyInputs] = useState<Record<number, string>>({})
    const [expandedReplies, setExpandedReplies] = useState<
        Record<number, boolean>
    >({})

    const fetchConfessions = async () => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/confessions/get', {})
            if (res.data.error) {
                toast.error(res.data.message)
            } else {
                setConfessions(res.data.data)
            }
        } catch (error) {
            console.error('Error fetching confessions:', error)
            toast.error('Failed to fetch confessions')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReplyChange = (confessionId: number, value: string) => {
        setReplyInputs(prev => ({ ...prev, [confessionId]: value }))
    }

    const toggleReplies = (confessionId: number) => {
        setExpandedReplies(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId],
        }))
    }

    const submitReply = async (confessionId: number) => {
        const content = replyInputs[confessionId]
        if (!content || content.trim() === '') {
            toast.error('Reply cannot be empty')
            return
        }

        try {
            const res = await axiosInstance.post('/api/confessions/reply', {
                confessionId,
                content,
            })

            if (res.data.error) {
                toast.error(res.data.message)
            } else {
                toast.success('Reply added')
                setReplyInputs(prev => ({ ...prev, [confessionId]: '' }))

                const refreshRes = await axiosInstance.post(
                    '/api/confessions/get',
                    {}
                )
                if (!refreshRes.data.error) {
                    const updatedConfession = refreshRes.data.data.find(
                        (c: Confession) => c.id === confessionId
                    )
                    if (updatedConfession) {
                        setConfessions(prev =>
                            prev.map(c =>
                                c.id === confessionId
                                    ? {
                                          ...c,
                                          confession_replies:
                                              updatedConfession.confession_replies,
                                      }
                                    : c
                            )
                        )
                    }
                }
            }
        } catch (error) {
            console.error('Error adding reply:', error)
            toast.error('Failed to add reply')
        }
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    useEffect(() => {
        fetchConfessions()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('confessions')} />

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Confessions.
                    </h1>

                    <Menu />

                    <p className="text-center p-2 m-2 text-base-content/70">
                        Share your thoughts anonymously.
                    </p>

                    <div className="flex flex-col md:flex-row w-1/2 justify-center">
                        <Link
                            className="m-3 w-full hidden md:block"
                            href="/confessions/add"
                        >
                            <button
                                className="btn btn-outline w-full"
                                tabIndex={-1}
                            >
                                Write a Confession
                            </button>
                        </Link>
                    </div>

                    <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                        <Link className="m-3 w-full" href="/confessions/add">
                            <PlusCircleIcon />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="px-2 md:px-20 p-2">
                {isLoading ? (
                    <div className="grid place-items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-lg mt-4">Loading confessions...</p>
                    </div>
                ) : confessions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-base-content/70">
                            No confessions yet. Be the first to share!
                        </p>
                    </div>
                ) : (
                    confessions.map(confession => (
                        <div
                            key={confession.id}
                            className="card shadow-lg bg-base-100 break-words text-base-content mt-5"
                        >
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="badge badge-outline">
                                        #{confession.id}
                                    </span>
                                    <span className="text-sm text-base-content/50 italic">
                                        {formatDate(confession.created_at)}
                                    </span>
                                </div>

                                <p className="whitespace-pre-wrap">
                                    {confession.content}
                                </p>

                                {/* Replies Section */}
                                <div className="mt-4 pt-4 border-t border-base-300">
                                    <button
                                        onClick={() =>
                                            toggleReplies(confession.id)
                                        }
                                        className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                                    >
                                        <ChatBubbleLeftIcon className="h-4 w-4" />
                                        <span className="text-sm">
                                            {confession.confession_replies
                                                ?.length || 0}{' '}
                                            replies
                                        </span>
                                        <span className="text-xs">
                                            (
                                            {expandedReplies[confession.id]
                                                ? 'hide'
                                                : 'show'}
                                            )
                                        </span>
                                    </button>

                                    {expandedReplies[confession.id] && (
                                        <div className="mt-4">
                                            {confession.confession_replies &&
                                                confession.confession_replies
                                                    .length > 0 && (
                                                    <div className="space-y-3 mb-4">
                                                        {confession.confession_replies.map(
                                                            reply => (
                                                                <div
                                                                    key={
                                                                        reply.id
                                                                    }
                                                                    className="pl-4 border-l-2 border-primary/30"
                                                                >
                                                                    <p className="text-sm">
                                                                        {
                                                                            reply.content
                                                                        }
                                                                    </p>
                                                                    <span className="text-xs text-base-content/50 italic">
                                                                        {formatDate(
                                                                            reply.created_at
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Write a reply..."
                                                    value={
                                                        replyInputs[
                                                            confession.id
                                                        ] || ''
                                                    }
                                                    onChange={e =>
                                                        handleReplyChange(
                                                            confession.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter')
                                                            submitReply(
                                                                confession.id
                                                            )
                                                    }}
                                                    className="input input-bordered input-sm flex-1"
                                                />
                                                <button
                                                    onClick={() =>
                                                        submitReply(
                                                            confession.id
                                                        )
                                                    }
                                                    disabled={
                                                        !replyInputs[
                                                            confession.id
                                                        ]?.trim()
                                                    }
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CustomToastContainer containerId="confessions" />
        </>
    )
}
