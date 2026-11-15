import { defineComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UINotifyProvider from './UINotifyProvider.vue'
import { useNotify } from './context'
import UIButton from '../button/UIButton.vue'

const Example = defineComponent({
  components: { UIButton },
  setup() {
    const { notify, dismiss, clear } = useNotify()
    let last: string | null = null
    return {
      show(type: 'info' | 'success' | 'warning' | 'error') {
        const messages = { info: '내보내기가 완료되면 알려드립니다.', success: '변경사항을 저장했습니다.', warning: '세션이 곧 만료됩니다. 작업 내용을 저장해 주세요.', error: '저장하지 못했습니다. 연결을 확인하고 다시 시도해 주세요.' }
        last = notify({ type, message: messages[type] })
      },
      queue() { for (let i = 1; i <= 5; i++) notify({ message: `작업 ${i} 완료`, duration: 0 }) },
      long() { notify({ title: '내보내기 결과', message: '일부 항목을 내보내지 못했습니다.\n대상: ' + 'project_'.repeat(25) + '\n권한을 확인한 후 다시 시도해 주세요.', type: 'warning' }) },
      dismissLast() { if (last) dismiss(last) }, clear,
    }
  },
  template: `<div class="p-6" style="min-height: 24rem">
    <h2 class="ui-h2">작업 결과 알림</h2>
    <p class="mb-4">안내·성공은 5초 후 닫힙니다. 주의·오류는 직접 닫을 때까지 유지됩니다.</p>
    <div class="flex flex-wrap gap-2">
      <UIButton @click="show('success')">저장 완료</UIButton>
      <UIButton variant="outline" @click="show('info')">안내 표시</UIButton>
      <UIButton variant="outline" @click="show('warning')">주의 표시</UIButton>
      <UIButton variant="outline" @click="show('error')">오류 표시</UIButton>
      <UIButton variant="outline" @click="queue">대기열 5개</UIButton>
      <UIButton variant="outline" @click="long">긴 메시지</UIButton>
      <UIButton variant="ghost" @click="dismissLast">마지막 알림 닫기</UIButton>
      <UIButton variant="ghost" @click="clear">모두 닫기</UIButton>
    </div>
  </div>`,
})
const meta = {
  title: 'Actions/Notify', component: UINotifyProvider,
  args: { position: 'top' },
  argTypes: { position: { control: 'select', options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'] } },
  parameters: { layout: 'fullscreen', docs: { description: { component: 'UINotifyProvider 아래에서 useNotify()를 호출합니다. notify({ message, title?, type?, duration? })는 알림 ID를 반환하고 dismiss(id), clear()로 닫습니다. 동시에 3개를 표시하며 대기 알림의 타이머는 표시된 뒤 시작합니다.' } } },
  render: args => ({ components: { UINotifyProvider, Example }, setup: () => ({ args }), template: '<UINotifyProvider v-bind="args"><Example /></UINotifyProvider>' }),
} satisfies Meta<typeof UINotifyProvider>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}

export const TopLeft: Story = { args: { position: 'top-left' } }
export const TopRight: Story = { args: { position: 'top-right' } }
export const Bottom: Story = { args: { position: 'bottom' } }
export const BottomLeft: Story = { args: { position: 'bottom-left' } }
export const BottomRight: Story = { args: { position: 'bottom-right' } }
