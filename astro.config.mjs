// @ts-check
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  site: 'https://theshook.one',
  output: 'server',
  image: { service: { entrypoint: 'astro/assets/services/passthrough' } },
})
