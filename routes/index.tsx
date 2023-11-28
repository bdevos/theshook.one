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

type HomeProps = {
  entriesByDate: Record<string, KvEntry[]>
  lastVisit: Date | undefined
  lastUpdated: LastUpdated | null
}

export const handler: Handlers<HomeProps> = {
  async GET({ headers }, ctx) {
    const kv = await Deno.openKv()
    const { lastVisit, disabledCategories } = parsePreferencesCookie(headers)

    const entriesByDate = await listEntriesByDate(kv, disabledCategories)
    const lastUpdated = await getLastUpdated(kv)

    const res = await ctx.render({
      lastVisit,
      entriesByDate,
      lastUpdated,
    })
    setPreferencesCookie(res.headers, disabledCategories)

    return res
  },
}

export default function Home(
  { data: { lastVisit, lastUpdated, entriesByDate } }: PageProps<HomeProps>,
) {
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
