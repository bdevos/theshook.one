export const parseLastUpdated = (lastUpdated: string | undefined) => {
  if (!lastUpdated) return null

  const updatedAt = new Date(lastUpdated)
  const diffMs = Date.now() - updatedAt.getTime()

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)

  return { minutes, hours }
}

export function lastUpdatedLabel({
  minutes,
  hours,
}: {
  minutes: number
  hours: number
}) {
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
