import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { getMetaConfig } from '@/config/meta'
import { axiosInstance } from '@/utils/axiosCache'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SI_Chronicle } from '../../../types/SIData'

export default function ChroniclePage() {
    const router = useRouter()
    const { slug } = router.query

    const [chronicles, setChronicles] = useState<SI_Chronicle[]>([])

    const fetchChronicles = async () => {
        try {
            const res = await axiosInstance.post(`/api/si/chronicles/data`, {
                slug: slug,
            })
            if (res.status !== 400) {
                const data = res.data
                if (data.error) {
                    alert(data.message)
                    return
                } else setChronicles(data.data)
            }
        } catch (error) {
            alert('Failed to fetch chronicles data')
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
