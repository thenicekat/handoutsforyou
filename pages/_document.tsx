import { Head, Html, Main, NextScript } from 'next/document'
import Link from 'next/link'

export default function Document() {
    return (
        <Html lang="en">
            <Head></Head>

            <body className="mb-20 mt-20">
                <Main />
            </body>

            <NextScript />

            <footer className="fixed bottom-0 bg-white flex flex-col sm:flex-row py-3 w-full shrink-0 items-center px-4 md:px-6">
                <p className="text-xs text-gray-500">
                    Made with love by{' '}
                    <Link
                        href={'https://thenicekat.github.io/'}
                        className="underline"
                    >
                        Divyateja Pasupuleti
                    </Link>{' '}
                    🖤
                </p>
            </footer>
        </Html>
    )
}
