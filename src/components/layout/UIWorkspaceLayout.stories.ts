import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIWorkspaceLayout from './examples/UIWorkspaceLayout.vue'

const meta = {
  title: 'Layout/Basic Layout', component: UIWorkspaceLayout,
  parameters: { layout: 'fullscreen', fullBleed: true, controls: { disable: true }, docs: { description: { component: 'Topbar + 왼쪽 메뉴 + 본문 + Footer 조합 예제. 1024px 이상은 상시 표시 메뉴, 미만은 메뉴 버튼으로 여는 UIDrawer를 사용합니다. 본문만 스크롤하고 Topbar/Footer는 유지됩니다. 뷰포트 크기를 바꾸어 두 모드를 확인하세요. 이 샘플은 배포 API에 포함되지 않습니다.' } } },
} satisfies Meta<typeof UIWorkspaceLayout>
export default meta
type Story = StoryObj<typeof meta>
export const Responsive: Story = {}
