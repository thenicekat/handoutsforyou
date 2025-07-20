import { getMetaConfig } from '@/config/meta'
import Meta from '@/components/Meta'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { use, useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import { SI_Chronicle } from '../../../types/SIData'

export default function ChroniclePage() {
    const router = useRouter()
    const { slug } = router.query

    const [chronicles, setChronicles] = useState<SI_Chronicle[]>([])

    const fetchChronicles = async () => {
        const res = await fetch(`/api/si/chronicles/data`, {
            method: 'POST',
            body: JSON.stringify({
                slug: slug,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (res.status !== 400) {
            const data = await res.json()
            if (data.error) {
                alert(data.message)
                return
            } else setChronicles(data.data)
        }
    }

    useEffect(() => {
        if (slug) fetchChronicles()
    }, [slug])

    return (
        <>
            <Meta {...getMetaConfig('si')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[15px] text-primary">
                        Summer Internships.
                    </h1>

                    <Menu />
                </div>
                <div className="w-[70vw] place-items-center flex flex-col justify-between m-2">
                    NOTE: This content was scrapped from SI Chronicles and
                    belongs to Placement Unit
                </div>
            </div>
            <div className="place-items-center p-5">
                {chronicles.map((chron) => (
                    <div
                        className="card shadow-lg break-words bg-base-100 text-base-content mt-5"
                        key={chron.name}
                    >
                        <div className="card-body">
                            <h2 className="card-title text-center">
                                Name: {chron.name} | CGPA: {chron.cgpa}
                            </h2>
                            {chron.text}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
