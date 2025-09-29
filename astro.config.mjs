// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  site: 'https://theshook.one',
  output: 'server',
  image: {
    service: passthroughImageService(),
  },
})
