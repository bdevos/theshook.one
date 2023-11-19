import { type ComponentChild } from 'preact'
import SettingsIcon from './icons/SettingsIcon.tsx'

type Props = {
  label: ComponentChild
  disableSettings?: boolean
}

export default function Header({ label, disableSettings = false }: Props) {
  return (
    <div class='flex justify-between items-center gap-x-5 mx-2'>
      <div class='flex items-center gap-x-4'>
        <a class='text-5xl' href='/'>🫨</a>
        <div>
          <h1 class='text-2xl font-bold'>
            {label}
          </h1>
        </div>
      </div>
      {!disableSettings && (
        <a
          type='button'
          href='/categories'
          class='inline-flex items-center gap-x-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold shadow-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
        >
          <SettingsIcon aria-hidden='true' />
        </a>
      )}
    </div>
  )
}
