/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />
/// <reference path="../.wrangler/types/index.d.ts" />

interface Env {
  THE_SHOOK_ONE: KVNamespace
}

declare global {
  namespace App {
    interface Locals {
      runtime?: {
        env: Env
        cf?: Request['cf']
      }
    }
  }
}

export {}
