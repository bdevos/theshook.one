import { CategoryKey } from '../feed/categories.ts'
import { formatDay } from '../formatters.ts'
import { ENTRIES, KvEntry } from './kv.ts'

const sortEntryByPublished = (a: KvEntry, b: KvEntry) =>
  b.published.getTime() - a.published.getTime()

/**
 * When updating feed entries, we were first parsing all the feeds, then bundling the categories and lastly overriding all the data in KV.
 *
 * The problem with this was that if a feed contains a lot of updates, older entries which are also included in other categories, would loose the category of the feed that has a lot of updates.
 *
 * For example, around black friday, the deals category updates a lot and entries from a day old will start to loose the deals category. This breaks functionality if you are filtering out deals.
 *
 * This function will get the categories from KV that can be merged with the new feed entries, so categories won't be lost.
 *
 * @param kv Deno KV instance
 * @returns Record with entry ID as key and known categories as value
 */
export const listEntryCategories = async (kv: Deno.Kv) => {
  const res = kv.list<KvEntry>({ prefix: [ENTRIES] })
  const entries: Record<string, CategoryKey[]> = {}

  for await (const { key, value } of res) {
    const entryKey = key.at(1)?.toString()
    if (entryKey) {
      entries[entryKey] = value.categories
    }
  }

  return entries
}

export const listEntriesByDate = async (
  kv: Deno.Kv,
  disabledCategories: CategoryKey[],
) => {
  const res = kv.list<KvEntry>({ prefix: [ENTRIES] })
  const entries: KvEntry[] = []
  for await (const { value } of res) {
    if (
      !value.categories.some((category) =>
        disabledCategories.includes(category)
      )
    ) {
      entries.push(value)
    }
  }

  const sortedEntries = entries.toSorted(sortEntryByPublished)

  return {
    mostRecentEntryDate: sortedEntries.at(0)?.published ?? new Date(),
    entriesByDate: splitByDay(sortedEntries),
  }
}

const splitByDay = (entries: KvEntry[]) =>
  Object.groupBy(
    entries,
    ({ published }) => formatDay(published),
  )
