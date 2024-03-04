import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <Script disable-devtool-auto src='https://cdn.jsdelivr.net/npm/disable-devtool'></Script>
      </Head>
      <body className='mb-20'>
        <Main />
        <NextScript />
      </body>
      {/* <Footer /> */}
    </Html>
  )
}
