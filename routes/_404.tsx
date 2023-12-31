import { Head } from '$fresh/runtime.ts'
import Header from '../components/Header.tsx'

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1'>
        <Header label='404 - Page not found' disableSettings />
        <p class='my-4'>
          The page you were looking for doesn't exist.
        </p>
        <a href='/' class='underline'>
          Go back home
        </a>
      </div>
    </>
  )
}
