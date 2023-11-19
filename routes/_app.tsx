import { AppProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/3311.png' />
      </Head>
      <body class='bg-neutral-50 dark:bg-black'>
        <Component />
      </body>
    </>
  )
}
