import { difference } from 'https://deno.land/std@0.206.0/datetime/mod.ts'
import { type KvEntry } from './kv.ts'
import { addDays } from '../date.ts'

export const calculateExpireIn = (entry: KvEntry): number => {
  const now = new Date()
  const expireDate = addDays(entry.published, 7) // 7 days to expire

  if (now > expireDate) {
    // Expire date before now, so already expired
    return 0
  }
  const { milliseconds } = difference(new Date(), expireDate, {
    units: ['milliseconds'],
  })
  return milliseconds ?? 0
}
