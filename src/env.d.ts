/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="../.wrangler/types/index.d.ts" />

declare namespace App {
  interface Locals {
    lastVisit: Date | null
    timeFormatter: Intl.DateTimeFormat
    runtime?: { cf?: { timezone?: string; city?: string; country?: string } }
  }
}

type ENV = {
  THE_SHOOK_ONE: KVNamespace
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>

declare namespace App {
  interface Locals extends Runtime {}
}

type Item = {
  key: string
  pubDate: number
  title: string
  link: string
  isNew: boolean
  source: string
}
