import React, { createContext, useContext, useEffect, useState } from 'react'
import { pwaSessionManager } from '@/utils/optimizedAuth'

interface PWAContextType {
    isInstalled: boolean
    isOnline: boolean
    showInstallPrompt: () => void
    sessionStatus: 'loading' | 'authenticated' | 'unauthenticated'
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [isInstalled, setIsInstalled] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [sessionStatus, setSessionStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null)

    useEffect(() => {
        // Check if app is already installed
        const checkInstalled = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            const isWebapp = (window.navigator as any).standalone === true
            setIsInstalled(isStandalone || isWebapp)
        }

        // Handle install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e)
        }

        // Handle app installed
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
                    const isAuthenticated = await pwaSessionManager.getSessionStatus()
                    setSessionStatus(isAuthenticated ? 'authenticated' : 'unauthenticated')
                } catch (error) {
                    console.error('Session check failed:', error)
                    setSessionStatus('unauthenticated')
                }
            }
        }

        // Initialize
        checkInstalled()
        setIsOnline(navigator.onLine)

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Initial session check
        const checkInitialSession = async () => {
            try {
                const isAuthenticated = await pwaSessionManager.getSessionStatus()
                setSessionStatus(isAuthenticated ? 'authenticated' : 'unauthenticated')
            } catch (error) {
                console.error('Initial session check failed:', error)
                setSessionStatus('unauthenticated')
            }
        }

        checkInitialSession()

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    const showInstallPrompt = () => {
        if (installPrompt) {
            ;(installPrompt as any).prompt()
        }
    }

    return (
        <PWAContext.Provider value={{
            isInstalled,
            isOnline,
            showInstallPrompt,
            sessionStatus
        }}>
            {children}
        </PWAContext.Provider>
    )
}

export function usePWA(): PWAContextType {
    const context = useContext(PWAContext)
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider')
    }
    return context
}