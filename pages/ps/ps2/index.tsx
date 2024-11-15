import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PS2Item } from "@/types/PSData";
import { semesters } from "@/data/years_sems";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";
import React from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';

export default function PS2Data() {
    const [search, setSearch] = useState("");
    const [cgpa, setCGPA] = useState(10);
    const [yearRef, setYearRef] = useState(semesters[0]);
    const [cachedYear, setCachedYear] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [ps2Data, setPS2Data] = useState<PS2Item[]>([]);
    const [filteredPS2Data, setFilteredPS2Data] = useState<PS2Item[]>([]);

    const { data: session } = useSession()

    const updateData = async () => {
        setIsLoading(true);
        if (yearRef == cachedYear) return
        const res = await fetch("/api/ps/cutoffs/ps2", {
            method: "POST",
            body: JSON.stringify({
                year: yearRef
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (res.status !== 400) {
            const data = await res.json();
            if (data.error) {
                toast(data.message);
                return
            } else {
                let ps2Data = data.data;
                setPS2Data(ps2Data);
            }
        }
        setCachedYear(yearRef);
        toast("Year updated successfully!")
        setIsLoading(false);
    }

    useEffect(() => { updateData() }, [])

    useEffect(() => {
        setIsLoading(true);
        let filteredPS2Data = ps2Data.filter((d: PS2Item) => d.cgpa <= cgpa)
        filteredPS2Data = filteredPS2Data.filter((d: PS2Item) => d.station.toLowerCase().includes(search.toLowerCase()))
        setFilteredPS2Data(filteredPS2Data);
        setIsLoading(false);
    }, [ps2Data, cgpa, search])

    const columnHelper = createColumnHelper<PS2Item>();

    const columnDefs = [
        columnHelper.accessor((row) => row.id_number, {
            id: "ID Number",
            cell: (info) => info.getValue(),
            header: "ID Number",
        }),
        columnHelper.accessor((row) => row.station, {
            id: "Company",
            cell: (info) => info.getValue(),
            header: "Company",
        }),
        columnHelper.accessor((row) => row.cgpa, {
            id: "CGPA",
            cell: (info) => info.getValue(),
            header: "CGPA",
        }),
        columnHelper.accessor((row) => row.stipend, {
            id: "Stipend",
            cell: (info) => info.getValue(),
            header: "Stipend",
        }),
        columnHelper.accessor((row) => row.allotment_round, {
            id: "Allotment Round",
            cell: (info) => info.getValue(),
            header: "Allotment Round",
        }),
        columnHelper.accessor((row) => row.offshoot, {
            id: "Offshoot",
            cell: (info) => info.getValue(),
            header: "Offshoot",
        }),
        columnHelper.accessor((row) => row.offshoot_total, {
            id: "Offshoot Total",
            cell: (info) => info.getValue(),
            header: "Offshoot Total",
        }),
        columnHelper.accessor((row) => row.offshoot_type, {
            id: "Offshoot Type",
            cell: (info) => info.getValue() || "NA",
            header: "Offshoot Type",
        }),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        columns: columnDefs,
        data: filteredPS2Data ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });
    const headers = table.getFlatHeaders();
    const rows = table.getRowModel().rows;
    const arrow: any = {
        asc: "↑",
        desc: "↓",
        unsorted: "⇅",
    };

    return (
        <>
            <Head>
                <title>PS 2 Cutoffs.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

                    <Menu />

                    {session && <>
                        <Link className="m-3" href={"/ps"}>
                            <button className="btn btn-outline w-full">
                                Are you looking for chronicles?
                            </button>
                        </Link>

                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <input
                                type="text"
                                placeholder="Filter using CGPA..."
                                className="input input-secondary w-full max-w-xs m-3"
                                onChange={(e) => {
                                    if (e.target.value == "") {
                                        setCGPA(10)
                                        return
                                    }
                                    setCGPA(parseFloat(e.target.value))
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
                            <select className="select select-bordered w-full max-w-xs m-3" onChange={(e) => setYearRef(e.target.value)}>
                                <option disabled selected>Which year to use as reference?</option>
                                {
                                    semesters.map((semester) => (
                                        <option value={semester} key={semester} selected={yearRef == semester}>{semester}</option>
                                    ))
                                }
                            </select>

                            <Link className="m-3 w-full max-w-xs" href={""}>
                                <button className="btn btn-outline w-full" onClick={updateData} tabIndex={-1}>
                                    Update Year
                                </button>
                            </Link>
                        </div>


                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="m-3 w-full" href={"/ps/ps2/add"}>
                                <button className="btn btn-outline w-full" tabIndex={-1}>
                                    Add your response?
                                </button>
                            </Link>
                        </div>

                        <p className="m-2">NOTE: This data is crowdsourced and might not be accurate. By default data is sorted using last submitted time. To sort based on other data, use the desktop mode of the website.</p>
                    </>}
                </div>
            </div>

            {session &&
                <div>
                    {/* Show the count of reviews */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl text-primary">Total Responses: {isLoading ? "Loading..." : filteredPS2Data.length}</h1>
                    </div>

                    <div className='px-2 md:px-20'>
                        {
                            !isLoading ?
                                <>
                                    {/* Mobile UI */}
                                    <div className='px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center'>
                                        {
                                            filteredPS2Data.map((ps2Item: PS2Item) => (
                                                <div className="card w-72 bg-base-100 text-base-content m-2" key={ps2Item.id}>
                                                    <div className="card-body">
                                                        <p className='text-lg'>{ps2Item.station.toUpperCase()}</p>

                                                        <div className="flex-none">
                                                            <p className="m-1">ID Number: {ps2Item.id_number}</p>
                                                            <p className="m-1">CGPA: {ps2Item.cgpa}</p>
                                                            <p className="m-1">Stipend: {ps2Item.stipend}</p>
                                                            <p className="m-1">Allotment Round: {ps2Item.allotment_round}</p>
                                                            <p className="m-1">Offshoot: {ps2Item.offshoot}</p>
                                                            <p className="m-1">Offshoot Total: {ps2Item.offshoot_total}</p>
                                                            <p className="m-1">Offshoot Type: {ps2Item.offshoot_type ? ps2Item.offshoot_type : "NA"}</p>
                                                        </div>
                                                    </div>
                                                </div>))
                                        }
                                    </div>

                                    {/* Web UI */}
                                    <div className="overflow-x-auto m-2 rounded-md hidden md:block">
                                        <table className="table table-sm table-pin-rows bg-base-100">
                                            <thead className='table-header-group'>
                                                <tr>
                                                    {headers.map((header) => {
                                                        const direction = header.column.getIsSorted()
                                                        const sort_indicator = (direction) ? arrow[direction] : arrow["unsorted"]

                                                        return (
                                                            <th key={header.id}>
                                                                {header.isPlaceholder ? null : (
                                                                    <div
                                                                        onClick={header.column.getToggleSortingHandler()}
                                                                        className="cursor-pointer flex gap-2"
                                                                    >
                                                                        {flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                        <span className={`inline-block text-center ${direction ? '' : 'opacity-50'}`}>{sort_indicator}</span>
                                                                    </div>
                                                                )}
                                                            </th>
                                                        );
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row) => (
                                                    <tr key={row.id}>
                                                        {row.getVisibleCells().map((cell) => (
                                                            <td key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                :
                                <div className="flex justify-center">
                                    <h1 className="text-3xl text-primary">Loading...</h1>
                                </div>
                        }
                    </div>
                </div>
            }
            <CustomToastContainer containerId="ps2Data" />
        </>
    )
}