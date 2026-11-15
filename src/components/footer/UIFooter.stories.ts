import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIFooter from './UIFooter.vue'
import UITopbar from '../topbar/UITopbar.vue'
import UIButton from '../button/UIButton.vue'

const meta = {
  title: 'Layout/UIFooter', component: UIFooter,
  args: { text: '© 사내 업무 포털 · 플랫폼운영팀' },
  parameters: { layout: 'fullscreen' },
  render: args => ({ components: { UIFooter }, setup: () => ({ args }), template: '<UIFooter v-bind="args" />' }),
} satisfies Meta<typeof UIFooter>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const WithLinks: Story = {
  render: args => ({ components: { UIFooter }, setup: () => ({ args }), template: `<UIFooter v-bind="args"><template #navigation><a href="#privacy">개인정보 처리방침</a><a href="mailto:support@company.example">문의하기</a></template></UIFooter>` }),
}
export const WithActions: Story = {
  render: args => ({ components: { UIFooter, UIButton }, setup: () => ({ args, result: ref('') }), template: `<div><UIFooter v-bind="args"><template #navigation><a href="#help">이용 안내</a></template><template #actions><UIButton variant="outline" size="sm" @click="result = '지원 요청을 선택했습니다.'">지원 요청</UIButton></template></UIFooter><p role="status" class="ui-body p-4">{{ result }}</p></div>` }),
}
export const CustomContent: Story = {
  render: args => ({ components: { UIFooter }, setup: () => ({ args }), template: `<UIFooter v-bind="args"><div class="flex flex-wrap gap-2"><span>서비스 운영시간</span><strong>평일 09:00–18:00</strong></div><template #navigation><a href="mailto:support@company.example">운영팀 문의</a></template></UIFooter>` }),
}
export const PageLayout: Story = {
  render: args => ({ components: { UIFooter, UITopbar }, setup: () => ({ args }), template: `<div class="flex min-h-[32rem] flex-col"><UITopbar title="업무 포털" /><main class="flex-1 p-6"><h1 class="ui-h1">내 업무</h1><p class="ui-body mt-2">콘텐츠 영역을 flex-1로 구성해 짧은 페이지에서도 하단 정보를 아래에 배치합니다.</p></main><UIFooter v-bind="args"><template #navigation><a href="#guide">이용 안내</a><a href="mailto:support@company.example">문의하기</a></template></UIFooter></div>` }),
}
export const LongText: Story = { args: { text: '업무 자동화 및 서비스 품질 개선 지원센터\n문의 식별자: ' + 'support_'.repeat(25) } }
