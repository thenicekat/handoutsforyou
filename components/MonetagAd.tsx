import {
    MONETAG_INPAGE_PUSH_INLINE,
    MONETAG_INTERSTITIAL_BANNER_INLINE,
    MONETAG_VIGNETTE_BANNER_INLINE,
} from '@/utils/monetagExtraInline'
import { useEffect } from 'react'

type AdFormat = 'interstitial-banner' | 'vignette-banner' | 'inpage-push'

interface MonetagAdProps {
    adFormat: AdFormat
    id?: string
}

const AD_FORMAT_MAP: Record<AdFormat, string> = {
    'interstitial-banner': MONETAG_INTERSTITIAL_BANNER_INLINE,
    'vignette-banner': MONETAG_VIGNETTE_BANNER_INLINE,
    'inpage-push': MONETAG_INPAGE_PUSH_INLINE,
}

export default function MonetagAd({ adFormat, id }: MonetagAdProps) {
    const adScript = AD_FORMAT_MAP[adFormat]
    const scriptId = id || `monetag-${adFormat}`

    useEffect(() => {
        if (!adScript) return

        // Create and inject the wrapper script
        const script = document.createElement('script')
        script.id = scriptId
        script.type = 'text/javascript'
        script.innerHTML = adScript
        document.body.appendChild(script)

        // Wait a tick for Monetag to create its script, then store reference
        const createdScripts: HTMLScriptElement[] = []
        setTimeout(() => {
            const monetagScripts =
                document.querySelectorAll('script[data-zone]')
            monetagScripts.forEach(s => {
                if (
                    s.getAttribute('src')?.includes('vignette.min.js') ||
                    s.getAttribute('src')?.includes('tag.min.js')
                ) {
                    createdScripts.push(s as HTMLScriptElement)
                }
            })
        }, 0)

        return () => {
            // Remove the wrapper script
            const existing = document.getElementById(scriptId)
            if (existing) {
                existing.remove()
            }

            // Remove scripts we stored references to
            createdScripts.forEach(s => {
                if (s.parentNode) {
                    s.remove()
                }
            })
        }
    }, [adScript, scriptId])

    // Optionally render a placeholder div for the ad
    return <div id={`ad-container-${scriptId}`}></div>
}
