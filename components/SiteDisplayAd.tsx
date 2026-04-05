import { useRouter } from 'next/router'
import { useEffect } from 'react'

const DISPLAY_SLOT = '6217320688'
const PUBLISHER_ID = 'pub-8538529975248100'

/**
 * Manual responsive unit. We avoid `ResponsiveAdUnit` from `nextjs-google-adsense`:
 * it uses `useEffect(() => push())` with no dependency array, so `push` runs after
 * every parent re-render (Menu updates star count, menu open, etc.). AdSense then
 * throws (slot already filled) and Next reports a client-side exception.
 */
export default function SiteDisplayAd() {
    const router = useRouter()

    useEffect(() => {
        if (!DISPLAY_SLOT || router.pathname === '/') return
        try {
            const win = window as Window & { adsbygoogle?: object[] }
            ;(win.adsbygoogle = win.adsbygoogle || []).push({})
        } catch {
            /* AdSense can throw if script is late or slot state is wrong */
        }
    }, [router.asPath, router.pathname])

    if (!DISPLAY_SLOT || router.pathname === '/') {
        return null
    }

    return (
        <div className="w-full flex justify-center px-2 py-3 [&_.adsbygoogle]:mx-auto">
            <ins
                key={router.asPath}
                className="adsbygoogle"
                style={{
                    display: 'block',
                    minHeight: 90,
                    maxWidth: 'min(100%, 728px)',
                    width: '100%',
                }}
                data-ad-client={PUBLISHER_ID}
                data-ad-slot={DISPLAY_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
