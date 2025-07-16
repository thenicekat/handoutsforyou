import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { use, useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import { SI_Chronicle } from '../../../types/SIData'
import { axiosInstance } from '@/utils/axiosCache'

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
            console.error('Error fetching chronicles:', error)
            alert('Failed to fetch chronicles data')
        }
    }

    useEffect(() => {
        if (slug) fetchChronicles()
    }, [slug])

    return (
        <>
            <Head>
                <title>Summer Internships.</title>
                <meta
                    name="description"
                    content="One stop place for your PS queries, handouts, and much more"
                />
                <meta
                    name="keywords"
                    content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[15px] text-primary">
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
