import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { useMemo, useState } from 'react'

type TransactionType = 'inflow' | 'outflow'

type Transaction = {
    id: string
    type: TransactionType
    name: string
    detail?: string
    amount: number
    round?: string
}

const inFlowTransactions: Transaction[] = [
    // First Round
    {
        id: '1',
        type: 'inflow',
        round: 'First Round',
        name: 'Aryan Dalmia',
        detail: 'f20230124@hyderabad.bits-pilani.ac.in',
        amount: 500,
    },
    {
        id: '2',
        type: 'inflow',
        round: 'First Round',
        name: 'Kaushik Varma Viswaraju',
        detail: 'f20240435@hyderabad.bits-pilani.ac.in',
        amount: 500,
    },
    {
        id: '3',
        type: 'inflow',
        round: 'First Round',
        name: 'Aditya Chandrakant Jagtap',
        detail: 'f20240127@hyderabad.bits-pilani.ac.in',
        amount: 100,
    },
    {
        id: '4',
        type: 'inflow',
        round: 'First Round',
        name: 'Krutika Misal',
        detail: 'f20240889@hyderabad.bits-pilani.ac.in',
        amount: 100,
    },
    {
        id: '5',
        type: 'inflow',
        round: 'First Round',
        name: 'Aditya Rayaprolu',
        detail: 'f20230416@hyderabad.bits-pilani.ac.in',
        amount: 100,
    },
    {
        id: '6',
        type: 'inflow',
        round: 'First Round',
        name: 'Sruti',
        detail: 'f20230285@hyderabad.bits-pilani.ac.in',
        amount: 100,
    },
    {
        id: '7',
        type: 'inflow',
        round: 'First Round',
        name: 'Aviral Dwivedi',
        detail: 'f20240477@hyderabad.bits-pilani.ac.in',
        amount: 50,
    },
    {
        id: '8',
        type: 'inflow',
        round: 'First Round',
        name: 'Pratyush Nair',
        detail: 'f20230160@hyderabad.bits-pilani.ac.in',
        amount: 50,
    },
    {
        id: '9',
        type: 'inflow',
        round: 'First Round',
        name: 'Umaang Khambhati',
        detail: 'f20221339@hyderabad.bits-pilani.ac.in',
        amount: 50,
    },
    {
        id: '10',
        type: 'inflow',
        round: 'First Round',
        name: 'Neil',
        detail: 'f20221407@hyderabad.bits-pilani.ac.in',
        amount: 50,
    },
    {
        id: '11',
        type: 'inflow',
        round: 'First Round',
        name: 'Harshal Shah',
        detail: 'f20230055@hyderabad.bits-pilani.ac.in',
        amount: 20,
    },
    // Second Round
    {
        id: '12',
        type: 'inflow',
        round: 'Second Round',
        name: 'Ankit Kumar Manna',
        detail: 'f20240375@hyderabad.bits-pilani.ac.in',
        amount: 51,
    },
    {
        id: '13',
        type: 'inflow',
        round: 'Second Round',
        name: 'Kaushik Varma Viswaraju',
        detail: 'f20240435@hyderabad.bits-pilani.ac.in',
        amount: 1000,
    },
    {
        id: '14',
        type: 'inflow',
        round: 'Second Round',
        name: 'Alekhya Kamasani',
        detail: 'f20232008@hyderabad.bits-pilani.ac.in',
        amount: 10,
    },
    {
        id: '15',
        type: 'inflow',
        round: 'Second Round',
        name: 'Aditya Renake',
        detail: 'f20230112@hyderabad.bits-pilani.ac.in',
        amount: 100,
    },
    {
        id: '16',
        type: 'inflow',
        round: 'Second Round',
        name: 'Druhin Sourya Datta',
        detail: 'f20240182@hyderabad.bits-pilani.ac.in',
        amount: 200,
    },
    {
        id: '17',
        type: 'inflow',
        round: 'Second Round',
        name: 'Aman Ranjan',
        detail: 'f20220141@hyderabad.bits-pilani.ac.in',
        amount: 501,
    },
    {
        id: '18',
        type: 'inflow',
        round: 'Second Round',
        name: 'Umaang Khambhati',
        detail: 'f20221339@hyderabad.bits-pilani.ac.in',
        amount: 301,
    },
    {
        id: '19',
        type: 'inflow',
        round: 'Second Round',
        name: 'Pratyush Nair',
        detail: 'f20230160@hyderabad.bits-pilani.ac.in',
        amount: 200,
    },
    {
        id: '20',
        type: 'inflow',
        round: 'Second Round',
        name: 'Vikrant Shrikant Jadhav',
        detail: 'f20240368@hyderabad.bits-pilani.ac.in',
        amount: 250,
    },
    {
        id: '21',
        type: 'inflow',
        round: 'Second Round',
        name: 'Sidhant Sinha',
        detail: 'f20250520@hyderabad.bits-pilani.ac.in',
        amount: 20,
    },
]

const outFlowTransactions: Transaction[] = [
    {
        id: '1',
        type: 'outflow',
        round: '',
        name: 'Domain: 2025-2026',
        detail: '',
        amount: 800,
    },
    {
        id: '2',
        type: 'outflow',
        round: '',
        name: 'Domain: 2026-2027',
        detail: '',
        amount: 1601.16,
    }
]

const transactions: Transaction[] = [
    ...inFlowTransactions,
    ...outFlowTransactions,
]

const hashString = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

const shuffle = (items: Transaction[], seed: string) =>
    [...items].sort(
        (a, b) => hashString(`${seed}-${a.id}`) - hashString(`${seed}-${b.id}`)
    )

const formatAmount = (n: number) => `₹${n.toLocaleString('en-IN')}`

const sumByType = (items: Transaction[], type: TransactionType) =>
    items.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0)

function TransactionRow({ tx }: { tx: Transaction }) {
    const isInflow = tx.type === 'inflow'
    return (
        <div className="flex items-center justify-between gap-4 py-3 px-4 md:px-5 hover:bg-white/5 transition-colors">
            <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base font-medium text-white truncate">
                    {tx.name}
                </p>
                {tx.detail && (
                    <p className="text-xs md:text-sm text-gray-300 truncate mt-0.5">
                        {tx.detail}
                    </p>
                )}
            </div>
            <span
                className={`text-sm md:text-base font-semibold tabular-nums whitespace-nowrap ${
                    isInflow ? 'text-emerald-400' : 'text-rose-400'
                }`}
            >
                {isInflow ? '+' : '−'}
                {formatAmount(tx.amount)}
            </span>
        </div>
    )
}

export default function LedgerPage() {
    const [filter, setFilter] = useState<TransactionType>('inflow')

    const totalInflow = useMemo(() => sumByType(transactions, 'inflow'), [])
    const totalOutflow = useMemo(() => sumByType(transactions, 'outflow'), [])
    const balance = totalInflow - totalOutflow

    const filtered = useMemo(
        () => transactions.filter(t => t.type === filter),
        [filter]
    )

    const groupedInflow = useMemo(() => {
        if (filter !== 'inflow') return null
        const rounds = Array.from(
            new Set(
                filtered
                    .map(t => t.round)
                    .filter((round): round is string => round !== undefined)
            )
        )
        return rounds.map(round => ({
            round: round!,
            items: shuffle(
                filtered.filter(t => t.round === round),
                round!
            ),
        }))
    }, [filter, filtered])

    const shuffledOutflow = useMemo(
        () => (filter === 'outflow' ? shuffle(filtered, 'outflow') : []),
        [filter, filtered]
    )

    return (
        <>
            <Meta title="Ledger | handoutsforyou" />
            <Menu doNotShowMenu={true} />

            <div className="w-full px-4 md:px-8 pb-8 min-h-screen">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 md:p-8">
                        <header className="mb-6 md:mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Ledger
                            </h1>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-4 md:p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                                    Balance
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-amber-400 tabular-nums">
                                    {formatAmount(balance)}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 md:p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                                    Inflow
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums">
                                    {formatAmount(totalInflow)}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 md:p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                                    Outflow
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-rose-400 tabular-nums">
                                    {formatAmount(totalOutflow)}
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex rounded-lg bg-white/5 p-1 mb-5">
                            {(['inflow', 'outflow'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFilter(type)}
                                    className={`px-5 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                                        filter === type
                                            ? 'bg-amber-400/20 text-amber-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="rounded-lg bg-white/5">
                            {filter === 'inflow' && groupedInflow ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                                    {groupedInflow.map(({ round, items }) => (
                                        <section key={round}>
                                            <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-white/5">
                                                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                                    {round}
                                                </h2>
                                                <span className="text-xs text-gray-300 tabular-nums">
                                                    {formatAmount(
                                                        items.reduce(
                                                            (s, t) =>
                                                                s + t.amount,
                                                            0
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                            <div className="divide-y divide-white/10">
                                                {items.map(tx => (
                                                    <TransactionRow
                                                        key={tx.id}
                                                        tx={tx}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            ) : shuffledOutflow.length > 0 ? (
                                <div className="divide-y divide-white/10">
                                    {shuffledOutflow.map(tx => (
                                        <TransactionRow key={tx.id} tx={tx} />
                                    ))}
                                </div>
                            ) : (
                                <p className="py-16 text-center text-sm text-gray-300">
                                    No outflows recorded yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
