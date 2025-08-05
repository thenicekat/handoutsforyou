import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

import type { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import Script from 'next/script'

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
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8538529975248100`}
                strategy="lazyOnload"
                crossOrigin="anonymous"
            ></Script>

            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
