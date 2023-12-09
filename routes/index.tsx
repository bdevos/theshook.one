import { Head } from '$fresh/runtime.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import Footer from '../components/Footer.tsx'
import Header from '../components/Header.tsx'
import { getLastUpdated, type LastUpdated } from '../src/kv/lastUpdated.ts'
import { listEntriesByDate } from '../src/kv/list.ts'
import { type KvEntry } from '../src/kv/kv.ts'
import { parsePreferencesCookie, setPreferencesCookie } from '../src/cookies.ts'
import ListHeader from '../components/ListHeader.tsx'
import ListItem from '../components/ListItem.tsx'
import { timeFormatter as timeFormatterFunc } from '../src/formatters.ts'

type HomeState = {
  entriesByDate: Record<string, KvEntry[]>
  lastVisit: Date | undefined
  lastUpdated: LastUpdated | null
  timeZone: string | undefined
}

export const handler: Handlers<void, HomeState> = {
  async GET({ headers }, ctx) {
    const kv = await Deno.openKv()
    const { lastVisit, disabledCategories, timeZone } = parsePreferencesCookie(headers)

    const { mostRecentEntryDate, entriesByDate } = await listEntriesByDate(kv, disabledCategories, timeZone)
    const lastUpdated = await getLastUpdated(kv)

    ctx.state = {
      entriesByDate,
      lastUpdated,
      lastVisit,
      timeZone,
    }

    const res = await ctx.render()

    setPreferencesCookie(
      res.headers,
      lastVisit && lastVisit > mostRecentEntryDate ? lastVisit : mostRecentEntryDate,
      timeZone,
      disabledCategories,
    )

    return res
  },
}

export default function Home({ state }: PageProps<void, HomeState>) {
  const { entriesByDate, lastUpdated, lastVisit, timeZone } = state
  const timeFormatter = timeFormatterFunc(timeZone)

  return (
    <>
      <Head>
        <title>theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1'>
        <Header
          label='The Verge Feed'
          lastUpdated={lastUpdated}
          timeZone={timeZone}
        />
        <ul>
          {Object.entries(entriesByDate).map(([date, entries]) => (
            <>
              {date !== 'Today' && <ListHeader date={date} />}

              {entries.map((entry) => (
                <ListItem
                  entry={entry}
                  lastVisit={lastVisit}
                  timeFormatter={timeFormatter}
                />
              ))}
            </>
          ))}
        </ul>
        <Footer />
      </div>
    </>
  )
}
