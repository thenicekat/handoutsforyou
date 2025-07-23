import Meta from '@/components/Meta'
import StatusCode from '@/components/StatusCode'
import Link from 'next/link'

export default function ErrorPage() {
    return (
        <>
            <nav className="fixed top-0 right-0 left-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between h-16 px-4 md:px-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <h1 className="text-lg font-semibold text-black dark:text-white">
                                h4u.
                            </h1>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex flex-col items-center p-4">
                <Meta />

                <div className="w-full md:w-2/5 mx-auto">
                    <StatusCode code={503} />
                    <div className="text-center -mt-4">
                        <h3 className="text-lg font-semibold text-white">
                            Maintenance Mode
                        </h3>
                        <p className="mt-2 text-sm text-gray-200">
                            This project&apos;s currently running on vibes and
                            broken dreams. 💔 Everyone wants it to work
                            flawlessly, but no one wants to contribute. Classic,
                            right? Still, expectations are sky- high — all
                            without a dev in sight.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
