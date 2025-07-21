/**
 * App session context for PWA state management.
 * Manages PWA installation detection, online/offline status, install prompts,
 * and session state with automatic refresh on app visibility changes.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AppSessionContextType {
    isInstalled: boolean
    isOnline: boolean
    showInstallPrompt: () => void
    sessionStatus: 'loading' | 'authenticated' | 'unauthenticated'
}

const AppSessionContext = createContext<AppSessionContextType | undefined>(
    undefined
)

export function AppSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isInstalled, setIsInstalled] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [sessionStatus, setSessionStatus] = useState<
        'loading' | 'authenticated' | 'unauthenticated'
    >('loading')
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null)

    useEffect(() => {
        // Check if app is already installed.
        const checkInstalled = () => {
            const isStandalone = window.matchMedia(
                '(display-mode: standalone)'
            ).matches
            const isWebapp = (window.navigator as any).standalone === true
            setIsInstalled(isStandalone || isWebapp)
        }

        // Prompt user to install.
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e)
        }

        const handleAppInstalled = () => {
            setIsInstalled(true)
            setInstallPrompt(null)
        }

        // Handle online/offline status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)


        checkInstalled()
        setIsOnline(navigator.onLine)

        // Add event listeners
        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )
        window.addEventListener('appinstalled', handleAppInstalled)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Cleanup
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            )
            window.removeEventListener('appinstalled', handleAppInstalled)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const showInstallPrompt = () => {
        if (installPrompt) {
            ; (installPrompt as any).prompt()
        }
    }

    return (
        <AppSessionContext.Provider
            value={{
                isInstalled,
                isOnline,
                showInstallPrompt,
                sessionStatus,
            }}
        >
            {children}
        </AppSessionContext.Provider>
    )
}

export function useAppSession(): AppSessionContextType {
    const context = useContext(AppSessionContext)
    if (context === undefined) {
        throw new Error(
            'useAppSession must be used within an AppSessionProvider'
        )
    }
    return context
}
