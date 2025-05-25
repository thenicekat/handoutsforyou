import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const errorMessages = {
  UnauthorizedEmail: {
    title: 'Unauthorized Email',
    message: 'This application is only accessible to BITS Pilani students and alumni.',
    action: 'Please sign in with your BITS email address.'
  },
  HyderabadOnly: {
    title: 'Campus Restricted',
    message: 'This feature is only available for BITS Hyderabad campus students.',
    action: 'Please use your BITS Hyderabad email address.'
  },
  Default: {
    title: 'Authentication Error',
    message: 'There was a problem with your authentication.',
    action: 'Please try signing in again.'
  }
}

export default function ErrorPage() {
  const router = useRouter()
  const [errorType, setErrorType] = useState<keyof typeof errorMessages>('Default')

  useEffect(() => {
    const { error } = router.query
    if (error && typeof error === 'string' && error in errorMessages) {
      setErrorType(error as keyof typeof errorMessages)
    }
  }, [router.query])

  const errorContent = errorMessages[errorType]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{errorContent.title} - HandoutsForYou</title>
        <meta name="description" content="Authentication error page" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {errorContent.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {errorContent.message}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {errorContent.action}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Link>
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 