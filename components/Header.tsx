import SettingsIcon from './icons/SettingsIcon.tsx'
import { LastUpdated } from '../src/kv/lastUpdated.ts'
import UpdatedIcon from './icons/UpdatedIcon.tsx'
import GlobeIcon from './icons/GlobeIcon.tsx'

type Props = {
  label: string
  lastUpdated?: LastUpdated | null
  timeZone?: string
  disableSettings?: boolean
}

const parseUpdated = ({ minutes, hours }: LastUpdated): string => {
  if (minutes <= 1) {
    return 'Just now'
  } else if (hours < 1) {
    return `${minutes} minutes ago`
  } else if (hours === 1) {
    return 'an hour ago'
  } else {
    return `${hours} hours ago`
  }
}

const parseTimeZone = (timeZone: string | undefined) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    timeZone,
  })
  return formatter.formatToParts().find(({ type }) => type === 'timeZoneName')
    ?.value
}

export default function Header({
  label,
  lastUpdated,
  disableSettings = false,
  timeZone,
}: Props) {
  return (
    <div class='flex justify-between items-center gap-x-5 mx-2 mb-2'>
      <div class='flex items-center gap-x-3'>
        <a class='text-5xl' href='/'>🫨</a>
        <div class='flex flex-col'>
          <h1 class='text-2xl font-bold text-neutral-800 dark:text-neutral-50'>
            {label}
          </h1>
          {lastUpdated && (
            <div class='flex flex-row text-xs text-neutral-400 dark:text-neutral-500 gap-x-3 items-center'>
              <div class='flex flex-row gap-x-1 items-center'>
                <UpdatedIcon /> {parseUpdated(lastUpdated)}
              </div>
              <div class='flex flex-row gap-x-1 items-center'>
                <GlobeIcon timeZone={timeZone} /> {parseTimeZone(timeZone)}
              </div>
            </div>
          )}
        </div>
      </div>
      {!disableSettings && (
        <a
          type='button'
          href='/categories'
          class='inline-flex items-center gap-x-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold shadow-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
          aria-label='Categories'
        >
          <SettingsIcon aria-hidden='true' />
        </a>
      )}
    </div>
  )
}
