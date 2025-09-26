import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { SI_Company } from '@/types/SIData'
import { axiosInstance } from '@/utils/axiosCache'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function SICompanies() {
    const [search, setSearch] = useState('')

    const yearReferences = ['2023-2024', '2022-2023', '2021-2022', '2020-2021']
    const [yearRef, setYearRef] = useState(yearReferences[0])

    const [isLoading, setIsLoading] = useState(false)
    const [SIData, setSIData] = useState([])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/api/zob/companies/get', {
                year: yearRef,
            })

            if (res.status !== 400) {
                const data = res.data
                if (data.error) {
                    toast(data.message)
                    return
                } else {
                    setSIData(data.data)
                }
            }
        } catch (error) {
            console.error('Error fetching SI companies:', error)
            toast('Failed to fetch companies data')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [yearRef])

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
                    <>
                        <input
                            type="text"
                            placeholder="Search for Company..."
                            className="input input-secondary w-full max-w-xs m-3"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={(e) => setYearRef(e.target.value)}
                        >
                            <option disabled selected>
                                Select Year?
                            </option>
                            {yearReferences.map((year) => (
                                <option
                                    value={year}
                                    key={year}
                                    selected={yearRef == year}
                                >
                                    {year}
                                </option>
                            ))}
                        </select>

                        <Link className="m-3" href={'/zob/resources'}>
                            <button
                                className="btn btn-outline w-full"
                                tabIndex={-1}
                            >
                                Are you looking for resources?
                            </button>
                        </Link>
                    </>
                </div>

                <div className="w-[70vw] place-items-center flex flex-col justify-between m-2">
                    NOTE: This content was scrapped from SI Chronicles and
                    belongs to Placement Unit
                </div>
            </div>
            <div>
                <div className="px-2 md:px-20">
                    {!isLoading ? (
                        SIData.filter(
                            (d: SI_Company) =>
                                d.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                d.roles
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                        ).map((station: SI_Company) => (
                            <div
                                className="collapse collapse-plus py-1 m-2 rounded-xl bg-secondary"
                                key={station.name + station.roles}
                            >
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title bg-secondary text-primary font-bold text-lg">
                                    {station.name.toUpperCase()}:{' '}
                                    {station.roles.toUpperCase()}
                                </div>
                                <div className="collapse-content bg-secondary text-primary">
                                    <ul className="m-2 list-disc">
                                        <li>
                                            CGPA Cutoff: {station.cgpa_cutoff}
                                        </li>
                                        <li>Roles: {station.roles}</li>
                                        <li>Stipend: {station.stipend}</li>
                                        <li>
                                            Selection Rounds:{' '}
                                            {station.selection_rounds}
                                        </li>
                                        <li>
                                            Eligibility: {station.eligibility}
                                        </li>
                                        <li>Selects: {station.selects}</li>
                                        {station.otherdetails && (
                                            <li>
                                                Other Details:{' '}
                                                {station.otherdetails}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center">
                            <h1 className="text-3xl text-primary">
                                Loading...
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            <CustomToastContainer containerId="siCompanies" />
        </>
    )
}
