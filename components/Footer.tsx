import UpdatedIcon from './icons/UpdatedIcon.tsx'
import { type LastUpdated } from '../src/kv/lastUpdated.ts'

type Props = {
  isAbout?: boolean
  lastUpdated?: LastUpdated | null
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

export default function Footer({ isAbout = false, lastUpdated }: Props) {
  return (
    <div class='flex flex-col text-xs text-neutral-700 dark:text-neutral-300 pt-8 pb-12 items-center gap-y-6'>
      {lastUpdated && (
        <div class='flex flex-row gap-x-1'>
          <UpdatedIcon /> {parseUpdated(lastUpdated)}
        </div>
      )}
      <div class='flex flex-row items-center gap-x-6'>
        {isAbout && <a href='/' class='underline'>Home</a>}
        {!isAbout && <a href='/about' class='underline'>About</a>}
        <a href='https://appjeniksaan.nl' class='underline'>Appjeniksaan</a>
        <a href='https://github.com/bdevos/theshook.one' class='underline'>
          Source code
        </a>
      </div>
    </div>
  )
}
