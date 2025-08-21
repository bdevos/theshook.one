import { defineMiddleware } from 'astro:middleware'
import { createTimeFormatter } from './formatters'

const COOKIE_NAME = 'user_preferences'
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7

export const onRequest = defineMiddleware(async (context, next) => {
  let previousVisit: Date | null = null

  const raw = context.cookies.get(COOKIE_NAME)?.value
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.lastVisit) {
        const date = new Date(parsed.lastVisit)
        if (!Number.isNaN(date.getTime())) {
          previousVisit = date
        }
      }
    } catch {
      // ignore bad cookie; will be repaired on write
    }
  }

  context.locals.lastVisit = previousVisit

  context.locals.timeFormatter = createTimeFormatter(
    context.locals.runtime?.cf?.timezone
  )

  const now = new Date()
  const value = JSON.stringify({ lastVisit: now.toISOString() })

  context.cookies.set(COOKIE_NAME, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: SEVEN_DAYS_SECONDS,
  })

  return next()
})
