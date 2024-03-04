import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <script disable-devtool-auto src='https://cdn.jsdelivr.net/npm/disable-devtool'></script>
      </Head>
      <body className='mb-20'>
        <Main />
        <NextScript />
      </body>
      {/* <Footer /> */}
    </Html>
  )
}
