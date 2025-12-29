import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { siYears } from '@/config/years_sems'
import { SI_Company } from '@/types/SIData'
import { axiosInstance } from '@/utils/axiosCache'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function SICompanies() {
    const [input, setInput] = useState('')
    const [siCompanies, setSiCompanies] = useState([] as SI_Company[])
    const [filteredSiCompanies, setFilteredSiCompanies] = useState(
        [] as SI_Company[]
    )
    const [yearRef, setYearRef] = useState(siYears[0])
    const [isLoading, setIsLoading] = useState(true)

    const fetchSiCompanies = async () => {
        try {
            const res = await axiosInstance.get('/api/zob/companies/get', {
                params: {
                    year: yearRef,
                },
            })
            const resp = res.data
            if (!resp.error) {
                setSiCompanies(resp.data)
                setFilteredSiCompanies(resp.data)
            } else {
                toast.error('Error fetching SI companies')
            }
        } catch (error) {
            console.error('Error fetching SI companies:', error)
            toast.error('Failed to fetch SI companies')
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        let filteredSiCompanies = siCompanies.filter(
            siCompany =>
                siCompany.name.toLowerCase().includes(input.toLowerCase()) ||
                siCompany.roles.toLowerCase().includes(input.toLowerCase())
        )
        setFilteredSiCompanies(filteredSiCompanies)
    }, [input])

    const columnHelper = createColumnHelper<SI_Company>()

    const columnDefs = [
        columnHelper.accessor(row => row.name, {
            id: 'Company',
            cell: info => info.getValue(),
            header: 'Company',
        }),
        columnHelper.accessor(row => row.roles, {
            id: 'Roles',
            cell: info => info.getValue(),
            header: 'Roles',
        }),
        columnHelper.accessor(row => row.cgpa_cutoff, {
            id: 'CGPA Cutoff',
            cell: info => info.getValue(),
            header: 'CGPA Cutoff',
        }),
        columnHelper.accessor(row => row.stipend, {
            id: 'Stipend',
            cell: info => info.getValue(),
            header: 'Stipend',
        }),
        columnHelper.accessor(row => row.eligibility, {
            id: 'Eligibility',
            cell: info => info.getValue(),
            header: 'Eligibility',
        }),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        columns: columnDefs,
        data: filteredSiCompanies ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    })
    const headers = table.getFlatHeaders()
    const rows = table.getRowModel().rows
    const arrow: any = {
        asc: '↑',
        desc: '↓',
        unsorted: '⇅',
    }

    React.useEffect(() => {
        fetchSiCompanies()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('si')} />

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Summer Internships.
                    </h1>
                    <Menu />

                    <>
                        <div className="flex flex-col md:flex-row w-full md:w-1/2 justify-center">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={e => setInput(e.target.value)}
                            />
                        </div>

                        <div className="flex-col hidden md:block md:flex-row w-1/3 justify-center">
                            <Link
                                className="m-3 w-full"
                                href={'/zob/sicompanies/add'}
                            >
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Add SI Company
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link
                                className="m-3 w-full"
                                href={'/zob/sicompanies/add'}
                            >
                                <PlusCircleIcon />
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <select
                                className="select select-bordered w-full max-w-xs m-3"
                                onChange={e => setYearRef(e.target.value)}
                            >
                                <option disabled selected>
                                    Which year to use as reference?
                                </option>
                                {siYears.map(year => (
                                    <option
                                        value={year}
                                        key={year}
                                        selected={yearRef == year}
                                    >
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <Link className="m-3 w-full max-w-xs" href={''}>
                                <button
                                    className="btn btn-outline w-full"
                                    onClick={fetchSiCompanies}
                                >
                                    Update Year
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <Link
                                className="m-3 w-full max-w-xs"
                                href={'/zob/resources'}
                            >
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Are you looking for resources?
                                </button>
                            </Link>
                        </div>

                        <p className="text-center">
                            NOTE: This content was scrapped from SI Chronicles
                            and belongs to Placement Unit
                        </p>
                    </>
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid place-items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-lg mt-4">Loading data...</p>
                    </div>
                ) : filteredSiCompanies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-2xl font-semibold mb-2">
                            No SI Companies Found
                        </h3>
                        <p className="text-base-content/70 mb-6">
                            There are no SI companies available for the selected
                            year. Be the first to contribute!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile UI */}
                        <div className="px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center">
                            {filteredSiCompanies.map(siCompany => (
                                <div
                                    className="card w-72 bg-base-100 text-base-content m-2"
                                    key={siCompany.name + '/' + siCompany.roles}
                                >
                                    <div className="card-body ">
                                        <h2 className="text-sm font-bold uppercase">
                                            {siCompany.roles}
                                        </h2>
                                        <p className="text-lg">
                                            {siCompany?.name.toUpperCase()}
                                        </p>

                                        <div className="flex-none">
                                            <p className="m-1">
                                                CGPA Cutoff:{' '}
                                                {siCompany.cgpa_cutoff}
                                            </p>
                                            <p className="m-1">
                                                Stipend: {siCompany.stipend}
                                            </p>
                                            <p className="m-1">
                                                Eligibility:{' '}
                                                {siCompany.eligibility}
                                            </p>
                                            {siCompany.otherdetails && (
                                                <p className="m-1">
                                                    Other Details:{' '}
                                                    {siCompany.otherdetails}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Web UI */}
                        <div className="overflow-x-auto m-2 rounded-md hidden md:block">
                            <table className="table table-sm table-pin-rows bg-base-100">
                                <thead className="table-header-group">
                                    <tr>
                                        {headers.map(header => {
                                            const direction =
                                                header.column.getIsSorted()
                                            const sort_indicator = direction
                                                ? arrow[direction]
                                                : arrow['unsorted']

                                            return (
                                                <th key={header.id}>
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className="cursor-pointer flex gap-2"
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                            <span
                                                                className={`inline-block text-center ${direction ? '' : 'opacity-50'}`}
                                                            >
                                                                {sort_indicator}
                                                            </span>
                                                        </div>
                                                    )}
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            <CustomToastContainer containerId="siCompanies" />
        </>
    )
}
