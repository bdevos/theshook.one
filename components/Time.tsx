type Props = {
  lastVisit: Date | undefined
  published: Date
  timeFormatter: Intl.DateTimeFormat
}

export default function Time({ lastVisit, published, timeFormatter }: Props) {
  const isBold = lastVisit && published > lastVisit

  return (
    <span
      class={`font-mono text-xs tabular-nums tracking-tighter mx-1 ${
        isBold ? 'font-semibold' : 'font-normal text-neutral-600 dark:text-neutral-300'
      }`}
    >
      {timeFormatter.format(published)}
    </span>
  )
}
