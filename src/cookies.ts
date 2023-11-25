import {
  type Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from 'https://deno.land/std@0.207.0/http/cookie.ts'
import addMonths from 'https://deno.land/x/date_fns@v2.22.1/addMonths/index.ts'
import { categories, type CategoryKey } from './feed/categories.ts'

const disabledCategoriesCookieName = 'disabledCategories'
const lastVisitCookieName = 'lastVisit'

export const setDisabledCategoriesCookie = (
  headers: Headers,
  disabledCategories: string[],
) => {
  if (disabledCategories.length > 0) {
    const disabledCategoriesCookie: Cookie = {
      name: disabledCategoriesCookieName,
      value: disabledCategories.join('|'),
      httpOnly: true,
      sameSite: 'Lax',
      secure: true,
      expires: addMonths(new Date(), 1),
    }
    setCookie(headers, disabledCategoriesCookie)
  } else {
    deleteCookie(headers, disabledCategoriesCookieName)
  }
}

export const setLastVisitCookie = (headers: Headers) => {
  const lastVisitCookie: Cookie = {
    name: lastVisitCookieName,
    value: new Date().toISOString(),
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    expires: addMonths(new Date(), 1),
  }
  setCookie(headers, lastVisitCookie)
}

export const getDisabledCategories = (
  headers: Headers,
): CategoryKey[] => {
  const value = getCookies(headers)[disabledCategoriesCookieName]
  if (!value) {
    return []
  }

  return value.split('|').map((category) =>
    category in categories ? category : null
  ).filter((category): category is CategoryKey => !!category)
}

export const getLastVisit = (
  headers: Headers,
): Date | undefined => {
  const value = getCookies(headers)[lastVisitCookieName]

  if (!value) {
    return undefined
  }

  const asDate = new Date(value)
  if (!isNaN(asDate.getTime())) {
    return asDate
  }
}
