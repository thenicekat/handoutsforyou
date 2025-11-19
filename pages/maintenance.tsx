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
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                h4u update.
                                <br />
                                👉👈
                            </span>
                        </h1>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-4xl mx-auto">
                        <div className="text-gray-300 text-left space-y-4">
                            <p>
                                I really really did not want to post this but
                                the amount of effort put towards it from the GB
                                side is disappointing. It is sad how everyone
                                wants to use it, but no one wants to contribute
                                to it. In the past 3-4 months, hardly any
                                resources were uploaded, barely any PYQs were
                                posted. If you want to go ahead and use drive,
                                it is completely your call.
                            </p>
                            <p>
                                At one point I was going to put money out of my
                                own pocket if someone could maintain it, but
                                some kids came up and said the GB will
                                contribute and own it, but no, nothing changed.
                            </p>
                            <p>
                                It was not even that hard to upload stuff also
                                lmao, I did ensure that much at least. I really
                                really wanted h4u to be one project that did not
                                die out, but yeah, rest in peace?
                            </p>
                            <p className="text-amber-300 font-medium">
                                It was good while it lasted. I guess? IF THERE
                                IS ANYONE TO BLAME FOR THIS, IT IS YOU GUYS.
                            </p>
                            <p className="text-green-300 font-medium">
                                If GB actually manages to get legitimate
                                traction and effort towards this project, I will
                                consider bringing it back.
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg text-center m-6">
                        Reimagining how you access and discover academic
                        resources at BITS.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.courseHandouts +
                                        RESOURCE_COUNTS.coursePrerequisites +
                                        RESOURCE_COUNTS.coursePyqs +
                                        RESOURCE_COUNTS.courseReviews +
                                        RESOURCE_COUNTS.courseResources +
                                        RESOURCE_COUNTS.courseGrading
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-xs text-gray-400">
                                Course Insights
                            </div>
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
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.placementCtcs +
                                        RESOURCE_COUNTS.siCompanies +
                                        RESOURCE_COUNTS.siChronicles +
                                        RESOURCE_COUNTS.siResources
                                    }
                                    duration={3}
                                />
                                +
                            </div>
                            <div className="text-xs text-gray-400">
                                Zob Data
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">
                                <CountUp
                                    end={
                                        RESOURCE_COUNTS.links +
                                        RESOURCE_COUNTS.higherStudiesResources
                                    }
                                    duration={3}
                                />
                            </div>
                            <div className="text-xs text-gray-400">
                                Other Resources
                            </div>
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
