import { useEffect } from 'react'
import { detectBot, monitorSuspiciousActivity } from '../utils/antiScraping'

/**
 * Custom hook to enable anti-scraping protections
 * Use this in any component where you want to add extra protection
 */
export const useAntiScraping = (options?: {
    redirectOnBot?: boolean
    redirectUrl?: string
    enableMonitoring?: boolean
}) => {
    const {
        redirectOnBot = true,
        redirectUrl = '/error',
        enableMonitoring = true,
    } = options || {}

    useEffect(() => {
        // Skip in development
        if (process.env.NODE_ENV === 'development') return

        // Detect bots
        if (redirectOnBot && detectBot()) {
            window.location.href = redirectUrl
            return
        }

        // Monitor suspicious activity
        if (enableMonitoring) {
            monitorSuspiciousActivity()
        }

        // Additional protection: Detect console usage
        const detectConsoleUsage = () => {
            const element = new Image()
            Object.defineProperty(element, 'id', {
                get: function () {
                    console.warn('Console usage detected')
                    // You could take action here
                    return 'console-trap'
                },
            })
            console.log(element)
        }

        detectConsoleUsage()

        // Prevent printing
        const handleBeforePrint = (e: Event) => {
            e.preventDefault()
            alert('Printing is disabled on this website')
            return false
        }

        window.addEventListener('beforeprint', handleBeforePrint)

        // Cleanup
        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint)
        }
    }, [redirectOnBot, redirectUrl, enableMonitoring])
}
