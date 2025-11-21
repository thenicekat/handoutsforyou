import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import MonetagAd from '@/components/MonetagAd'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { placementYears } from '@/config/years_sems'
import { PlacementCTC } from '@/types/Placements'
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

export default function PlacementCTCs() {
    const [input, setInput] = useState('')
    const [placementCTCs, setPlacementCTCs] = useState([] as PlacementCTC[])
    const [filteredPlacementCTCs, setFilteredPlacementCTCs] = useState(
        [] as PlacementCTC[]
    )
    const [yearRef, setYearRef] = useState(placementYears[0])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPlacementCTCs = async () => {
        try {
            const res = await axiosInstance.post('/api/zob/ctcs/get', {
                year: yearRef,
            })
            const resp = res.data
            if (!resp.error) {
                setPlacementCTCs(resp.data)
                setFilteredPlacementCTCs(resp.data)
            } else {
                toast.error('Error fetching placement details')
            }
        } catch (error) {
            console.error('Error fetching placement CTCs:', error)
            toast.error('Failed to fetch placement details')
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        let filteredPlacementCTCs = placementCTCs.filter(placementCTC =>
            placementCTC.company.toLowerCase().includes(input.toLowerCase())
        )
        setFilteredPlacementCTCs(filteredPlacementCTCs)
    }, [input])

    const columnHelper = createColumnHelper<PlacementCTC>()

    const columnDefs = [
        columnHelper.accessor(row => row.company, {
            id: 'Company',
            cell: info => info.getValue(),
            header: 'Company',
        }),
        columnHelper.accessor(row => row.campus, {
            id: 'Campus',
            cell: info => info.getValue(),
            header: 'Campus',
        }),
        columnHelper.accessor(row => row.base, {
            id: 'Base',
            cell: info => info.getValue().toLocaleString('en-IN') || 0,
            header: 'Base',
        }),
        columnHelper.accessor(row => row.joining_bonus, {
            id: 'Joining Bonus',
            cell: info => info.getValue().toLocaleString('en-IN'),
            header: 'Joining Bonus',
        }),
        columnHelper.accessor(row => row.relocation_bonus, {
            id: 'Relocation Bonus',
            cell: info => info.getValue().toLocaleString('en-IN'),
            header: 'Relocation Bonus',
        }),
        columnHelper.accessor(row => row.variable_bonus, {
            id: 'Variable Bonus',
            cell: info => info.getValue().toLocaleString('en-IN'),
            header: 'Variable Bonus',
        }),
        columnHelper.accessor(row => row.monetary_value_of_benefits, {
            id: 'Other',
            cell: info => info.getValue().toLocaleString('en-IN'),
            header: 'Other',
        }),
        columnHelper.accessor(row => row.description, {
            id: 'Description',
            cell: info => info.getValue(),
            header: 'Description',
        }),
        columnHelper.accessor(
            row =>
                row.base +
                row.joining_bonus +
                row.relocation_bonus +
                row.variable_bonus +
                row.monetary_value_of_benefits,
            {
                id: 'Total CTC',
                cell: info => info.getValue().toLocaleString('en-IN'),
                header: 'Total CTC',
            }
        ),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        columns: columnDefs,
        data: filteredPlacementCTCs ?? [],
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
        fetchPlacementCTCs()
    }, [])

    return (
        <>
            <Meta {...getMetaConfig('zob/ctcs')} />

            <MonetagAd
                adFormat="interstitial-banner"
                id="monetag-interstitial-banner-inline-zob-ctcs"
            />

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Placement CTCs.
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
                            <Link className="m-3 w-full" href={'/zob/ctcs/add'}>
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Add a CTC
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link className="m-3 w-full" href={'/zob/ctcs/add'}>
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
                                {placementYears.map(year => (
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
                                    onClick={fetchPlacementCTCs}
                                >
                                    Update Year
                                </button>
                            </Link>
                        </div>
                        <p className="text-center">
                            NOTE: ESOPs do not count as monetary benefits for
                            the sake of uniformity on this page.
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
                ) : filteredPlacementCTCs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-2xl font-semibold mb-2">
                            No CTCs Found
                        </h3>
                        <p className="text-base-content/70 mb-6">
                            There are no placement CTCs available for the
                            selected year. Be the first to contribute!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile UI */}
                        <div className="px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center">
                            {filteredPlacementCTCs.map(placementCTC => (
                                <div
                                    className="card w-72 bg-base-100 text-base-content m-2"
                                    key={
                                        placementCTC.company +
                                        '/' +
                                        placementCTC.campus
                                    }
                                >
                                    <div className="card-body ">
                                        <h2 className="text-sm font-bold uppercase">
                                            {placementCTC.campus}
                                        </h2>
                                        <p className="text-lg">
                                            {placementCTC?.company.toUpperCase()}
                                        </p>

                                        <div className="flex-none">
                                            <p className="m-1">
                                                Base:{' '}
                                                {placementCTC.base.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </p>
                                            <p className="m-1">
                                                Joining Bonus:{' '}
                                                {placementCTC.joining_bonus.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </p>
                                            <p className="m-1">
                                                Relocation Bonus:{' '}
                                                {placementCTC.relocation_bonus.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </p>
                                            <p className="m-1">
                                                Variable Bonus:{' '}
                                                {placementCTC.variable_bonus.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </p>
                                            <p className="m-1">
                                                Monetary Value of Benefits:{' '}
                                                {placementCTC.monetary_value_of_benefits.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </p>
                                            <p className="m-1">
                                                Desc: {placementCTC.description}
                                            </p>
                                            <p className="m-1">
                                                Total CTC:{' '}
                                                {(
                                                    placementCTC.base +
                                                    placementCTC.joining_bonus +
                                                    placementCTC.relocation_bonus +
                                                    placementCTC.variable_bonus +
                                                    placementCTC.monetary_value_of_benefits
                                                ).toLocaleString('en-IN')}
                                            </p>
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
            <CustomToastContainer containerId="placementCTCs" />
        </>
    )
}
