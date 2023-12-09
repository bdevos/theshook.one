type Props = {
  lastVisit: Date | undefined
  published: Date
  timeFormatter: Intl.DateTimeFormat
}

export default function Time({ lastVisit, published, timeFormatter }: Props) {
  const isBold = lastVisit && published > lastVisit

  return (
    <span
      class={`text-xs font-mono tabular-nums tracking-tighter ${
        isBold ? 'font-bold' : 'font-normal text-neutral-700 dark:text-neutral-200'
      }`}
    >
      {timeFormatter.format(published)}
    </span>
  )
}
