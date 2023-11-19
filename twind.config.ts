import {
  defineConfig,
  Preset,
  ThemeConfig,
} from 'https://esm.sh/@twind/core@1.1.3'
import presetTailwind from 'https://esm.sh/@twind/preset-tailwind@1.1.4'
import presetAutoprefix from 'https://esm.sh/@twind/preset-autoprefix@1.0.7'

export default {
  ...defineConfig({
    presets: [presetTailwind() as Preset, presetAutoprefix()],
    theme: {
      extend: {
        gridTemplateColumns: {
          'bla': 'max-content 1fr 100px',
        },
      },
    } as ThemeConfig,
  }),
  selfURL: import.meta.url,
}
