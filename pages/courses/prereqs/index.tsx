import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import Modal from '@/components/Modal'
import { getMetaConfig } from '@/config/meta'
import { CoursePreReqGroup, PrereqItem, NestedPrereqNode, ExtendedCoursePreReqGroup } from '@/types'
import axiosInstance from '@/utils/axiosCache'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

export const getStaticProps: GetStaticProps = async () => {
    const fs = require('fs')
    let prereqs = fs.readFileSync('./public/prereqs.json').toString()
    prereqs = JSON.parse(prereqs)
    return {
        props: { prereqs },
    }
}

const PrerequisiteRenderer = ({
    node,
}: {
    node: PrereqItem | NestedPrereqNode
}) => {
    if (!node) return null

    if ('prereq_name' in node) {
        const isPre = node.pre_cop.toUpperCase().includes('PRE')
        return (
            <div className="flex items-center gap-2 p-2 bg-gray-200/10 rounded-lg border border-base-300 shadow-sm my-1">
                <span
                    className={`badge ${isPre ? 'badge-warning' : 'badge-info'} badge-sm font-bold mx-1`}
                >
                    {isPre ? 'PRE' : 'CO'}
                </span>
                <span className="font-semibold text-base-content">
                    {node.prereq_name}
                </span>
            </div>
        )
    }

    if (node.type && Array.isArray(node.items)) {
        const isOr = node.type === 'OR'

        return (
            <div
                className={`flex flex-col gap-2 p-3 rounded-xl ${isOr ? 'bg-base-100 border-2 border-dashed border-primary/30 relative mt-4' : ''}`}
            >
                {isOr && (
                    <span className="absolute -top-3 left-4 bg-primary text-primary-content text-xs px-2 py-1 rounded-full font-bold">
                        COMPLETE ONE OF:
                    </span>
                )}

                {node.items.map((it, idx) => (
                    <div key={idx} className="w-full">
                        <PrerequisiteRenderer node={it} />
                        {!isOr && idx < node.items.length - 1 && (
                            <div className="flex mt-3 justify-center py-1 opacity-90">
                                <span className="text-lg bg-primary text-primary-content font-bold tracking-widest rounded-full px-3">
                                    • AND •
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export default function Prereqs({
    prereqs,
}: {
    prereqs: ExtendedCoursePreReqGroup[]
}) {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)
    const [prereq, setPrereq] = useState<ExtendedCoursePreReqGroup | null>(null)

    const toggleModal = () => setOpen(!open)

    useEffect(() => {
        async function checkAuth() {
            await axiosInstance.get('/api/auth/check')
        }
        checkAuth()
    }, [])

    const filteredPrereqs = prereqs.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    )

    const requirementText = prereq
        ? (prereq.completion_requirement || '').toUpperCase() ||
            ((prereq.prereqs_nested || (prereq.prereqs && prereq.prereqs.length > 0)) ? 'ALL' : null)
        : null

    return (
        <div>
            <Meta {...getMetaConfig('courses/prereqs')} />

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Prereqs.
                    </h1>

                    <Menu />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6 mb-2 text-xs md:text-sm mt-8 bg-base-300/50 rounded-lg py-4 px-4 md:px-6 w-fit mx-auto max-w-full md:max-w-none">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="font-semibold text-white">PRE:</span>
                    <span className="text-gray-300">Must complete before</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="font-semibold text-white">CO:</span>
                    <span className="text-gray-300">Can take parallelly</span>
                </div>
            </div>

            {/* --- Grid Section --- */}
            <div className="container mx-auto px-4 py-8">
                {filteredPrereqs.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl">
                            No courses found matching &quot;{search}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-stretch">
                        {filteredPrereqs.map(preqgroup => {
                            const hasReqs =
                                (preqgroup.prereqs &&
                                    preqgroup.prereqs.length > 0) ||
                                preqgroup.prereqs_nested

                            return (
                                <div
                                    key={preqgroup.name}
                                    onClick={() => {
                                        setPrereq(preqgroup)
                                        toggleModal()
                                    }}
                                    className="group card bg-base-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-base-200"
                                >
                                    <div className="card-body p-6 flex flex-col justify-between h-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="card-title text-lg font-bold text-primary group-hover:text-primary-focus">
                                                {preqgroup.name}
                                            </h2>
                                            <BookOpenIcon className="h-6 w-6" />
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            {hasReqs ? (
                                                <div className="badge badge-outline gap-1">
                                                    View Reqs
                                                </div>
                                            ) : (
                                                <div className="badge badge-ghost opacity-50">
                                                    Open
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Modal open={open}>
                {prereq && (
                    <div className="relative">
                        <div className="border-b border-base-200 pb-4 mb-4">
                            <h3 className="font-extrabold text-2xl text-primary">
                                {prereq.name}
                            </h3>
                            <p className="text-sm opacity-60 mt-1">
                                Prerequisite Tree
                            </p>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {requirementText && (
                                <div className="alert alert-info shadow-sm mb-4">
                                    <span>
                                        Requirement: Complete{' '}
                                        <b>{requirementText}</b> of the
                                        following.
                                    </span>
                                </div>
                            )}
                            {prereq.prereqs_nested ? (
                                <div className="space-y-2">
                                    <PrerequisiteRenderer
                                        node={prereq.prereqs_nested}
                                    />
                                </div>
                            ) : prereq.prereqs && prereq.prereqs.length > 0 ? (
                                <div className="space-y-2">
                                    {prereq.prereqs.map((preq, idx) => (
                                        <PrerequisiteRenderer
                                            key={idx}
                                            node={preq}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-80 bg-base-200 rounded-xl border border-dashed border-base-300">
                                    <span className="text-4xl mb-2">🎉</span>
                                    <p className="font-medium">
                                        No Prerequisites required!
                                    </p>
                                    <p className="text-sm">
                                        You can register for this directly.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="modal-action pt-4">
                            <button
                                className="btn btn-primary btn-block rounded-full"
                                onClick={toggleModal}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
