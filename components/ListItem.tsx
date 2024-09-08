import { Fragment } from 'preact'
import { type KvEntry } from '../src/kv/kv.ts'
import CategoryIndicator from './CategoryIndicator.tsx'
import Time from './Time.tsx'

type Props = {
  entry: KvEntry
  lastVisit: Date | undefined
  timeFormatter: Intl.DateTimeFormat
}

export default function ListItem({ entry, lastVisit, timeFormatter }: Props) {
  const { href, categories, published, title } = entry
  return (
    <Fragment key={href}>
      <CategoryIndicator categories={categories} />
      <Time
        lastVisit={lastVisit}
        published={published}
        timeFormatter={timeFormatter}
      />
      <a
        href={href}
        class='text-neutral-900 dark:text-neutral-50 visited:text-fuchsia-800 dark:visited:text-fuchsia-200 text-base text-balance leading-tight tracking-tight sm:tracking-normal'
      >
        {title}
      </a>
    </Fragment>
  )
}
