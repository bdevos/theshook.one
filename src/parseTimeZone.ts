export const parseTimeZone = (headers: Headers) => {
  const timeZones: string[] = Intl.supportedValuesOf('timeZone')
  const timeZone = headers.get('X-Timezone')

  if (!timeZone) {
    return undefined
  }

  if (timeZones.includes(timeZone)) {
    return timeZone
  }
}
