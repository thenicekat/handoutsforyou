import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import Modal from '@/components/Modal'

import { getMetaConfig } from '@/config/meta'
import { CoursePreReqGroup } from '@/types/Courses'
import axiosInstance from '@/utils/axiosCache'
import { MONETAG_INTERSTITIAL_BANNER_INLINE } from '@/utils/monetagExtraInline'
import { GetStaticProps } from 'next'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export const getStaticProps: GetStaticProps = async () => {
    const fs = require('fs')

    let prereqs = fs.readFileSync('./public/prereqs.json').toString()
    prereqs = JSON.parse(prereqs)

    return {
        props: {
            prereqs,
        },
    }
}

export default function Prereqs({ prereqs }: { prereqs: CoursePreReqGroup[] }) {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)
    const [prereq, setPrereq] = useState<CoursePreReqGroup | null>(null)

    const toggleModal = () => {
        setOpen(!open)
    }

    useEffect(() => {
        async function checkAuth() {
            await axiosInstance.get('/api/auth/check')
        }
        checkAuth()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('courses/prereqs')} />

            {MONETAG_INTERSTITIAL_BANNER_INLINE && (
                <Script
                    id="monetag-interstitial-banner-inline-prereqs"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: MONETAG_INTERSTITIAL_BANNER_INLINE,
                    }}
                />
            )}

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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <p className="text-center m-2">
                NOTE: Here PRE means you will have to complete before hand while
                CO means you can do them parallelly
            </p>
            <div className="grid md:grid-cols-3 place-items-center p-5">
                <Modal open={open}>
                    <h3 className="font-bold text-lg">{prereq?.name}</h3>
                    <div className="card-actions justify-begin text-primary my-3">
                        {prereq && prereq.prereqs.length > 0 ? (
                            prereq.prereqs.map((preq) => (
                                <>
                                    <li key={preq.prereq_name}>
                                        {preq.prereq_name} ({preq.pre_cop})
                                    </li>
                                </>
                            ))
                        ) : (
                            <p>No Prerequisites</p>
                        )}
                        {prereq?.all_one && (
                            <>
                                Note: You will have to do{' '}
                                <b>{prereq?.all_one.toLowerCase()}</b> of the
                                above courses
                            </>
                        )}
                        <br />
                    </div>
                    <div className="modal-action">
                        <label
                            className="btn btn-primary"
                            onClick={() => toggleModal()}
                        >
                            Close
                        </label>
                    </div>
                </Modal>

                {prereqs
                    .filter((d: CoursePreReqGroup) =>
                        d.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((preqgroup: CoursePreReqGroup) => (
                        <div
                            className="card w-11/12 bg-secondary text-neutral-content m-2 cursor-grab"
                            key={preqgroup.name}
                            onClick={() => {
                                toggleModal()
                                setPrereq(preqgroup)
                            }}
                        >
                            <div className="card-body items-center">
                                <h2 className="card-title text-primary">
                                    {preqgroup.name}
                                </h2>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}
