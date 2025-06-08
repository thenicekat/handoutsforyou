import Menu from '@/components/Menu'
import StatusCode from '@/components/StatusCode'

export default function Custom503() {
    return (
        <>
            <Menu />
            <div className="flex flex-col md:flex-row items-center justify-center text-center p-6">
                <StatusCode code={503} />
                <div className="max-w-xl">
                    <p className="text-lg mt-4">
                        This project&apos;s currently running on vibes and
                        broken dreams. 💔 Everyone wants it to work flawlessly,
                        but no one wants to contribute. Classic, right?
                    </p>
                    <p className="text-md mt-4">
                        Still, expectations are sky-high — all without a dev in
                        sight.
                    </p>
                    <p className="mt-4 text-lg italic">
                        Let&apos;s get back to pretending everything&apos;s fine
                        🙂
                    </p>
                </div>
            </div>
        </>
    )
}
