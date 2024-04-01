import { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../Components/Footer'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body className='mb-20'>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  )
}
