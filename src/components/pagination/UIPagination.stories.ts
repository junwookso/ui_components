import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import UIPagination from './UIPagination.vue'

const meta = {
  title: 'Components/UIPagination',
  component: UIPagination,
  args: { pageCount: 12, label: '문서 목록 페이지 이동' },
  render: args => ({
    components: { UIPagination },
    setup: () => {
      const page = ref(1)
      const documents = computed(() => Array.from({ length: 3 }, (_, index) => (page.value - 1) * 3 + index + 1))
      return { args, page, documents }
    },
    template: `<section aria-label="업무 문서" class="grid w-[min(30rem,calc(100vw-6rem))] gap-3">
      <h2 class="ui-h2">업무 문서</h2>
      <p role="status" class="ui-caption">{{ args.pageCount ? page + ' / ' + args.pageCount + ' 페이지' : '표시할 문서가 없습니다.' }}</p>
      <ul v-if="args.pageCount" class="divide-y divide-border rounded-md border border-border bg-surface">
        <li v-for="document in documents" :key="document" class="ui-body p-3">업무 문서 {{ document }}</li>
      </ul>
      <UIPagination v-bind="args" v-model:page="page" />
    </section>`,
  }),
} satisfies Meta<typeof UIPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Empty: Story = { args: { pageCount: 0 } }
