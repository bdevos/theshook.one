import { addDays } from './date.ts'

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'Europe/Amsterdam',
})

export const timeFormatter = new Intl.DateTimeFormat('nl-NL', {
  timeStyle: 'short',
  timeZone: 'Europe/Amsterdam',
})

const todayAsString = dateFormatter.format(new Date())
const yesterdayAsString = dateFormatter.format(addDays(new Date(), -1))

export const formatDay = (date: Date) => {
  const formattedDate = dateFormatter.format(date)

  if (formattedDate === todayAsString) {
    return 'Today'
  } else if (formattedDate === yesterdayAsString) {
    return 'Yesterday'
  } else {
    return dateFormatter.format(date)
  }
}
