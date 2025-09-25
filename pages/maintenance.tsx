import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { RESOURCE_COUNTS } from '@/pages/index'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

export default function MaintenancePage() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 85) return 85
                return prev + Math.random() * 2
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Meta />
            <Menu doNotShowMenu={true} />

            <div className="container mx-auto px-4 pt-10 pb-4 flex items-center">
                <div className="w-full max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-block p-3 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full mb-4">
                            <div className="text-4xl md:text-5xl">🛠️</div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Shh... we&apos;re getting
                            <br />
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                prettier 👉👈
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                            Reimagining how you access and discover academic
                            resources at BITS.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20 max-w-2xl mx-auto">
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-semibold text-sm">
                                    <CountUp
                                        end={progress}
                                        duration={2}
                                        decimals={1}
                                    />
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <p className="text-gray-300 text-xs text-center">
                            Almost there! Thank you for your patience.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp
                                    end={RESOURCE_COUNTS.handouts}
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-xs text-gray-400">
                                Handouts
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp
                                    end={RESOURCE_COUNTS.courseReviews}
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-xs text-gray-400">Reviews</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.ps1Cutoffs +
                                        RESOURCE_COUNTS.ps2Cutoffs
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-xs text-gray-400">
                                PS Cutoffs
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp end={99} duration={3} />%
                            </div>
                            <div className="text-xs text-gray-400">Uptime</div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-center">
                            <a
                                href="https://github.com/thenicekat/handoutsforyou"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold py-2 px-5 rounded-lg hover:scale-105 transition-transform text-sm"
                            >
                                ⭐ Want to Help Make This Better?!
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
