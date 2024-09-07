type Props = {
  date: string
}

export default function ListHeader({ date }: Props) {
  return (
    <li class='grid grid-cols-subgrid col-span-full my-2 items-center'>
      <div
        class='w-full border-t border-neutral-300 dark:border-neutral-500'
        aria-hidden='true'
      />
      <h2 class='flex items-center gap-x-1 col-span-2 bg-neutral-50 dark:bg-black text-xs font-bold tracking-wider text-neutral-800 dark:text-neutral-100'>
        <span class='whitespace-nowrap px-0.5'>{date}</span>
        <div
          class='w-full border-t border-neutral-300 dark:border-neutral-500'
          aria-hidden='true'
        />
      </h2>
    </li>
  )
}
