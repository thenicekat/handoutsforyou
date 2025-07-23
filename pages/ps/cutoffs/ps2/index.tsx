import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { ps2Semesters } from '@/config/years_sems'
import { PS2Item } from '@/types/PSData'
import { axiosInstance } from '@/utils/axiosCache'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function PS2Data() {
    const [search, setSearch] = useState('')
    const [minCGPA, setMinCGPA] = useState(0)
    const [maxCGPA, setMaxCGPA] = useState(10)
    const [yearRef, setYearRef] = useState(ps2Semesters[0])
    const [cachedYear, setCachedYear] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [ps2Data, setPS2Data] = useState<PS2Item[]>([])
    const [filteredPS2Data, setFilteredPS2Data] = useState<PS2Item[]>([])
    const [hasResponses, setHasResponses] = useState(false)
    const [, setCheckingResponses] = useState(false)

    const checkUserResponses = async () => {
        setCheckingResponses(true)
        try {
            const response = await axiosInstance.post('/api/ps/cutoffs/get', {
                type: 'ps2',
            })

            if (response.status === 200) {
                const data = response.data
                if (!data.error && data.data) {
                    setHasResponses(data.data.length > 0)
                }
            }
        } catch (error) {
            console.error('Failed to check user responses', error)
        } finally {
            setCheckingResponses(false)
        }
    }

    useEffect(() => {
        checkUserResponses()
        updateData()
    }, [])

    const updateData = async () => {
        setIsLoading(true)
        if (yearRef == cachedYear) {
            setIsLoading(false)
            toast.info('You are already using the data for this year!')
            return
        }

        try {
            const res = await axiosInstance.post('/api/ps/cutoffs/ps2', {
                year: yearRef,
            })
            if (res.status !== 400) {
                const data = res.data
                if (data.error) {
                    toast(data.message)
                    return
                } else {
                    let ps2Data = data.data
                    setPS2Data(ps2Data)
                }
            }
            setCachedYear(yearRef)
            toast.success('Data fetched successfully!')
        } catch (error) {
            console.error('Error updating PS2 data:', error)
            toast.error('Failed to fetch data')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        let filteredPS2Data = ps2Data.filter(
            (d: PS2Item) => d.cgpa >= minCGPA && d.cgpa <= maxCGPA
        )
        filteredPS2Data = filteredPS2Data.filter((d: PS2Item) =>
            d.station.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredPS2Data(filteredPS2Data)
        setIsLoading(false)
    }, [ps2Data, minCGPA, maxCGPA, search])

    const columnHelper = createColumnHelper<PS2Item>()

    const columnDefs = [
        columnHelper.accessor((row) => row.name, {
            id: 'Name',
            cell: (info) => info.getValue(),
            header: 'Name',
        }),
        columnHelper.accessor((row) => row.id_number, {
            id: 'ID Number',
            cell: (info) => info.getValue(),
            header: 'ID Number',
        }),
        columnHelper.accessor((row) => row.station, {
            id: 'Company',
            cell: (info) => info.getValue(),
            header: 'Company',
        }),
        columnHelper.accessor((row) => row.cgpa, {
            id: 'CGPA',
            cell: (info) => info.getValue(),
            header: 'CGPA',
        }),
        columnHelper.accessor((row) => row.stipend, {
            id: 'Stipend',
            cell: (info) => info.getValue(),
            header: 'Stipend',
        }),
        columnHelper.accessor((row) => row.allotment_round, {
            id: 'Allotment Round',
            cell: (info) => info.getValue(),
            header: 'Allotment Round',
        }),
        columnHelper.accessor((row) => row.offshoot, {
            id: 'Offshoot',
            cell: (info) => info.getValue(),
            header: 'Offshoot',
        }),
        columnHelper.accessor((row) => row.offshoot_total, {
            id: 'Offshoot Total',
            cell: (info) => info.getValue(),
            header: 'Offshoot Total',
        }),
        columnHelper.accessor((row) => row.offshoot_type, {
            id: 'Offshoot Type',
            cell: (info) => info.getValue() || 'NA',
            header: 'Offshoot Type',
        }),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        columns: columnDefs,
        data: filteredPS2Data ?? [],
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

    return (
        <>
            <Meta {...getMetaConfig('ps/cutoffs/ps2')} />
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Practice School.
                    </h1>

                    <Menu />

                    <>
                        <Link className="m-3" href={'/ps'}>
                            <button className="btn btn-outline w-full">
                                Are you looking for chronicles?
                            </button>
                        </Link>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                placeholder="Min CGPA"
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value)
                                    setMinCGPA(isNaN(value) ? 0 : value)
                                }}
                            />

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                placeholder="Max CGPA"
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value)
                                    setMaxCGPA(isNaN(value) ? 10 : value)
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Search for Company..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <select
                                className="select select-bordered w-full max-w-xs m-3"
                                onChange={(e) => setYearRef(e.target.value)}
                            >
                                <option disabled selected>
                                    Which year to use as reference?
                                </option>
                                {ps2Semesters.map((semester) => (
                                    <option
                                        value={semester}
                                        key={semester}
                                        selected={yearRef == semester}
                                    >
                                        {semester}
                                    </option>
                                ))}
                            </select>

                            <Link className="m-3 w-full max-w-xs" href={''}>
                                <button
                                    className="btn btn-outline w-full"
                                    onClick={updateData}
                                    tabIndex={-1}
                                >
                                    Update Year
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <Link
                                className="m-3 w-full max-w-xs"
                                href={'/ps/cutoffs/ps2/add?edit=false'}
                            >
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Add your response?
                                </button>
                            </Link>
                            {hasResponses && (
                                <Link
                                    className="m-3 w-full max-w-xs"
                                    href={'/ps/cutoffs/ps2/add?edit=true'}
                                >
                                    <button
                                        className="btn btn-outline w-full"
                                        tabIndex={-1}
                                    >
                                        Edit your response?
                                    </button>
                                </Link>
                            )}
                        </div>

                        <p className="m-2">
                            NOTE: This data is crowdsourced and might not be
                            accurate. By default data is sorted using last
                            submitted time. To sort based on other data, use the
                            desktop mode of the website.
                        </p>
                    </>
                </div>
            </div>
            {isLoading && (
                <div className="grid place-items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg mt-4">Loading data...</p>
                </div>
            )}
            {!isLoading && (
                <div>
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">
                            Total Responses: {filteredPS2Data.length}
                        </h1>
                    </div>

                    <div className="px-2 md:px-20">
                        {
                            <>
                                <div className="px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center">
                                    {filteredPS2Data.map((ps2Item: PS2Item) => (
                                        <div
                                            className="card w-72 bg-base-100 text-base-content m-2"
                                            key={ps2Item.id}
                                        >
                                            <div className="card-body">
                                                <p className="text-lg">
                                                    {ps2Item.station.toUpperCase()}
                                                </p>

                                                <div className="flex-none">
                                                    <p className="m-1">
                                                        ID Number:{' '}
                                                        {ps2Item.id_number}
                                                    </p>
                                                    <p className="m-1">
                                                        Name: {ps2Item.name}
                                                    </p>
                                                    <p className="m-1">
                                                        CGPA: {ps2Item.cgpa}
                                                    </p>
                                                    <p className="m-1">
                                                        Stipend:{' '}
                                                        {ps2Item.stipend}
                                                    </p>
                                                    <p className="m-1">
                                                        Allotment Round:{' '}
                                                        {
                                                            ps2Item.allotment_round
                                                        }
                                                    </p>
                                                    <p className="m-1">
                                                        Offshoot:{' '}
                                                        {ps2Item.offshoot}
                                                    </p>
                                                    <p className="m-1">
                                                        Offshoot Total:{' '}
                                                        {ps2Item.offshoot_total}
                                                    </p>
                                                    <p className="m-1">
                                                        Offshoot Type:{' '}
                                                        {ps2Item.offshoot_type ||
                                                            'NA'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="overflow-x-auto m-2 rounded-md hidden md:block">
                                    <table className="table table-sm table-pin-rows bg-base-100">
                                        <thead className="table-header-group">
                                            <tr>
                                                {headers.map((header) => {
                                                    const direction =
                                                        header.column.getIsSorted()
                                                    const sort_indicator =
                                                        direction
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
                                                                        header
                                                                            .column
                                                                            .columnDef
                                                                            .header,
                                                                        header.getContext()
                                                                    )}
                                                                    <span
                                                                        className={`inline-block text-center ${direction ? '' : 'opacity-50'}`}
                                                                    >
                                                                        {
                                                                            sort_indicator
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => (
                                                <tr key={row.id}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => (
                                                            <td key={cell.id}>
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
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
                        }
                    </div>
                </div>
            )}
            <CustomToastContainer containerId="ps2Data" />
        </>
    )
}
