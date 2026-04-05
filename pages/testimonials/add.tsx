import { getMetaConfig } from '@/config/meta'
import AddPageLayout from '@/layout/AddPage'
import { axiosInstance } from '@/utils/axiosCache'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const TOAST = { containerId: 'addTestimonials' } as const

export default function AddTestimonial() {
    const router = useRouter()
    const { userId } = router.query

    const [testimonial, setTestimonial] = useState('')
    const [pendingAction, setPendingAction] = useState<
        null | 'single' | 'split'
    >(null)

    useEffect(() => {
        void axiosInstance.get('/api/auth/check')
    }, [])

    const AddTestimonial = async () => {
        if (!userId || typeof userId !== 'string') {
            toast.error('You need a user id in the URL.', TOAST)
            return
        }
        if (!testimonial.trim()) {
            toast.error('Please write your testimonial.', TOAST)
            return
        }

        setPendingAction('single')
        toast.info(
            'Sending your testimonial. Wait for the success message…',
            TOAST
        )
        try {
            const data = await fetch('/api/testimonials/add', {
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    testimonial,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const res = await data.json()
            if (res.error) {
                toast.error(res.message, TOAST)
            } else {
                toast.success(
                    'Thank you! Your testimonial was added successfully!',
                    TOAST
                )
                setTestimonial('')
            }
        } catch {
            toast.error('Something went wrong. Try again.', TOAST)
        } finally {
            setPendingAction(null)
        }
    }

    const AddTestimonialSets = async () => {
        if (!userId || typeof userId !== 'string') {
            toast.error('You need a user id in the URL.', TOAST)
            return
        }
        if (!testimonial.trim()) {
            toast.error('Please write your testimonial.', TOAST)
            return
        }

        setPendingAction('split')
        const sets: string[] = []
        let remainingText = testimonial

        while (remainingText.length > 0) {
            if (remainingText.length <= 490) {
                sets.push(remainingText)
                break
            }

            let cutIndex = 490
            while (cutIndex > 0 && remainingText[cutIndex] !== ' ') {
                cutIndex--
            }
            if (cutIndex === 0) {
                cutIndex = 490
            }
            sets.push(remainingText.substring(0, cutIndex))
            remainingText = remainingText.substring(cutIndex).trim()
        }

        let successCount = 0
        let hasError = false

        try {
            for (let i = 0; i < sets.length; i++) {
                const partNumber = `[${i + 1}/${sets.length}] `
                const testimonialWithPart = partNumber + sets[i]

                const data = await fetch('/api/testimonials/add', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId,
                        testimonial: testimonialWithPart,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
                const res = await data.json()
                if (res.error) {
                    toast.error(
                        `Part ${i + 1}/${sets.length}: ${res.message}`,
                        TOAST
                    )
                    hasError = true
                } else {
                    successCount++
                    toast.success(`Part ${i + 1}/${sets.length} sent.`, TOAST)
                }
            }

            if (hasError) {
                toast.warning(
                    `Sent ${successCount} of ${sets.length} parts.`,
                    TOAST
                )
            } else if (sets.length > 1) {
                toast.success(`All ${sets.length} parts sent.`, TOAST)
                setTestimonial('')
            } else {
                toast.success(
                    'Thank you! Your review was added successfully!',
                    TOAST
                )
                setTestimonial('')
            }
        } catch {
            toast.error('Something went wrong while sending parts.', TOAST)
        } finally {
            setPendingAction(null)
        }
    }

    const userIdReady = typeof userId === 'string' && userId.length > 0
    const overYearbookHint = testimonial.length > 500

    return (
        <AddPageLayout
            title="Add Testimonial"
            metaConfig={getMetaConfig('testimonials')}
            containerId="addTestimonials"
        >
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="text-base-content/60">Writing for</span>
                    <kbd className="kbd kbd-sm font-mono text-sm">
                        {userIdReady ? userId : '—'}
                    </kbd>
                </div>

                <div role="note" className="alert alert-info py-3">
                    <div className="text-sm text-left space-y-1">
                        <p>
                            Wrapper on the yearbook site. Yearbook enforces ~500
                            characters per block; longer text may not print
                            fully unless you split.
                        </p>
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label pt-0" htmlFor="testimonial-body">
                        <span className="label-text font-medium">
                            Your testimonial
                        </span>
                    </label>
                    <textarea
                        id="testimonial-body"
                        className="textarea textarea-bordered w-full min-h-[14rem] text-base leading-relaxed focus:textarea-primary"
                        placeholder="Write something kind and true…"
                        onChange={e => setTestimonial(e.target.value)}
                        value={testimonial}
                    />
                    <div className="label">
                        <span className="label-text-alt text-base-content/60">
                            {testimonial.length} characters
                        </span>
                        {overYearbookHint ? (
                            <span className="label-text-alt text-warning">
                                Over ~500 — use split send below
                            </span>
                        ) : (
                            <span className="label-text-alt text-base-content/40">
                                Yearbook ~500 / block
                            </span>
                        )}
                    </div>
                </div>

                <div className="collapse collapse-arrow bg-base-200/60 rounded-lg border border-base-content/5">
                    <input type="checkbox" aria-label="How to find user id" />
                    <div className="collapse-title text-sm font-medium min-h-0 py-3">
                        How to find your user ID?
                    </div>
                    <div className="collapse-content text-sm text-base-content/80 pb-3">
                        <p>
                            To find your user id, you can ask anyone you sent a
                            request to, to click the write-for-you button — a
                            number shows in the URL bar. You can also ask a
                            junior or senior to send the URL they got; the id is
                            usually easy to spot there.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                        type="button"
                        className="btn btn-primary sm:min-w-[11rem]"
                        onClick={AddTestimonial}
                        disabled={pendingAction !== null || !userIdReady}
                    >
                        {pendingAction === 'single' ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline sm:min-w-[11rem]"
                        onClick={AddTestimonialSets}
                        disabled={
                            pendingAction !== null ||
                            !userIdReady ||
                            testimonial.length < 500
                        }
                        title="Splits near 500 characters and sends each part with a part label"
                    >
                        {pendingAction === 'split' ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Split &amp; send (~500 each)
                    </button>
                </div>
            </div>
        </AddPageLayout>
    )
}
