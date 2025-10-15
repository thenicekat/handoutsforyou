import {
    MONETAG_INPAGE_PUSH_INLINE,
    MONETAG_INTERSTITIAL_BANNER_INLINE,
    MONETAG_VIGNETTE_BANNER_INLINE,
} from '@/utils/monetagExtraInline'
import Script from 'next/script'

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

    if (!adScript) {
        return null
    }

    const scriptId = id || `monetag-${adFormat}`

    return (
        <Script
            id={scriptId}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: adScript,
            }}
        />
    )
}
