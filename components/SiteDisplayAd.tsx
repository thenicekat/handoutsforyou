import { ResponsiveAdUnit } from 'nextjs-google-adsense'
import { useRouter } from 'next/router'

const DISPLAY_SLOT = "6217320688"
const PUBLISHER_ID = 'pub-8538529975248100'

/**
 * One shared display unit for in-app routes so client-side navigation still has
 * slots to fill (Auto Ads alone are weak on Next.js SPA transitions).
 * Omit on `/` to avoid competing with Auto Ads on the landing entry.
 */
export default function SiteDisplayAd() {
    const router = useRouter()
    if (!DISPLAY_SLOT || router.pathname === '/') {
        return null
    }

    return (
        <div className="w-full flex justify-center px-2 py-3 [&_.adsbygoogle]:mx-auto">
            <ResponsiveAdUnit
                publisherId={PUBLISHER_ID}
                slotId={DISPLAY_SLOT}
                type="site-inline"
                style={{
                    minHeight: 90,
                    maxWidth: 'min(100%, 728px)',
                    width: '100%',
                }}
            />
        </div>
    )
}
