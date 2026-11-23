import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UITooltip from './UITooltip.vue'

const meta = {
  title: 'Components/UITooltip',
  component: UITooltip,
  args: { text: '현재 검색 조건을 적용한 목록을 내려받습니다.' },
  render: args => ({
    components: { UIButton, UITooltip },
    setup: () => ({ args }),
    template: `<div class="grid justify-items-center gap-4">
      <UITooltip v-bind="args"><UIButton variant="outline">목록 내보내기</UIButton></UITooltip>
      <UIButton variant="ghost">목록으로 돌아가기</UIButton>
    </div>`,
  }),
} satisfies Meta<typeof UITooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const LongDescription: Story = {
  args: {
    text: '내보낸 문서에는 화면에 적용한 검색 조건과 정렬 순서가 반영됩니다. 항목의 상세 이력은 각 요청 화면에서 확인할 수 있습니다.',
    side: 'right',
  },
}
