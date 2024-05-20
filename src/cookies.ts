import { getCookies, setCookie } from 'https://deno.land/std@0.208.0/http/cookie.ts'
import { decodeBase64, encodeBase64 } from 'https://deno.land/std@0.208.0/encoding/base64.ts'
import { categories, type CategoryKey } from './feed/categories.ts'
import { addDays, parseDate } from './date.ts'

type Preferences = {
  disabledCategories: CategoryKey[]
  lastVisit: Date | undefined
}

const separator = ','
const preferencesCookieName = 'user_preferences'

export const setPreferencesCookie = (
  headers: Headers,
  mostRecentEntryDate: Date,
  disabledCategories: string[],
) => {
  setCookie(headers, {
    name: preferencesCookieName,
    value: encodeBase64(
      [
        mostRecentEntryDate.toISOString(),
        '', // Used to be timeZone
        ...disabledCategories,
      ].join(separator),
    ),
    httpOnly: true,
    secure: true,
    expires: addDays(new Date(), 7),
  })
}

export const parsePreferencesCookie = (headers: Headers): Preferences => {
  const value = getCookies(headers)[preferencesCookieName]
  if (!value) {
    return {
      disabledCategories: [],
      lastVisit: undefined,
    }
  }

  const [lastVisit, _, ...disabledCategories] = new TextDecoder()
    .decode(decodeBase64(value))
    .split(separator)

  return {
    disabledCategories: disabledCategories
      .map((category) => (category in categories ? category : null))
      .filter((category): category is CategoryKey => !!category),
    lastVisit: parseDate(lastVisit),
  }
}
