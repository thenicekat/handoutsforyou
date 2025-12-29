import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { ps1Years } from '@/config/years_sems'
import { PS1Item } from '@/types/PS'
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

export default function PS1Data() {
    const [search, setSearch] = useState('')
    const [minCGPA, setMinCGPA] = useState(0)
    const [maxCGPA, setMaxCGPA] = useState(10)
    const [yearRef, setYearRef] = useState(ps1Years[0])
    const [cachedYear, setCachedYear] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [ps1Data, setPS1Data] = useState<PS1Item[]>([])
    const [filteredPS1Data, setFilteredPS1Data] = useState<PS1Item[]>([])
    const [hasResponses, setHasResponses] = useState(false)
    const [, setCheckingResponses] = useState(false)

    const updateData = async () => {
        setIsLoading(true)
        if (yearRef == cachedYear) {
            setIsLoading(false)
            toast.info('You are already using the data for this year!')
            return
        }

        try {
            const res = await axiosInstance.get('/api/ps/cutoffs/ps1', {
                params: {
                    year: yearRef,
                },
            })
            if (res.status !== 400) {
                const data = res.data
                if (data.error) {
                    toast(data.message)
                    return
                } else {
                    let ps1Data = data.data
                    setPS1Data(ps1Data)
                }
            }
            setCachedYear(yearRef)
            toast.success('Data fetched successfully!')
        } catch (error) {
            console.error('Error updating PS1 data:', error)
            toast.error('Failed to fetch data')
        }
        setIsLoading(false)
    }

    const checkUserResponses = async () => {
        setCheckingResponses(true)
        try {
            const response = await axiosInstance.get('/api/ps/cutoffs/my', {
                params: {
                    type: 'ps1',
                },
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

    useEffect(() => {
        setIsLoading(true)
        let filteredPS1Data = ps1Data.filter(
            (d: PS1Item) => d.cgpa >= minCGPA && d.cgpa <= maxCGPA
        )
        filteredPS1Data = filteredPS1Data.filter((d: PS1Item) =>
            d.station.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredPS1Data(filteredPS1Data)
        setIsLoading(false)
    }, [ps1Data, minCGPA, maxCGPA, search])

    const columnHelper = createColumnHelper<PS1Item>()

    const columnDefs = [
        columnHelper.accessor(row => row.name, {
            id: 'Name',
            cell: info => info.getValue(),
            header: 'Name',
        }),
        columnHelper.accessor(row => row.id_number, {
            id: 'ID Number',
            cell: info => info.getValue(),
            header: 'ID Number',
        }),
        columnHelper.accessor(row => row.station, {
            id: 'Company',
            cell: info => info.getValue(),
            header: 'Company',
        }),
        columnHelper.accessor(row => row.cgpa, {
            id: 'CGPA',
            cell: info => info.getValue(),
            header: 'CGPA',
        }),
        columnHelper.accessor(row => row.allotment_round, {
            id: 'Allotment Round',
            cell: info => info.getValue(),
            header: 'Allotment Round',
        }),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        columns: columnDefs,
        data: filteredPS1Data ?? [],
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
            <Meta {...getMetaConfig('ps/cutoffs/ps1')} />

            {/* Search box */}
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
                                placeholder="Min CGPA"
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={e =>
                                    setMinCGPA(parseFloat(e.target.value) || 0)
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max CGPA"
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={e =>
                                    setMaxCGPA(parseFloat(e.target.value) || 10)
                                }
                            />
                            <input
                                type="text"
                                placeholder="Search for Company..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <select
                                className="select select-bordered w-full max-w-xs m-3"
                                onChange={e => setYearRef(e.target.value)}
                            >
                                <option disabled selected>
                                    Which year to use as reference?
                                </option>
                                {ps1Years.map(year => (
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
                                href={'/ps/cutoffs/ps1/add?edit=false'}
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
                                    href={'/ps/cutoffs/ps1/add?edit=true'}
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
                            Total Responses: {filteredPS1Data.length}
                        </h1>
                    </div>

                    <div className="px-2 md:px-20">
                        <>
                            <div className="px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center">
                                {filteredPS1Data.map((PS1Item: PS1Item) => (
                                    <div
                                        className="card w-72 bg-base-100 text-base-content m-2"
                                        key={PS1Item.id}
                                    >
                                        <div className="card-body">
                                            <p className="text-lg">
                                                {PS1Item.station.toUpperCase()}
                                            </p>

                                            <div className="flex-none">
                                                <p className="m-1">
                                                    Name: {PS1Item.name}
                                                </p>
                                                <p className="m-1">
                                                    ID Number:{' '}
                                                    {PS1Item.id_number}
                                                </p>
                                                <p className="m-1">
                                                    CGPA: {PS1Item.cgpa}
                                                </p>
                                                <p className="m-1">
                                                    Allotment Round:{' '}
                                                    {PS1Item.allotment_round}
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
                                        {rows.map(row => (
                                            <tr key={row.id}>
                                                {row
                                                    .getVisibleCells()
                                                    .map(cell => (
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
                    </div>
                </div>
            )}
            <CustomToastContainer containerId="PS1Data" />
        </>
    )
}
