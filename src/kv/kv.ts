import { CategoryKey } from '../feed/categories.ts'

export type KvEntry = {
  categories: CategoryKey[]
  href: string
  title: string
  published: Date
}

export type KvEntryId = {
  id: string
  entry: KvEntry
}

export const ENTRIES = 'entries'
export const LAST_UPDATED = 'lastUpdated'
