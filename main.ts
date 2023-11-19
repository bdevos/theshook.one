/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import '$std/dotenv/load.ts'

import { start } from '$fresh/server.ts'
import manifest from './fresh.gen.ts'

import twindPlugin from '$fresh/plugins/twindv1.ts'
import twindConfig from './twind.config.ts'
import { updateEntries } from './src/kv/update.ts'

Deno.cron('Update entries', '0 * * * *', () => updateEntries())

await start(manifest, { plugins: [twindPlugin(twindConfig)] })
