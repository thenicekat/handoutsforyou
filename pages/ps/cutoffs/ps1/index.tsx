import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PS1Item } from "@/types/PSData";
import { years } from "@/data/years_sems";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";
import React from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';

export default function PS1Data() {
    const [search, setSearch] = useState("");
    const [cgpa, setCGPA] = useState(10);
    const [yearRef, setYearRef] = useState(years[0]);
    const [cachedYear, setCachedYear] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [ps1Data, setPS1Data] = useState<PS1Item[]>([]);
    const [filteredPS1Data, setFilteredPS1Data] = useState<PS1Item[]>([]);

    const { data: session } = useSession()

    const updateData = async () => {
        setIsLoading(true);
        if (yearRef == cachedYear) {
            setIsLoading(false);
            return
        }

        const res = await fetch("/api/ps/cutoffs/ps1", {
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
                let ps1Data = data.data;
                setPS1Data(ps1Data);
            }
        }
        setCachedYear(yearRef);
        toast("Year updated successfully!")
        setIsLoading(false);
    }

    useEffect(() => { updateData() }, [])

    useEffect(() => {
        setIsLoading(true);
        let filteredPS1Data = ps1Data.filter((d: PS1Item) => d.cgpa <= cgpa)
        filteredPS1Data = filteredPS1Data.filter((d: PS1Item) => d.station.toLowerCase().includes(search.toLowerCase()))
        setFilteredPS1Data(filteredPS1Data);
        setIsLoading(false);
    }, [ps1Data, cgpa, search])

    const columnHelper = createColumnHelper<PS1Item>();

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
        columnHelper.accessor((row) => row.allotment_round, {
            id: "Allotment Round",
            cell: (info) => info.getValue(),
            header: "Allotment Round",
        }),
    ]

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        columns: columnDefs,
        data: filteredPS1Data ?? [],
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
                <title>PS 1 Cutoffs.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps1, ps2" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">Practice School.</h1>

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
                                    years.map((year) => (
                                        <option value={year} key={year} selected={yearRef == year}>{year}</option>
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
                            <Link className="m-3 w-full" href={"/ps/cutoffs/ps1/add"}>
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
                        <h1 className="text-3xl text-primary">Total Responses: {isLoading ? "Loading..." : filteredPS1Data.length}</h1>
                    </div>

                    <div className='px-2 md:px-20'>
                        {
                            !isLoading ?
                                <>
                                    {/* Mobile UI */}
                                    <div className='px-2 p-2 grid md:hidden sm:grid-cols-2 grid-cols-1 place-items-center'>
                                        {
                                            filteredPS1Data.map((PS1Item: PS1Item) => (
                                                <div className="card w-72 bg-base-100 text-base-content m-2" key={PS1Item.id}>
                                                    <div className="card-body">
                                                        <p className='text-lg'>{PS1Item.station.toUpperCase()}</p>

                                                        <div className="flex-none">
                                                            <p className="m-1">ID Number: {PS1Item.id_number}</p>
                                                            <p className="m-1">CGPA: {PS1Item.cgpa}</p>
                                                            <p className="m-1">Allotment Round: {PS1Item.allotment_round}</p>
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
            <CustomToastContainer containerId="PS1Data" />
        </>
    )
}