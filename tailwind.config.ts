import { type Config } from 'tailwindcss'

export default {
  content: ['{routes,components}/**/*.{ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        main: 'max-content max-content auto',
      },
    },
  },
} as Config
