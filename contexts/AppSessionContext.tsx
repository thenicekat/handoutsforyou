/**
 * App session context for PWA state management.
 * Manages PWA installation detection, online/offline status, install prompts,
 * and session state with automatic refresh on app visibility changes.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { pwaSessionManager } from '@/utils/authCache'

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

        // Handle visibility change (PWA app switching)
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                // Refresh session when app becomes visible
                try {
                    const isAuthenticated =
                        await pwaSessionManager.getSessionStatus()
                    setSessionStatus(
                        isAuthenticated ? 'authenticated' : 'unauthenticated'
                    )
                } catch (error) {
                    setSessionStatus('unauthenticated')
                }
            }
        }

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
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Initial session check
        const checkInitialSession = async () => {
            try {
                const isAuthenticated =
                    await pwaSessionManager.getSessionStatus()
                setSessionStatus(
                    isAuthenticated ? 'authenticated' : 'unauthenticated'
                )
            } catch (error) {
                setSessionStatus('unauthenticated')
            }
        }

        checkInitialSession()

        // Cleanup
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            )
            window.removeEventListener('appinstalled', handleAppInstalled)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [])

    const showInstallPrompt = () => {
        if (installPrompt) {
            ;(installPrompt as any).prompt()
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
