import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

interface ContributionStats {
    total: number
    pending: number
    approved: number
    byType: Record<string, number>
    byUser: Record<string, number>
}

interface ContributionProgressProps {
    refreshTrigger?: number
}

export default function ContributionProgress({
    refreshTrigger,
}: ContributionProgressProps) {
    const [stats, setStats] = useState<ContributionStats>({
        total: 0,
        pending: 0,
        approved: 0,
        byType: {},
        byUser: {},
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/contributions/stats')
            const data = await res.json()
            if (!data.error) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch contribution stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [refreshTrigger])

    const contributionTypeLabels: Record<string, string> = {
        course_resource: 'Course Resources',
        course_review: 'Course Reviews',
        ps1_cutoff: 'PS1 Cutoffs',
        ps2_cutoff: 'PS2 Cutoffs',
        placement_resource: 'Placement Resources',
        higherstudies_resource: 'Higher Studies Resources',
        course_grading: 'Course Grading',
        ps1_review: 'PS1 Reviews',
        ps2_review: 'PS2 Reviews',
        placement_ctc: 'Placement CTCs',
        si_company: 'SI Companies',
    }

    if (isLoading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto mb-8">
                <div className="text-center text-gray-300">
                    Loading contribution stats...
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🚀 Maintenance Mode.
            </h2>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-400">
                        <CountUp end={stats.total} duration={2} />
                    </div>
                    <div className="text-sm text-gray-300">
                        Total Contributions
                    </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                        <CountUp end={stats.approved} duration={2} />
                    </div>
                    <div className="text-sm text-gray-300">Approved</div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        <CountUp end={stats.pending} duration={2} />
                    </div>
                    <div className="text-sm text-gray-300">Pending</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Progress towards 5000 contributions</span>
                    <span>{Math.min(stats.total, 5000)}/5000</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${Math.min((stats.total / 100) * 100, 100)}%`,
                        }}
                    ></div>
                </div>
                {stats.total >= 100 && (
                    <div className="text-center mt-2 text-green-400 font-semibold">
                        🎉 Goal achieved! Thank you for your contributions!
                    </div>
                )}
            </div>

            {/* Contribution Type Breakdown */}
            {Object.keys(stats.byType).length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Contribution Breakdown by Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(stats.byType).map(([type, count]) => (
                            <div
                                key={type}
                                className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                            >
                                <span className="text-gray-300 text-sm">
                                    {contributionTypeLabels[type] || type}
                                </span>
                                <span className="text-white font-semibold">
                                    <CountUp end={count} duration={1.5} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Breakdown */}
            {Object.keys(stats.byUser).length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Top Contributors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(stats.byUser)
                            .sort(([, a], [, b]) => b - a) // Sort by contribution count descending
                            .slice(0, 10) // Show top 10 contributors
                            .map(([email, count]) => (
                                <div
                                    key={email}
                                    className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                                >
                                    <span className="text-gray-300 text-sm truncate mr-2">
                                        {email === 'Anonymous'
                                            ? '🔒 Anonymous'
                                            : `📧 ${email}`}
                                    </span>
                                    <span className="text-white font-semibold">
                                        <CountUp end={count} duration={1.5} />
                                    </span>
                                </div>
                            ))}
                    </div>
                    {Object.keys(stats.byUser).length > 10 && (
                        <div className="text-center mt-4 text-gray-400 text-sm">
                            Showing top 10 of {Object.keys(stats.byUser).length}{' '}
                            contributors
                        </div>
                    )}
                </div>
            )}

            {stats.total === 0 && (
                <div className="text-center text-gray-400 py-8">
                    <div className="text-xl mb-4">
                        🌱 Be the first to contribute!
                    </div>
                </div>
            )}
        </div>
    )
}
