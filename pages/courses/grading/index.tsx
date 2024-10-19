import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Menu from '@/components/Menu';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'react-toastify';
import CustomToastContainer from '@/components/ToastContainer';
import { CourseGrading } from '@/types/CourseGrading';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface GradeDataTable {
    grade: string,
    min?: number,
    max?: number,
    num?: number
}

function Grading() {
    const [courseGradings, setCourseGradings] = useState<CourseGrading[]>([]);
    const { data: session } = useSession();

    const fetchCourseGradings = async () => {
        const res = await fetch("/api/courses/grading/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const resp = await res.json();
        if (!resp.error) {
            setCourseGradings(resp.data);
        } else {
            toast.error("Error fetching grading details");
        }
    };

    const columnHelper = createColumnHelper<GradeDataTable>();
    const columnDefs = [
        columnHelper.accessor('grade', {
            id: 'Grade',
            cell: (info) => info.getValue(),
            header: 'Grade',
        }),
        columnHelper.accessor('min', {
            id: 'Min',
            cell: (info) => info.getValue(),
            header: 'Min',
        }),
        columnHelper.accessor('max', {
            id: 'Max',
            cell: (info) => info.getValue(),
            header: 'Max',
        }),
        columnHelper.accessor('num', {
            id: 'Number',
            cell: (info) => info.getValue(),
            header: 'Number',
        }),
    ];

    useEffect(() => {
        fetchCourseGradings();
    }, []);

    return (
        <>
            <Head>
                <title>Course Grading.</title>
                <meta name="description" content="Course grading details" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='grid place-items-center'>
                <div className='w-[70vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-5xl pt-[50px] pb-[20px] px-[35px] text-primary'>Course Grading.</h1>
                    <Menu />
                    {session && (
                        <div className="max-w-7xl mx-auto">
                            <div className='px-2 p-2 grid sm:grid-cols-2 grid-cols-1 place-items-center'>
                                {courseGradings.map((courseGrading) => {
                                    const data = [
                                        { grade: 'A', ...courseGrading.A },
                                        { grade: 'A-', ...courseGrading.Am },
                                        { grade: 'B', ...courseGrading.B },
                                        { grade: 'B-', ...courseGrading.Bm },
                                        { grade: 'C', ...courseGrading.C },
                                        { grade: 'C-', ...courseGrading.Cm },
                                        { grade: 'D', ...courseGrading.D },
                                        { grade: 'E', ...courseGrading.E },
                                        { grade: 'W', ...courseGrading.W },
                                        { grade: 'I', ...courseGrading.I },
                                    ];

                                    const table = useReactTable({
                                        columns: columnDefs,
                                        data: data,
                                        getCoreRowModel: getCoreRowModel(),
                                    });

                                    const headers = table.getFlatHeaders();
                                    const rows = table.getRowModel().rows;

                                    return (
                                        <div className="card w-72 h-auto bg-base-100 text-base-content m-2" key={courseGrading.id}>
                                            <div className="card-body">
                                                <h2 className="text-sm font-bold uppercase">{courseGrading.course}</h2>
                                                <p className='text-lg'>{courseGrading.prof}</p>
                                                <p className='text-md'>{courseGrading.sem}</p>
                                                <div className="overflow-x-auto m-2 rounded-md">
                                                    <table className="table table-sm bg-base-100">
                                                        <thead className='table-header-group'>
                                                            <tr>
                                                                {headers.map((header) => (
                                                                    <th key={header.id}>
                                                                        {header.isPlaceholder ? null : (
                                                                            <div className="flex gap-4">
                                                                                {flexRender(
                                                                                    header.column.columnDef.header,
                                                                                    header.getContext()
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </th>
                                                                ))}
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <CustomToastContainer containerId="courseGradings" />
        </>
    );
}

export default Grading;
