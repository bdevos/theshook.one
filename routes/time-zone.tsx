import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { parsePreferencesCookie, setPreferencesCookie } from '../src/cookies.ts'
import Header from '../components/Header.tsx'

type TimeZoneState = {
  timeZones: string[]
  timeZone: string | undefined
}

export const handler: Handlers<void, TimeZoneState> = {
  GET({ headers }, ctx) {
    const { timeZone } = parsePreferencesCookie(headers)

    ctx.state.timeZones = Intl.supportedValuesOf('timeZone')
    ctx.state.timeZone = timeZone ?? ''

    return ctx.render()
  },
  async POST(req, _ctx) {
    const { disabledCategories, lastVisit = new Date(), timeZone: prevTimeZone } = parsePreferencesCookie(req.headers)

    const formData = await req.formData()
    const formDataTimeZone = formData.get('timeZone')?.toString().replaceAll(' ', '_')

    const timeZone = Intl.supportedValuesOf('timeZone').find((timeZone) => timeZone === formDataTimeZone)

    const headers = new Headers({ Location: '/' })

    setPreferencesCookie(
      headers,
      lastVisit,
      timeZone ?? prevTimeZone,
      disabledCategories,
    )

    return new Response('', {
      status: 303,
      headers,
    })
  },
}

export default function TimeZone(
  { state }: PageProps<void, TimeZoneState>,
) {
  const { timeZone, timeZones } = state

  return (
    <>
      <Head>
        <title>Time zone | theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1 relative'>
        <Header label='Time Zone' disableSettings />
        <p class='mt-2 text-sm mx-2'>
          This page uses the half baked <span class='font-mono'>{'<input list="">'}</span> with a{' '}
          <span class='font-mono'>{'<datalist />'}</span>{' '}
          functionality. Because there is limited styling support, I haven't really tried here 😇.
        </p>
        <form method='post' action='/time-zone'>
          <div class='mt-4 mx-2 mb-2'>
            <label>
              <span class='block text-sm font-medium leading-6 text-gray-900'>
                Time zone
              </span>
              <input
                name='timeZone'
                list='timeZones'
                value={timeZone}
                class='outline-none block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </label>
            <datalist id='timeZones' class='border-2 border-red-500'>
              {timeZones.map((timeZone) => <option key={timeZone}>{timeZone.replaceAll('_', ' ')}</option>)}
            </datalist>
          </div>
          <div class='sticky bottom-0 -mx-1 px-1 backdrop-blur-sm bg-neutral-50/50 dark:bg-black/25'>
            <div class='flex flex-row  py-3 px-2 gap-x-2 justify-end'>
              <a
                href='/'
                type='button'
                class='rounded-md bg-neutral-50 dark:bg-black px-2 py-2 text-sm font-semibold hover:shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
              >
                Cancel
              </a>
              <button
                type='submit'
                class='rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
