import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UINavigationMenu from './UINavigationMenu.vue'
import UIDrawer from '../drawer/UIDrawer.vue'
import UIButton from '../button/UIButton.vue'
import type { UINavigationMenuItem } from './types'
const items: UINavigationMenuItem[] = [
  { key: 'home', label: '홈', routeName: 'home', href: '#home' },
  { key: 'work', label: '업무 관리', children: [
    { key: 'projects', label: '프로젝트', children: [
      { key: 'list', label: '프로젝트 목록', routeName: 'projects', href: '#projects' },
      { key: 'approvals', label: '승인 요청', routeName: 'approvals', href: '#approvals' },
    ] },
    { key: 'tasks', label: '내 업무', routeName: 'tasks', href: '#tasks' },
  ] },
  { key: 'settings', label: '관리자 설정 (권한 없음)', routeName: 'settings', disabled: true },
]
const meta = {
  title: 'Layout/UINavigationMenu', component: UINavigationMenu,
  args: { items, currentRouteName: 'projects', label: '업무 메뉴' },
  render: args => ({ components: { UINavigationMenu }, setup() {
    const current = ref(args.currentRouteName)
    function select(item: UINavigationMenuItem, event: MouseEvent) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
      event.preventDefault(); current.value = item.routeName
    }
    return { args, current, select }
  }, template: '<div style="max-width: 280px"><UINavigationMenu v-bind="args" :current-route-name="current" @select="select" /><p role="status">현재 route: {{ current }}</p></div>' }),
} satisfies Meta<typeof UINavigationMenu>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const UnmatchedRoute: Story = { args: { currentRouteName: 'unknown' } }
export const LongLabels: Story = { args: { items: [{ key: 'long', label: '여러 부서가 함께 확인하는 프로젝트 진행 현황과 승인 요청 내역', routeName: 'projects' }] } }
export const InDrawer: Story = {
  render: args => ({ components: { UINavigationMenu, UIDrawer, UIButton }, setup() {
    const open = ref(false), current = ref<string | symbol | null | undefined>('projects')
    function select(item: UINavigationMenuItem, event: MouseEvent) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
      event.preventDefault(); current.value = item.routeName; open.value = false
    }
    return { args, open, current, select }
  }, template: '<UIButton @click="open = true">메뉴 열기</UIButton><UIDrawer v-model:open="open" title="업무 메뉴" side="left" size="sm"><UINavigationMenu v-bind="args" :current-route-name="current" @select="select" /></UIDrawer><p role="status">현재 route: {{ current }}</p>' }),
}
