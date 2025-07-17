import { getMetaConfig } from '@/utils/meta-config';
import Meta from '@/components/Meta';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusCode from '@/components/StatusCode'
import { signIn } from 'next-auth/react'

const errorMessages = {
    UnauthorizedEmail: {
        title: 'Unauthorized Email',
        message:
            'This application is only accessible to BITS Pilani students and alumni.',
        action: 'Please sign in with your BITS email address.',
    },
    HyderabadOnly: {
        title: 'Campus Restricted',
        message:
            'This feature is only available for BITS Hyderabad campus students.',
        action: 'Please use your BITS Hyderabad email address.',
    },
    Unauthorized: {
        title: 'Sign in Required',
        message: 'You need to be signed in to access this page.',
        action: 'Please sign in with your BITS email address.',
    },
    Default: {
        title: 'Authentication Error',
        message: 'There was a problem with your authentication.',
        action: 'Please try signing in again.',
    },
}

export default function ErrorPage() {
    const router = useRouter()
    const [errorType, setErrorType] =
        useState<keyof typeof errorMessages>('Default')

    useEffect(() => {
        const { error } = router.query
        if (error && typeof error === 'string' && error in errorMessages) {
            setErrorType(error as keyof typeof errorMessages)
        }
    }, [router.query])

    const errorContent = errorMessages[errorType]

    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

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
            <div className="min-h-screen flex flex-col items-center pt-32 p-4">
                <Meta />

                <div className="w-full md:w-2/5 mx-auto">
                    <StatusCode
                        code={errorType === 'Unauthorized' ? 401 : 403}
                    />
                    <div className="text-center -mt-4">
                        <h3 className="text-lg font-semibold text-white">
                            {errorContent.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-200">
                            {errorContent.message}
                        </p>
                        <p className="mt-1 text-sm text-gray-300">
                            {errorContent.action}
                        </p>
                        <div className="mt-4 space-y-3">
                            <button
                                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                                onClick={handleSignIn}
                            >
                                Sign in with Google
                            </button>
                            <div>
                                <Link
                                    href="/"
                                    className="inline-block text-gray-200 hover:text-white text-sm hover:underline"
                                >
                                    Go to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
