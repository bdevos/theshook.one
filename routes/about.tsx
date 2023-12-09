import { Head } from '$fresh/runtime.ts'
import Footer from '../components/Footer.tsx'
import Header from '../components/Header.tsx'

export default function About() {
  return (
    <>
      <Head>
        <title>About | theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1'>
        <Header label='About' disableSettings />
        <div className='m-3 text-base leading-relaxed'>
          <p class='mb-2'>
            Because I wasn't happy with{' '}
            <a href='https://theverge.com' class='underline'>The Verge</a>'s "new" layout, but still love to follow
            their writing, I decided to spend a little bit of time setting up an RSS feed aggregator specifically for
            their feeds. This website is the result of that effort and simply lists articles from their feed.
          </p>
          <p>
            <a href='https://theverge.com' class='underline'>The Verge</a>'s website contains more information than just
            their articles. If you are looking for that additional content, just visit their website.
          </p>

          <h2 class='mt-4 text-lg font-semibold leading-loose'>
            Inspired by:
          </h2>
          <p>
            I used <a href='https://tweakers.net' class='underline'>tweakers.net</a>{' '}
            as inspiration for the layout. Articles added since your last visit will display the time in bold. The
            overview also employs <em class='text-fuchsia-800 dark:text-fuchsia-200'>:visited</em>{' '}
            styling to indicate which links you have already visited.
          </p>

          <h2 class='mt-4 text-lg font-semibold leading-loose'>
            With a little help from:
          </h2>
          <p>
            This website is built with <a href='https://fresh.deno.dev' class='underline'>Deno Fresh</a> and hosted on
            {' '}
            <a href='https://deno.com/deploy' class='underline'>Deno Deploy</a>. These guys are creating awesome
            software that is a joy to use.
          </p>
        </div>
        <Footer isAbout />
      </div>
    </>
  )
}
