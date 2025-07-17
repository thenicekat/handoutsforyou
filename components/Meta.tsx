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