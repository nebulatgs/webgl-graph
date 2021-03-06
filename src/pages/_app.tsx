import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>WebGL Grapher</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className='h-full'>
        <Component {...pageProps} />
      </div>
    </RecoilRoot>
  )
}

export default MyApp