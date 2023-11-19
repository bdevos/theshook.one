import isToday from 'https://deno.land/x/date_fns@v2.22.1/isToday/index.ts'
import isYesterday from 'https://deno.land/x/date_fns@v2.22.1/isYesterday/index.ts'

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export const timeFormatter = new Intl.DateTimeFormat('nl-NL', {
  timeStyle: 'short',
})

export const formatDay = (date: Date) => {
  if (isToday(date)) {
    return 'Today'
  } else if (isYesterday(date)) {
    return 'Yesterday'
  } else {
    return dateFormatter.format(date)
  }
}
