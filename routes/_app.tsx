import { PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'

export default function App({ Component }: PageProps) {
  return (
    <>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/3311.png' />
        <link rel='stylesheet' href='/styles.css' />
      </Head>
      <body class='bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-50'>
        <Component />
      </body>
    </>
  )
}
