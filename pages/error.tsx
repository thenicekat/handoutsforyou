import Meta from '@/components/Meta'
import StatusCode from '@/components/StatusCode'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const errorMessages = {
    NotFound: {
        code: 404,
        title: 'Page Not Found',
        message:
            'The page you are looking for does not exist. Please check the URL and try again.',
    },
    UnauthorizedEmail: {
        code: 403,
        title: 'Unauthorized Email',
        message:
            'This application is only accessible to BITS Pilani students and alumni. Please sign in with your BITS email address.',
    },
    HyderabadOnly: {
        code: 403,
        title: 'Access Restricted',
        message:
            'This feature is only available for BITS Hyderabad campus students.',
    },
    Unauthorized: {
        code: 401,
        title: 'Sign in Required',
        message:
            'You need to be signed in to access this page. Please sign in with your BITS email address.',
    },
    Default: {
        code: 500,
        title: 'Internal Server Error',
        message:
            'Please try again later. If the problem persists, please contact handoutsforyou@gmail.com.',
    },
}

export default function ErrorPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [errorType, setErrorType] =
        useState<keyof typeof errorMessages>('Default')

    useEffect(() => {
        const { error } = router.query
        if (error && typeof error === 'string' && error in errorMessages) {
            setErrorType(error as keyof typeof errorMessages)
            setIsLoading(false)
        }
    }, [router.query])

    const errorContent = errorMessages[errorType]

    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    return isLoading ? (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
    ) : (
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
                    <StatusCode code={errorContent.code} />
                    <div className="text-center -mt-4">
                        <h3 className="text-lg font-semibold text-white">
                            {errorContent.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-200">
                            {errorContent.message}
                        </p>
                        <div className="mt-4 space-y-3">
                            {errorType === 'Unauthorized' && (
                                <button
                                    className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                                    onClick={handleSignIn}
                                >
                                    Sign in with Google
                                </button>
                            )}
                            <div>
                                <Link
                                    href="/"
                                    className="inline-block text-gray-200 hover:text-white text-sm hover:underline"
                                >
                                    Go back to Home.
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
