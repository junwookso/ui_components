import type { Preview } from '@storybook/vue3-vite'
import type { StorybookParameters } from 'storybook/internal/types'
import './preview.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    options: {
      // Storybook evaluates this function as JavaScript when generating its index.
      storySort: (a, b) => {
        const alphabetical = Object.freeze({ numeric: true, sensitivity: 'accent' })
        const byTitle = a.title.localeCompare(b.title, undefined, alphabetical)
        if (byTitle !== 0) return byTitle
        if (a.type !== b.type) return a.type === 'docs' ? -1 : 1
        return a.name.localeCompare(b.name, undefined, alphabetical)
      },
    },
  } satisfies StorybookParameters & Record<string, unknown>,
  globalTypes: {
    theme: {
      description: '컬러 토큰 미리보기',
      toolbar: { icon: 'paintbrush', items: ['neutral', 'ocean'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'neutral' },
  decorators: [
    (story, context) => ({
      components: { story },
      setup: () => ({ theme: context.globals.theme, fullBleed: context.parameters.fullBleed === true }),
      template: '<div class="ui-preview" :data-ui-theme="theme" :data-full-bleed="fullBleed"><story /></div>',
    }),
  ],
}

export default preview
