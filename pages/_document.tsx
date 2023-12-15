import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </Head>
      <body className='mb-20'>
        <Main />
        <NextScript />
      </body>
      {/* <Footer /> */}
    </Html>
  )
}
