import {
    MONETAG_INPAGE_PUSH_CORE,
    MONETAG_INPAGE_PUSH_LOADER,
    MONETAG_INTERSTITIAL_BANNER_INLINE,
    MONETAG_VIGNETTE_BANNER_CORE,
    MONETAG_VIGNETTE_BANNER_LOADER,
} from '@/utils/monetagExtraInline'
import Script from 'next/script'

interface MonetagAdComponentProps {
    adFormat: 'inpage-push' | 'vignette-banner' | 'interstitial'
    pageId?: string
}

const MonetagAdComponent: React.FC<MonetagAdComponentProps> = ({
    adFormat,
    pageId = '',
}) => {
    const coreId = `monetag-${adFormat}-core${pageId ? `-${pageId}` : ''}`
    const loaderId = `monetag-${adFormat}-loader${pageId ? `-${pageId}` : ''}`

    if (adFormat === 'inpage-push') {
        return (
            <>
                {MONETAG_INPAGE_PUSH_CORE && (
                    <Script
                        id={coreId}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_INPAGE_PUSH_CORE,
                        }}
                    />
                )}
                {MONETAG_INPAGE_PUSH_LOADER && (
                    <Script
                        id={loaderId}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_INPAGE_PUSH_LOADER,
                        }}
                    />
                )}
            </>
        )
    } else if (adFormat === 'vignette-banner') {
        return (
            <>
                {MONETAG_VIGNETTE_BANNER_CORE && (
                    <Script
                        id={coreId}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_VIGNETTE_BANNER_CORE,
                        }}
                    />
                )}
                {MONETAG_VIGNETTE_BANNER_LOADER && (
                    <Script
                        id={loaderId}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_VIGNETTE_BANNER_LOADER,
                        }}
                    />
                )}
            </>
        )
    } else if (adFormat === 'interstitial') {
        return (
            <>
                {MONETAG_INTERSTITIAL_BANNER_INLINE && (
                    <Script
                        id={`monetag-interstitial${pageId ? `-${pageId}` : ''}`}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: MONETAG_INTERSTITIAL_BANNER_INLINE,
                        }}
                    />
                )}
            </>
        )
    }

    return null
}

export default MonetagAdComponent
