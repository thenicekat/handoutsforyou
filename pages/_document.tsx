import { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../components/Footer'
import Script from 'next/script'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="handoutsforyou" content="handoutsforyou" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="handoutsforyou"
                />
                <meta name="description" content="handoutsforyou" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <body className="mb-20 mt-20">
                <Main />
            </body>
            <NextScript />
            <Footer />
        </Html>
    )
}
