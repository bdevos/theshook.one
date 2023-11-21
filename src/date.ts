export const addDays = (origin: Date, days: number) => {
  const newDate = new Date(origin)
  newDate.setDate(origin.getDate() + days)
  return newDate
}
