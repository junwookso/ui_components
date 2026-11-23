import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import UIButton from '../button/UIButton.vue'
import UISkeleton from './UISkeleton.vue'

const meta = {
  title: 'Components/UISkeleton',
  component: UISkeleton,
  args: { shape: 'line', pulse: false },
  render: args => ({
    components: { UISkeleton },
    setup: () => ({ args }),
    template: `<div class="w-[min(24rem,calc(100vw-6rem))]"><UISkeleton v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof UISkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const LoadingCard: Story = {
  args: { pulse: true },
  render: args => ({
    components: { UIButton, UISkeleton },
    setup: () => ({ args, loading: ref(true) }),
    template: `<div class="grid w-[min(24rem,calc(100vw-6rem))] gap-3">
      <section aria-label="요청 담당자" :aria-busy="loading" class="grid min-h-44 gap-3 rounded-md border border-border bg-surface p-4">
        <template v-if="loading">
          <div class="flex items-center gap-3">
            <UISkeleton shape="circle" :pulse="args.pulse" />
            <UISkeleton class="w-1/2" :pulse="args.pulse" />
          </div>
          <UISkeleton shape="block" :pulse="args.pulse" />
        </template>
        <template v-else>
          <h3 class="ui-h3">운영지원팀</h3>
          <p class="ui-body">업무 포털 권한 요청과 문의를 담당합니다.</p>
        </template>
      </section>
      <p role="status" class="ui-body">{{ loading ? '담당자 정보를 불러오는 중입니다.' : '담당자 정보를 불러왔습니다.' }}</p>
      <UIButton variant="outline" @click="loading = !loading">{{ loading ? '불러오기 완료' : '다시 불러오기' }}</UIButton>
    </div>`,
  }),
}
