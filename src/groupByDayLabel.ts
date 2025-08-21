import { formatDay } from './formatters'

export function groupByDayLabel(
  items: Item[],
  timeZone?: string
): Array<{ label: string; items: Item[] }> {
  const groups: Array<{ label: string; items: Item[] }> = []

  for (const item of items) {
    const date = new Date(item.pubDate || 0)
    const label = formatDay(date, timeZone)

    const last = groups[groups.length - 1]
    if (last && last.label === label) {
      last.items.push(item)
    } else {
      groups.push({
        label,
        items: [item],
      })
    }
  }

  return groups
}
