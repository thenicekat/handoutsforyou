/**
 * Auth utilities with caching and PWA lifecycle management.
 * Provides React hooks for optimized authentication state and session validation
 * with PWA-aware caching that handles app install/visibility events.
 */

import { EMAIL_HEADER } from '@/pages/api/constants'
import { axiosInstance } from './axiosCache'
import { NextApiRequest } from 'next'

export async function checkSessionCached(): Promise<boolean> {
    try {
        const response = await axiosInstance.get('/api/auth/session')
        return !response.data.error
    } catch (error) {
        return false
    }
}

export function getUserEmailFromHeaders(req: NextApiRequest): string | null {
    const sessionValidated = req.headers['x-session-validated']
    const encodedEmail = req.headers[EMAIL_HEADER]

    if (sessionValidated === 'true' && encodedEmail) {
        try {
            return Buffer.from(encodedEmail as string, 'base64').toString('utf-8')
        } catch (error) {
            return null
        }
    }

    return null
}

// PWA-specific session handling
export class PWASessionManager {
    private static instance: PWASessionManager
    private sessionCache: {
        isAuthenticated: boolean
        timestamp: number
    } | null = null
    private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

    private constructor() {
        // Listen for PWA lifecycle events
        if (typeof window !== 'undefined') {
            window.addEventListener(
                'beforeinstallprompt',
                this.handleBeforeInstallPrompt
            )
            window.addEventListener('appinstalled', this.handleAppInstalled)
            document.addEventListener(
                'visibilitychange',
                this.handleVisibilityChange
            )
        }
    }

    static getInstance(): PWASessionManager {
        if (!PWASessionManager.instance) {
            PWASessionManager.instance = new PWASessionManager()
        }
        return PWASessionManager.instance
    }

    private handleBeforeInstallPrompt = () => {
        // Refresh session cache when PWA install prompt appears
        this.sessionCache = null
    }

    private handleAppInstalled = () => {
        // Clear session cache when PWA is installed
        this.sessionCache = null
    }

    private handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            // Clear stale session cache when app becomes visible
            if (
                this.sessionCache &&
                Date.now() - this.sessionCache.timestamp > this.CACHE_DURATION
            ) {
                this.sessionCache = null
            }
        }
    }

    async getSessionStatus(): Promise<boolean> {
        // Return cached result if available and not expired
        if (
            this.sessionCache &&
            Date.now() - this.sessionCache.timestamp < this.CACHE_DURATION
        ) {
            return this.sessionCache.isAuthenticated
        }

        try {
            const isAuthenticated = await checkSessionCached()
            this.sessionCache = {
                isAuthenticated,
                timestamp: Date.now(),
            }
            return isAuthenticated
        } catch (error) {
            return false
        }
    }

    clearCache(): void {
        this.sessionCache = null
    }
}

export const pwaSessionManager = PWASessionManager.getInstance()
