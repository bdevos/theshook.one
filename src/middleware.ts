import { defineMiddleware } from 'astro:middleware'
import { createTimeFormatter } from './formatters'

const COOKIE_NAME = 'user_preferences'
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7

export const onRequest = defineMiddleware(async (context, next) => {
  // 1) Read previous visit (if any)
  let previousVisit: Date | null = null

  const raw = context.cookies.get(COOKIE_NAME)?.value
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.lastVisit) {
        const d = new Date(parsed.lastVisit)
        if (!Number.isNaN(d.getTime())) previousVisit = d
      }
    } catch {
      // ignore bad cookie; will be repaired on write
    }
  }

  // 1b) Optional override via query param: ?lastVisit=2025-08-01T12:00:00.000Z
  const override = context.url.searchParams.get('lastVisit')
  if (override) {
    const d = new Date(override)
    if (!Number.isNaN(d.getTime())) {
      previousVisit = d
    }
  }

  // 2) Expose it to your pages/endpoints during this request
  context.locals.lastVisit = previousVisit

  context.locals.timeFormatter = createTimeFormatter(
    context.locals.runtime?.cf?.timezone
  )

  // 3) Write a fresh timestamp (server time) for the *next* request
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
