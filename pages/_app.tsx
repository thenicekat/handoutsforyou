import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

import type { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { GoogleAdSense } from 'next-google-adsense'
import { MONETAG_VIGNETTE_BANNER_INLINE } from '../utils/monetagExtraInline'


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
                {MONETAG_VIGNETTE_BANNER_INLINE && (
                    <Script
                        id="monetag-vignette"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_VIGNETTE_BANNER_INLINE,
                        }}
                    />
                )}
            </Head>

            <GoogleAdSense publisherId="pub-8538529975248100" />

            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
