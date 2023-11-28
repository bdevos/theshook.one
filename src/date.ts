export const addDays = (origin: Date, days: number) => {
  const newDate = new Date(origin)
  newDate.setDate(origin.getDate() + days)
  return newDate
}

export const parseDate = (value: string): Date | undefined => {
  const asDate = new Date(value)
  if (!isNaN(asDate.getTime())) {
    return asDate
  }
}
