import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { axiosInstance } from '@/utils/axiosCache'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

const contributionTypeLabels: Record<string, string> = {
    course_resource: 'Course Resources',
    course_handout: 'Course Handouts',
    course_review: 'Course Reviews',
    course_pyq: 'Course PYQs',
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

interface ContributionStats {
    total: number
    byType: Record<string, number>
    byUser: Record<string, number>
}

export default function LeaderboardPage() {
    const [stats, setStats] = useState<ContributionStats>({
        total: 0,
        byType: {},
        byUser: {},
    })
    const [isStatsLoading, setIsStatsLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/api/contributions/stats')
            if (!response.data.error) {
                setStats(response.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch contribution stats:', error)
        } finally {
            setIsStatsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return (
        <>
            <Meta />
            <Menu doNotShowMenu={true} />

            <div className="container mx-auto px-4 pt-10 pb-4 flex items-center">
                <div className="w-full max-w-6xl mx-auto mt-8 px-4">
                    {/* Stats Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto mb-8">
                        {isStatsLoading ? (
                            <div className="text-center text-gray-300">
                                Loading contribution stats...
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                    🏆 Leaderboard
                                </h2>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                                        <span>
                                            Progress towards 10000 contributions
                                        </span>
                                        <span>
                                            {Math.min(stats.total, 10000)}/10000
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${Math.min((stats.total / 10000) * 100, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    {stats.total >= 10000 && (
                                        <div className="text-center mt-2 text-green-400 font-semibold">
                                            🎉 Goal achieved! Thank you for your
                                            contributions!
                                        </div>
                                    )}
                                </div>

                                {Object.keys(stats.byType).length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            Contribution Breakdown by Type
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Object.entries(stats.byType).map(
                                                ([type, count]) => (
                                                    <div
                                                        key={type}
                                                        className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                                                    >
                                                        <span className="text-gray-300 text-sm">
                                                            {contributionTypeLabels[
                                                                type
                                                            ] || type}
                                                        </span>
                                                        <span className="text-white font-semibold">
                                                            <CountUp
                                                                end={count}
                                                                duration={1.5}
                                                            />
                                                        </span>
                                                    </div>
                                                )
                                            )}
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
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 10)
                                                .map(
                                                    ([email, count], index) => {
                                                        let medal = ''
                                                        let medalClass = ''
                                                        if (index === 0) {
                                                            medal = '🥇'
                                                            medalClass =
                                                                'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30'
                                                        } else if (
                                                            index === 1
                                                        ) {
                                                            medal = '🥈'
                                                            medalClass =
                                                                'bg-gradient-to-r from-gray-600/20 to-gray-800/20 border-gray-800/30'
                                                        } else if (
                                                            index === 2
                                                        ) {
                                                            medal = '🥉'
                                                            medalClass =
                                                                'bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30'
                                                        } else {
                                                            medal = '📧'
                                                            medalClass =
                                                                'bg-white/5'
                                                        }

                                                        return (
                                                            <div
                                                                key={email}
                                                                className={`${medalClass} rounded-lg p-3 flex justify-between items-center ${index < 3 ? 'border' : ''}`}
                                                            >
                                                                <span className="text-gray-300 text-sm truncate mr-2 flex items-center gap-2">
                                                                    {medal && (
                                                                        <span className="text-lg">
                                                                            {
                                                                                medal
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {`${email}`}
                                                                </span>
                                                                <span className="text-white font-semibold">
                                                                    <CountUp
                                                                        end={
                                                                            count
                                                                        }
                                                                        duration={
                                                                            1.5
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                        </div>
                                        {Object.keys(stats.byUser).length >
                                            10 && (
                                            <div className="text-center mt-4 text-gray-400 text-sm">
                                                Showing top 10 of{' '}
                                                {
                                                    Object.keys(stats.byUser)
                                                        .length
                                                }{' '}
                                                contributors
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <CustomToastContainer containerId="leaderboard" />
        </>
    )
}
