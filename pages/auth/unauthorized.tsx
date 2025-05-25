import React from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import StatusCode from '@/components/StatusCode'

export default function Unauthorized() {
    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    return (
        <>
            <nav className="fixed top-0 right-0 left-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between h-16 px-4 md:px-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <h1 className="text-lg font-semibold text-black dark:text-white">H4U.</h1>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen flex flex-col items-center pt-32 p-4">
                <div className="w-full md:w-2/5 mx-auto">
                    <StatusCode code={401} />
                    <div className="text-center -mt-4">
                        <h3 className="text-lg font-semibold text-white">
                            You need to be signed in to access this page
                        </h3>
                        <div className="mt-4">
                            <button 
                                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                                onClick={handleSignIn}
                            >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 