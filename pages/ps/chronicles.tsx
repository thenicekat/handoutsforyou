import Head from 'next/head'
import { useState, useEffect } from 'react'
import Menu from '@/components/Menu'
import type { PSChronicles } from '@/types/GoogleDriveChronicles'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import { checkSession } from '@/utils/checkSession'

export default function PSChroniclesPage() {
    const [psChronicles, setPsChronicles] = useState<PSChronicles>({ ps1: [], ps2: [] })
    const [chroniclesLoading, setChroniclesLoading] = useState(false)

    const fetchChronicles = async () => {
        setChroniclesLoading(true)
        try {
            const res = await fetch('/api/ps/chronicles/get')
            const data = await res.json()
            if (!data.error) {
                setPsChronicles(data.data)
            } else {
                toast.error('Error fetching PS chronicles')
            }
        } catch (error) {
            console.error('Error fetching PS chronicles:', error)
            toast.error('Error fetching PS chronicles')
        }
        setChroniclesLoading(false)
    }

    useEffect(() => {
        checkSession()
        fetchChronicles()
    }, [])

    return (
        <>
            <Head>
                <title>PS Chronicles</title>
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

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary text-center mb-8">
                        Practice School
                    </h1>
                    <Menu />
                </div>

                {!chroniclesLoading ? (
                    <div className="space-y-12 mt-12">
                        <section>
                            <h2 className="text-3xl font-semibold text-center mb-8">
                                PS1 Chronicles ({psChronicles.ps1.length})
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {psChronicles.ps1.map((chronicle) => (
                                    <div
                                        key={chronicle.id}
                                        className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="card-body p-4">
                                            <h3 className="card-title text-lg">
                                                {chronicle.name}
                                            </h3>
                                            {chronicle.size && (
                                                <p className="text-xs text-gray-400">
                                                    Size: {Math.round(parseInt(chronicle.size) / 1024 / 1024 * 100) / 100} MB
                                                </p>
                                            )}
                                            <div className="card-actions justify-end mt-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        window.open(
                                                            chronicle.downloadUrl,
                                                            '_blank'
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-semibold text-center mb-8">
                                PS2 Chronicles ({psChronicles.ps2.length})
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {psChronicles.ps2.map((chronicle) => (
                                    <div
                                        key={chronicle.id}
                                        className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="card-body p-4">
                                            <h3 className="card-title text-lg">
                                                {chronicle.name}
                                            </h3>
                                            {chronicle.size && (
                                                <p className="text-xs text-gray-400">
                                                    Size: {Math.round(parseInt(chronicle.size) / 1024 / 1024 * 100) / 100} MB
                                                </p>
                                            )}
                                            <div className="card-actions justify-end mt-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        window.open(
                                                            chronicle.downloadUrl,
                                                            '_blank'
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="grid place-items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-lg mt-4">Loading PS chronicles...</p>
                    </div>
                )}
            </div>
            <CustomToastContainer containerId="psChronicles" />
        </>
    )
}
