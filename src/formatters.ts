export const dateFormatter = (timeZone: string | undefined) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone,
  })

export const createTimeFormatter = (timeZone: string | undefined) =>
  new Intl.DateTimeFormat('nl-NL', {
    timeStyle: 'short',
    timeZone,
  })

export const formatDay = (date: Date, timeZone: string | undefined) => {
  const formatter = dateFormatter(timeZone)
  const formattedDate = formatter.format(date)

  const todayAsString = formatter.format(new Date())
  const yesterdayAsString = formatter.format(addDays(new Date(), -1))

  if (formattedDate === todayAsString) {
    return 'Today'
  } else if (formattedDate === yesterdayAsString) {
    return 'Yesterday'
  } else {
    return formatter.format(date)
  }
}

export const parseTimeZone = (timeZone: string) => {
  if (!timeZone) return undefined

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    timeZone,
  })
  return formatter.formatToParts().find(({ type }) => type === 'timeZoneName')
    ?.value
}

const addDays = (origin: Date, days: number) => {
  const newDate = new Date(origin)
  newDate.setDate(origin.getDate() + days)
  return newDate
}
