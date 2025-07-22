import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

import type { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import Head from 'next/head'

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    if (
        typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.userAgent
    ) {
        const disableDevtool = require('disable-devtool')
        if (process.env.NODE_ENV !== 'development') disableDevtool()
    }

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
            </Head>

            <SessionProvider
                session={session}
                refetchOnWindowFocus={false}
                refetchInterval={30 * 60}
                refetchWhenOffline={false}
            >
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
