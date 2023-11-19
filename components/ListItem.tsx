import { type KvEntry } from '../src/kv/kv.ts'
import CategoryIndicator from './CategoryIndicator.tsx'
import Time from './Time.tsx'

type Props = {
  entry: KvEntry
  lastVisit: Date | undefined
}

export default function ListItem({ entry, lastVisit }: Props) {
  const { href, categories, published, title } = entry
  return (
    <li
      key={href}
      class='flex flex-row gap-2 whitespace-nowrap items-center'
    >
      <CategoryIndicator categories={categories} />
      <Time lastVisit={lastVisit} published={published} />
      <a
        href={href}
        target='_blank'
        class='text-neutral-900 dark:text-neutral-50 visited:text-fuchsia-800 dark:visited:text-fuchsia-200 truncate text-base leading-relaxed tracking-tight sm:tracking-normal'
      >
        {title}
      </a>
    </li>
  )
}
