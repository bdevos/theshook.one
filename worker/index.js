import astroWorker from '../dist/_worker.js/index.js'
import { XMLParser } from 'fast-xml-parser'

/** ---------- Parsing & date helpers ---------- */
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

const DAY_MS = 24 * 60 * 60 * 1000
const TTL_MIN = 60 // Cloudflare KV min TTL is 60 seconds

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS)
}

/**
 * Returns TTL in seconds until pubDate + 7 days.
 * If the value is already expired OR below Cloudflare's minimum, returns 0 (caller should skip put()).
 */
function calculateExpirationTtl(pubDate) {
  const expireDate = addDays(pubDate, 7)
  const now = new Date()
  const diffSec = Math.floor((expireDate.getTime() - now.getTime()) / 1000)
  return diffSec >= TTL_MIN ? diffSec : 0
}

// Convert trailing timezone abbreviations to numeric offsets (Date.parse often rejects "PDT", "CEST", etc)
const TZ_MAP = {
  PST: '-0800',
  PDT: '-0700',
  MST: '-0700',
  MDT: '-0600',
  CST: '-0600',
  CDT: '-0500',
  EST: '-0500',
  EDT: '-0400',
  CET: '+0100',
  CEST: '+0200',
}
function normalizePubDate(input) {
  if (!input) throw new Error('Missing pubDate')
  const tz = input.match(/\s([A-Z]{2,4})$/)
  if (tz && TZ_MAP[tz[1]])
    input = input.replace(/\s([A-Z]{2,4})$/, ' ' + TZ_MAP[tz[1]])
  const ms = Date.parse(input)
  if (Number.isNaN(ms)) throw new Error(`Unparseable date: ${input}`)
  return new Date(ms)
}

/** ---------- KV helpers ---------- */

// Fetch all existing KV keys (handles pagination) and return as a Set for O(1) lookups
async function getKnownKeys(env) {
  const names = new Set()
  let cursor
  do {
    const { keys, cursor: next } = await env.THE_SHOOK_ONE.list({ cursor })
    for (const { name } of keys) names.add(name)
    cursor = next
  } while (cursor)
  return names
}

function toKvString(link) {
  const normalized = {
    ...link,
    pubDate:
      link.pubDate instanceof Date ? link.pubDate.toISOString() : link.pubDate,
  }
  return JSON.stringify(normalized)
}

function toKvKey(link) {
  return `link:${link.source}:${link.id}`
}

function uniqueById(items) {
  const seen = new Set()
  const out = []
  for (const it of items) {
    if (!it?.id || seen.has(it.id)) continue
    seen.add(it.id)
    out.push(it)
  }
  return out
}

/** ---------- Feeds ---------- */

async function getMacrumors() {
  const url = 'https://rss.macrumors.com'
  const res = await fetch(url, { cf: { cacheTtl: 300 } })
  if (!res.ok) throw new Error(`MacRumors fetch failed: ${res.status}`)
  const xml = await res.text()

  const data = parser.parse(xml)
  const items = data?.rss?.channel?.item ?? []
  return items.slice(0, 20).map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: normalizePubDate(item.pubDate),
    id: item.guid?.['#text'] ?? item.guid ?? item.link, // fallback to link if needed
    source: 'macrumors',
  }))
}

async function getDaringFireball() {
  const url = 'https://daringfireball.net/feeds/main'
  const res = await fetch(url, { cf: { cacheTtl: 300 } })
  if (!res.ok) throw new Error(`DF fetch failed: ${res.status}`)
  const xml = await res.text()

  const data = parser.parse(xml)
  const items = data?.feed?.entry ?? []

  return items.slice(0, 20).map((item) => {
    const links = Array.isArray(item.link)
      ? item.link
      : [item.link].filter(Boolean)
    const related = links.find((l) => l?.['@_rel'] === 'related')
    const alternate = links.find((l) => l?.['@_rel'] === 'alternate')
    return {
      title: item.title,
      link: (related ?? alternate)?.['@_href'],
      pubDate: normalizePubDate(item.published ?? item.updated),
      id: item.id,
      source: 'daringfireball',
    }
  })
}

async function getAppjeniksaan() {
  const url = 'https://appjeniksaan.nl/feed.xml'
  const res = await fetch(url, { cf: { cacheTtl: 300 } })
  if (!res.ok) throw new Error(`Appjeniksaan fetch failed: ${res.status}`)
  const xml = await res.text()

  const data = parser.parse(xml)
  const items = data?.rss?.channel?.item ?? []
  return items.slice(0, 20).map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: normalizePubDate(item.pubDate),
    id: item.guid,
    source: 'appjeniksaan',
  }))
}

/** ---------- Update orchestration ---------- */

async function updateFeedsData(env) {
  // First we write the last-updated, this will make sure that if multiple requests happen
  // via the API endpoint the chances are higher that it will be within the 60 seconds and
  // stop the other call from going further.
  env.THE_SHOOK_ONE.put('last-updated', new Date().toISOString())

  const knownKeys = await getKnownKeys(env)

  // Make feeds independent: failure of one won't block the other
  const results = await Promise.allSettled([
    getMacrumors(),
    getDaringFireball(),
    getAppjeniksaan(),
  ])
  const batches = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)

  // Deduplicate by id across feeds
  const deduped = uniqueById(batches)

  // Only new items (compare against the actual KV key, not just id)
  const newLinks = deduped.filter((l) => !knownKeys.has(toKvKey(l)))
  const readyToStore = []
  for (const link of newLinks) {
    const ttl = calculateExpirationTtl(link.pubDate)
    if (ttl > 0) readyToStore.push({ link, ttl })
  }

  // Write to KV with proper TTL; skip expired/near-expired items
  const writes = readyToStore.map(({ link, ttl }) =>
    env.THE_SHOOK_ONE.put(toKvKey(link), toKvString(link), {
      expirationTtl: ttl,
    })
  )
  await Promise.all(writes)

  return {
    added: readyToStore.length,
    totalFetched: deduped.length,
  }
}

/** ---------- HTTP + Cron entrypoints ---------- */

async function handleUpdateRequest(env) {
  // Throttle: only allow if the previous update is > 60s ago
  const last = await env.THE_SHOOK_ONE.get('last-updated')
  if (last) {
    const lastDate = new Date(last)
    const deltaMs = Date.now() - lastDate.getTime()
    if (!Number.isNaN(lastDate.getTime()) && deltaMs < 60_000) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: 'throttled',
          lastUpdated: lastDate.toISOString(),
          retryAfterSeconds: Math.ceil((60_000 - deltaMs) / 1000),
        }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
          },
        }
      )
    }
  }

  try {
    const result = await updateFeedsData(env)
    return new Response(
      JSON.stringify({
        ok: true,
        updatedAt: new Date().toISOString(),
        ...result,
      }),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err?.message || err) }),
      {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    )
  }
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(updateFeedsData(env))
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/api/update-feeds') {
      return handleUpdateRequest(env)
    }

    return astroWorker.fetch(request, env, ctx)
  },
}
