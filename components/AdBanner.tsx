import Router from 'next/router'
import { useEffect } from 'react'

declare global {
    interface Window {
        adsbygoogle: unknown[]
    }
}

interface AdsBannerProps {
    'data-ad-slot': string
    'data-ad-format': string
    'data-full-width-responsive': string
    'data-ad-layout'?: string
}

const AdBanner = (props: AdsBannerProps) => {
    useEffect(() => {
        const handleRouteChange = () => {
            const intervalId = setInterval(() => {
                try {
                    // Check if the 'ins' element already has an ad in it
                    if (window.adsbygoogle) {
                        window.adsbygoogle.push({})
                        clearInterval(intervalId)
                    }
                } catch (err) {
                    // Handle AdSense errors gracefully
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('[AdSense] Error (expected on localhost)');
                    }
                    clearInterval(intervalId) // Ensure we clear interval on errors too
                }
            }, 100)
            return () => clearInterval(intervalId) // Clear interval on component unmount
        }

        // Run the function when the component mounts
        handleRouteChange()

        // Subscribe to route changes
        if (typeof window !== 'undefined') {
            Router.events.on('routeChangeComplete', handleRouteChange)

            // Unsubscribe from route changes when the component unmounts
            return () => {
                Router.events.off('routeChangeComplete', handleRouteChange)
            }
        }
    }, [])

    return (
        <ins
            className="adsbygoogle adbanner-customize m-2 max-w-7xl place-self-center"
            style={{
                display: 'block',
                minHeight: process.env.NODE_ENV === 'development' ? '50px' : 'auto', // Ensure ad has minimum size
                minWidth: process.env.NODE_ENV === 'development' ? '320px' : 'auto',
                overflow: 'hidden',
                border:
                    process.env.NODE_ENV === 'development'
                        ? '1px solid red'
                        : 'none',
                background:
                    process.env.NODE_ENV === 'development'
                        ? 'rgba(255, 0, 0, 0.1)'
                        : 'none',
            }}
            data-adtest="on"
            data-ad-client="ca-pub-8538529975248100"
            {...props}
        />
    )
}
export default AdBanner
