import { defineMiddleware } from 'astro:middleware'
import { createTimeFormatter } from './formatters'

type PrefCookie = { lastSeenIngestion?: string }

const COOKIE_NAME = 'user_preferences'
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7

export const onRequest = defineMiddleware(async (context, next) => {
  const { runtime } = context.locals
  if (!runtime) {
    return next()
  }
  const { env, cf } = runtime
  const kv = env.THE_SHOOK_ONE

  // 1) Read previous ingestion watermark from cookie
  let previousIngestion: Date | null = null
  const raw = context.cookies.get(COOKIE_NAME)?.value
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PrefCookie
      if (parsed?.lastSeenIngestion) {
        const d = new Date(parsed.lastSeenIngestion)
        if (!Number.isNaN(d.getTime())) previousIngestion = d
      }
    } catch {}
  }

  let currentIngestion: Date | null = null
  try {
    const iso = kv ? await kv.get('last-updated') : null
    if (iso) {
      const d = new Date(iso)
      if (!Number.isNaN(d.getTime())) currentIngestion = d
    }
  } catch {}

  context.locals.lastSeenIngestion = previousIngestion

  context.locals.timeFormatter = createTimeFormatter(
    cf?.timezone as string | undefined
  )

  const value: PrefCookie = {
    lastSeenIngestion:
      currentIngestion?.toISOString() ??
      previousIngestion?.toISOString() ??
      new Date().toISOString(),
  }

  context.cookies.set(COOKIE_NAME, JSON.stringify(value), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: SEVEN_DAYS_SECONDS,
  })

  return next()
})
