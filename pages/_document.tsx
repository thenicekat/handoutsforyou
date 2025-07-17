import { Head, Html, Main, NextScript } from 'next/document'
import Footer from '../components/Footer'

export default function Document() {
    return (
        <Html lang="en">
            <Head></Head>
            <body className="mb-20 mt-20">
                <Main />
            </body>
            <NextScript />
            <Footer />
        </Html>
    )
}
