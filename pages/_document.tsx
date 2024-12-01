import { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../components/Footer'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body className="mb-20">
        <Main />
      </body>
      < NextScript />
      < Footer />
    </Html >
  )
}
