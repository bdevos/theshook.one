import { difference } from 'https://deno.land/std@0.208.0/datetime/mod.ts'
import { LAST_UPDATED } from './kv.ts'

export type LastUpdated = {
  minutes: number
  hours: number
}

export const getLastUpdated = async (
  kv: Deno.Kv,
): Promise<LastUpdated | null> => {
  const { value: lastUpdated } = await kv.get<Date>([LAST_UPDATED])

  if (lastUpdated === null) {
    return null
  }

  const { minutes = 0, hours = 0 } = difference(lastUpdated, new Date(), {
    units: ['minutes', 'hours'],
  })

  return {
    minutes,
    hours,
  }
}
