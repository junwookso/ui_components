import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIProgress from './UIProgress.vue'
import UIButton from '../button/UIButton.vue'

const meta = {
  title: 'Components/UIProgress', component: UIProgress,
  args: { label: '파일 업로드', value: 45, max: 100, showValue: true, size: 'default', variant: 'default' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    variant: { control: 'select', options: ['default', 'success', 'destructive'] },
  },
  render: args => ({ components: { UIProgress }, setup: () => ({ args }), template: '<div style="width: min(28rem, calc(100vw - 6rem))"><UIProgress v-bind="args" /></div>' }),
} satisfies Meta<typeof UIProgress>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Indeterminate: Story = { args: { value: null, label: '보고서 생성', description: '전체 처리량을 확인하고 있습니다.' } }
export const States: Story = {
  render: () => ({ components: { UIProgress }, template: `<div class="grid gap-6" style="width: min(28rem, calc(100vw - 6rem))"><UIProgress label="대기 중인 업로드" :value="0" /><UIProgress label="파일 업로드" :value="45" /><UIProgress label="업로드 완료" :value="100" variant="success" description="모든 파일을 업로드했습니다." /><UIProgress label="업로드 중단" :value="45" variant="destructive" description="연결이 끊어졌습니다. 연결을 확인한 뒤 다시 시도하세요." /></div>` }),
}
export const Sizes: Story = {
  render: () => ({ components: { UIProgress }, template: `<div class="grid gap-6" style="width: min(28rem, calc(100vw - 6rem))"><UIProgress label="작은 진행 막대" :value="30" size="sm" /><UIProgress label="기본 진행 막대" :value="50" /><UIProgress label="큰 진행 막대" :value="70" size="lg" /></div>` }),
}
export const CustomValue: Story = { args: { label: '문서 처리', value: 3, max: 10, valueText: '3 / 10건', description: '검토가 완료된 문서 수입니다.' } }
export const Interactive: Story = {
  render: () => ({
    components: { UIProgress, UIButton },
    setup: () => ({ value: ref(0), message: ref('') }),
    template: `<div class="grid gap-4" style="width: min(28rem, calc(100vw - 6rem))"><UIProgress label="문서 처리" :value="value" :max="5" :value-text="value + ' / 5건'" :variant="value === 5 ? 'success' : 'default'" description="아래 버튼으로 처리 결과를 반영하는 로컬 예제입니다." /><div class="flex flex-wrap justify-end gap-2"><UIButton size="sm" variant="ghost" @click="value = 0; message = '진행률을 초기화했습니다.'">초기화</UIButton><UIButton size="sm" :disabled="value === 5" @click="value++; message = value === 5 ? '모든 문서 처리가 완료되었습니다.' : ''">1건 처리</UIButton></div><p class="ui-body" role="status">{{ message }}</p></div>`,
  }),
}
export const LongLabel: Story = { args: { label: '사내 업무 자동화 서비스의 월별 사용 현황 보고서를 생성하고 있습니다', description: '긴 설명은 좁은 화면에서도 줄바꿈하여 표시합니다.' } }
