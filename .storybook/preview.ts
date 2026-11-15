import type { Preview } from '@storybook/vue3-vite'
import './preview.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    options: { storySort: { method: 'alphabetical', includeNames: true } },
  },
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
