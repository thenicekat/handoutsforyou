import { getMetaConfig } from '@/utils/meta-config';
import Meta from '@/components/Meta';
import Link from 'next/link'
import { useState } from 'react'
import Menu from '@/components/Menu'
import React from 'react'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { PlacementCTC } from '@/types/PlacementData'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { placementYears } from '@/data/years_sems'

export default function PlacementCTCs() {
    const [input, setInput] = useState('')
    const [placementCTCs, setPlacementCTCs] = useState([] as PlacementCTC[])
    const [filteredPlacementCTCs, setFilteredPlacementCTCs] = useState(
        [] as PlacementCTC[]
    )
    const [yearRef, setYearRef] = useState(placementYears[0])

    const fetchPlacementCTCs = async () => {
        const res = await fetch('/api/placements/ctcs/get', {
            method: 'POST',
            body: JSON.stringify({
                year: yearRef,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        const resp = await res.json()
        if (!resp.error) {
            setPlacementCTCs(resp.data)
            setFilteredPlacementCTCs(resp.data)
        } else {
            toast.error('Error fetching placement details')
        }
    }

    React.useEffect(() => {
        let filteredPlacementCTCs = placementCTCs.filter((placementCTC) =>
            placementCTC.company.toLowerCase().includes(input.toLowerCase())
        )
        setFilteredPlacementCTCs(filteredPlacementCTCs)
    }, [input])

    const columnHelper = createColumnHelper<PlacementCTC>()

    const columnDefs = [
        columnHelper.accessor((row) => row.company, {
            id: 'Company',
            cell: (info) => info.getValue(),
            header: 'Company',
        }),
        columnHelper.accessor((row) => row.campus, {
            id: 'Campus',
            cell: (info) => info.getValue(),
            header: 'Campus',
        }),
        columnHelper.accessor((row) => row.base, {
            id: 'Base',
            cell: (info) => info.getValue(),
            header: 'Base',
        }),
        columnHelper.accessor((row) => row.joining_bonus, {
            id: 'Joining Bonus',
            cell: (info) => info.getValue(),
            header: 'Joining Bonus',
        }),
        columnHelper.accessor((row) => row.relocation_bonus, {
            id: 'Relocation Bonus',
            cell: (info) => info.getValue(),
            header: 'Relocation Bonus',
        }),
        columnHelper.accessor((row) => row.variable_bonus, {
            id: 'Variable Bonus',
            cell: (info) => info.getValue(),
            header: 'Variable Bonus',
        }),
        columnHelper.accessor((row) => row.monetary_value_of_benefits, {
            id: 'Other',
            cell: (info) => info.getValue(),
            header: 'Other',
        }),
        columnHelper.accessor((row) => row.description, {
            id: 'Description',
            cell: (info) => info.getValue(),
            header: 'Description',
        }),
        columnHelper.accessor(
            (row) =>
                row.base +
                row.joining_bonus +
                row.relocation_bonus +
                row.variable_bonus +
                row.monetary_value_of_benefits,
            {
                id: 'Total CTC',
                cell: (info) => info.getValue(),
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
            <Meta {...getMetaConfig('placements/ctcs')} />
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
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        <div className="flex-col hidden md:block md:flex-row w-1/3 justify-center">
                            <Link
                                className="m-3 w-full"
                                href={'/placements/ctcs/add'}
                            >
                                <button
                                    className="btn btn-outline w-full"
                                    tabIndex={-1}
                                >
                                    Add a CTC
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link
                                className="m-3 w-full"
                                href={'/placements/ctcs/add'}
                            >
                                <PlusCircleIcon />
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <select
                                className="select select-bordered w-full max-w-xs m-3"
                                onChange={(e) => setYearRef(e.target.value)}
                            >
                                <option disabled selected>
                                    Which year to use as reference?
                                </option>
                                {placementYears.map((year) => (
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
                {/* Mobile UI */}
                <div className="px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center">
                    {filteredPlacementCTCs.map((placementCTC) => (
                        <div
                            className="card w-72 bg-base-100 text-base-content m-2"
                            key={
                                placementCTC.company + '/' + placementCTC.campus
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
                                        Base: {placementCTC.base}
                                    </p>
                                    <p className="m-1">
                                        Joining Bonus:{' '}
                                        {placementCTC.joining_bonus}
                                    </p>
                                    <p className="m-1">
                                        Relocation Bonus:{' '}
                                        {placementCTC.relocation_bonus}
                                    </p>
                                    <p className="m-1">
                                        Variable Bonus:{' '}
                                        {placementCTC.variable_bonus}
                                    </p>
                                    <p className="m-1">
                                        Monetary Value of Benefits:{' '}
                                        {
                                            placementCTC.monetary_value_of_benefits
                                        }
                                    </p>
                                    <p className="m-1">
                                        Desc: {placementCTC.description}
                                    </p>
                                    <p className="m-1">
                                        Total CTC:{' '}
                                        {placementCTC.base +
                                            placementCTC.joining_bonus +
                                            placementCTC.relocation_bonus +
                                            placementCTC.variable_bonus +
                                            placementCTC.monetary_value_of_benefits}
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
                                {headers.map((header) => {
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
                                                        header.column.columnDef
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
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <CustomToastContainer containerId="placementCTCs" />
        </>
    );
}
