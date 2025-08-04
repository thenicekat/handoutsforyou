import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import Footer from '../components/Footer'

export default function Document() {
    return (
        <Html lang="en">
            <Head></Head>
            <body className="mb-20 mt-20">
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8538529975248100"
                    crossOrigin="anonymous"
                />
                <Main />
            </body>
            <NextScript />
            <Footer />
        </Html>
    )
}
