import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UICircleProgress from './UICircleProgress.vue'
import UIButton from '../button/UIButton.vue'

const meta = {
  title: 'Components/UICircleProgress', component: UICircleProgress,
  args: { label: '파일 업로드', size: 'default' },
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] } },
  render: args => ({ components: { UICircleProgress }, setup: () => ({ args }), template: '<UICircleProgress v-bind="args" />' }),
} satisfies Meta<typeof UICircleProgress>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Sizes: Story = {
  render: () => ({ components: { UICircleProgress }, template: '<div class="flex flex-wrap items-center gap-8"><UICircleProgress label="작은 화면 로딩" size="sm" /><UICircleProgress label="업로드 중" /><UICircleProgress label="대량 내보내기 중" size="lg" description="처리가 끝나면 완료 여부를 안내합니다." /></div>' }),
}
export const InContext: Story = {
  render: () => ({
    components: { UICircleProgress, UIButton },
    setup() { const loading = ref(true); const message = ref(''); function toggle() { loading.value = !loading.value; message.value = loading.value ? '보고서 생성을 시작했습니다.' : '보고서 생성을 마쳤습니다.' }; return { loading, message, toggle } },
    template: '<div class="grid gap-4" style="width: min(28rem, calc(100vw - 6rem))"><div class="flex items-center gap-3"><UICircleProgress v-if="loading" label="보고서 생성" size="sm" /><p class="ui-body">{{ loading ? "보고서를 생성하고 있습니다." : "보고서 생성이 완료되었습니다." }}</p></div><div class="flex justify-end"><UIButton size="sm" variant="outline" @click="toggle">{{ loading ? "완료 처리 예시" : "다시 시작" }}</UIButton></div><p class="ui-body" role="status">{{ message }}</p></div>',
  }),
}
