import Head from 'next/head'
import { defaultMetaConfig, MetaConfig } from '../config/meta'

interface MetaProps extends Partial<MetaConfig> {
    children?: React.ReactNode
}

export default function Meta({
    title,
    description,
    keywords,
    openGraph,
    children,
}: MetaProps) {
    const meta: MetaConfig = {
        ...defaultMetaConfig,
        title: title ?? defaultMetaConfig.title,
        description: description ?? defaultMetaConfig.description,
        keywords: keywords ?? defaultMetaConfig.keywords,
        openGraph: {
            ...defaultMetaConfig.openGraph,
            ...openGraph,
        },
    }

    return (
        <Head>
            {meta.title && <title>{meta.title}</title>}
            {meta.description && (
                <meta name="description" content={meta.description} />
            )}
            {meta.keywords && meta.keywords.length > 0 && (
                <meta name="keywords" content={meta.keywords.join(', ')} />
            )}

            {/* Icon Tags */}
            <meta name="handoutsforyou" content="handoutsforyou" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
            <meta name="apple-mobile-web-app-title" content="handoutsforyou" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="msapplication-TileColor" content="#2B5797" />
            <meta name="msapplication-tap-highlight" content="no" />
            <meta name="theme-color" content="#000000" />

            <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
            <link rel="manifest" href="manifest.json" />

            <link rel="shortcut icon" href="/images/favicon.ico" />
            <link rel="icon" href="/images/favicon.ico" />
            <link rel="icon" sizes="64x64" href="/images/favicon.ico" />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/images/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/images/favicon-16x16.png"
            />

            {/* Adsense */}
            <meta
                name="google-adsense-account"
                content="ca-pub-8538529975248100"
            />

            {/* Monetag */}
            <meta name="monetag" content="9f14733e352fad16554f2d8f355d4ed3" />

            {/* Open Graph Tags */}
            {meta.openGraph?.title && (
                <meta property="og:title" content={meta.openGraph.title} />
            )}
            {meta.openGraph?.description && (
                <meta
                    property="og:description"
                    content={meta.openGraph.description}
                />
            )}
            {meta.openGraph?.image && (
                <meta property="og:image" content={meta.openGraph.image} />
            )}
            {meta.openGraph?.url && (
                <meta property="og:url" content={meta.openGraph.url} />
            )}

            {children}
        </Head>
    )
}
