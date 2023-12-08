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

type HomeState = {
  entriesByDate: Record<string, KvEntry[]>
  lastVisit: Date | undefined
  lastUpdated: LastUpdated | null
}

export const handler: Handlers<void, HomeState> = {
  async GET({ headers }, ctx) {
    const kv = await Deno.openKv()
    const { lastVisit, disabledCategories } = parsePreferencesCookie(headers)

    const { mostRecentEntryDate, entriesByDate } = await listEntriesByDate(
      kv,
      disabledCategories,
    )
    const lastUpdated = await getLastUpdated(kv)

    ctx.state = {
      entriesByDate,
      lastUpdated,
      lastVisit,
    }

    const res = await ctx.render()
    setPreferencesCookie(
      res.headers,
      lastVisit && lastVisit > mostRecentEntryDate
        ? lastVisit
        : mostRecentEntryDate,
      disabledCategories,
    )

    return res
  },
}

export default function Home({ state }: PageProps<void, HomeState>) {
  const { entriesByDate, lastUpdated, lastVisit } = state

  return (
    <>
      <Head>
        <title>theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1'>
        <Header label='The Verge Feed' lastUpdated={lastUpdated} />
        <ul>
          {Object.entries(entriesByDate).map(([date, entries]) => (
            <>
              {date !== 'Today' && <ListHeader date={date} />}

              {entries.map((entry) => (
                <ListItem entry={entry} lastVisit={lastVisit} />
              ))}
            </>
          ))}
        </ul>
        <Footer />
      </div>
    </>
  )
}
