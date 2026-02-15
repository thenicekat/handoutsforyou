import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'

const MAX_LENGTH = 2000

export default function AddConfession() {
    const router = useRouter()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error('Please write something')
            return
        }

        if (content.length > MAX_LENGTH) {
            toast.error(`Confession must be under ${MAX_LENGTH} characters`)
            return
        }

        setIsSubmitting(true)
        try {
            const res = await axiosInstance.post('/api/confessions/add', {
                content: content.trim(),
            })

            if (res.data.error) {
                toast.error(res.data.message)
            } else {
                toast.success('Confession posted!')
                router.push('/confessions')
            }
        } catch (error) {
            console.error('Error adding confession:', error)
            toast.error('Failed to post confession')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Meta {...getMetaConfig('confessions')} />

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        New Confession.
                    </h1>

                    <Menu />

                    <p className="text-center p-2 m-2 text-base-content/70">
                        Your identity will remain anonymous.
                    </p>

                    <div className="w-full max-w-xl">
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={8}
                            maxLength={MAX_LENGTH}
                            className="textarea textarea-bordered w-full"
                        />

                        <div className="flex items-center justify-between mt-2">
                            <span
                                className={`text-sm ${content.length > MAX_LENGTH * 0.9 ? 'text-warning' : 'text-base-content/50'}`}
                            >
                                {content.length}/{MAX_LENGTH}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                        <Link href="/confessions">
                            <button className="btn btn-outline" tabIndex={-1}>
                                Cancel
                            </button>
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Anonymously'}
                        </button>
                    </div>

                    <p className="text-center p-4 mt-6 text-base-content/50 text-xs max-w-md">
                        Your confession will be visible to everyone, but your
                        identity will never be revealed. Please be respectful.
                    </p>
                </div>
            </div>

            <CustomToastContainer containerId="addConfession" />
        </>
    )
}
