import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

import type { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAntiScraping } from '../hooks/useAntiScraping'

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

    useAntiScraping({
        redirectOnBot: true,
        redirectUrl: '/error',
        enableMonitoring: true,
    })

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') return

        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            return false
        }

        // Disable keyboard shortcuts for copy/paste/select
        // Note: DevTools shortcuts (F12, Ctrl+Shift+I, etc.) are handled by disable-devtool library
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable Ctrl+A (Select All)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) {
                e.preventDefault()
                return false
            }

            // Disable Ctrl+C (Copy)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
                e.preventDefault()
                return false
            }

            // Disable Ctrl+V (Paste)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
                e.preventDefault()
                return false
            }

            // Disable Ctrl+X (Cut)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 88) {
                e.preventDefault()
                return false
            }

            // Disable Ctrl+S (Save Page)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
                e.preventDefault()
                return false
            }

            // Disable Ctrl+U (View Source)
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
                e.preventDefault()
                return false
            }
        }

        // Disable copy
        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault()
            return false
        }

        // Disable cut
        const handleCut = (e: ClipboardEvent) => {
            e.preventDefault()
            return false
        }

        // Disable paste
        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault()
            return false
        }

        // Disable text selection via drag
        const handleSelectStart = (e: Event) => {
            e.preventDefault()
            return false
        }

        // Disable drag
        const handleDragStart = (e: DragEvent) => {
            e.preventDefault()
            return false
        }

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('copy', handleCopy)
        document.addEventListener('cut', handleCut)
        document.addEventListener('paste', handlePaste)
        document.addEventListener('selectstart', handleSelectStart)
        document.addEventListener('dragstart', handleDragStart)

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('copy', handleCopy)
            document.removeEventListener('cut', handleCut)
            document.removeEventListener('paste', handlePaste)
            document.removeEventListener('selectstart', handleSelectStart)
            document.removeEventListener('dragstart', handleDragStart)
        }
    }, [])

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
            </Head>

            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
