import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import Head from 'next/head'

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
      </Head>

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}