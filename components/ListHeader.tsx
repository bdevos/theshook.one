type Props = {
  date: string
}

export default function ListHeader({ date }: Props) {
  return (
    <li class='relative py-1'>
      <div
        class='absolute inset-0 flex items-center'
        aria-hidden='true'
      >
        <div class='w-full border-t border-neutral-300 dark:border-neutral-500' />
      </div>
      <h2 class='relative flex justify-start'>
        <span class='font-mono bg-neutral-50 dark:bg-black ml-3 px-1 text-[0.7rem] font-bold leading-4 text-neutral-800 dark:text-neutral-100'>
          {date}
        </span>
      </h2>
    </li>
  )
}
