import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UITopbar from './UITopbar.vue'
import UIButton from '../button/UIButton.vue'
import UIInput from '../input/UIInput.vue'

const meta = {
  title: 'Layout/UITopbar', component: UITopbar,
  args: { title: '업무 포털', sticky: false, variant: 'default' },
  parameters: { layout: 'fullscreen' },
  render: args => ({ components: { UITopbar }, setup: () => ({ args }), template: '<UITopbar v-bind="args" />' }),
} satisfies Meta<typeof UITopbar>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Primary: Story = {
  args: { variant: 'primary' },
  render: args => ({
    components: { UITopbar },
    setup: () => ({ args }),
    template: `<div>
      <UITopbar v-bind="args">
        <template #navigation><a href="#primary-overview" aria-current="page">운영 현황</a></template>
      </UITopbar>
      <main id="primary-overview" class="p-6"><h1 class="ui-h1">운영 현황</h1></main>
    </div>`,
  }),
}
export const Workspace: Story = {
  render: args => ({
    components: { UITopbar, UIButton, UIInput },
    setup: () => ({ args, current: ref('tasks'), query: ref(''), result: ref(''), menuOpen: ref(false) }),
    template: `<div>
      <UITopbar v-bind="args">
        <template #leading><UIButton variant="ghost" size="sm" :aria-expanded="menuOpen" aria-controls="workspace-menu" @click="menuOpen = !menuOpen">메뉴</UIButton></template>
        <template #brand><a href="#workspace-home" class="text-foreground no-underline">업무 포털</a></template>
        <template #navigation>
          <a href="#tasks" :aria-current="current === 'tasks' ? 'page' : undefined" @click="current = 'tasks'">내 업무</a>
          <a href="#projects" :aria-current="current === 'projects' ? 'page' : undefined" @click="current = 'projects'">프로젝트</a>
          <a href="#reports" :aria-current="current === 'reports' ? 'page' : undefined" @click="current = 'reports'">보고서</a>
        </template>
        <template #search><form role="search" aria-label="업무 검색" @submit.prevent="result = query ? query + ' 검색 요청' : '검색어를 입력해 주세요.'"><UIInput v-model="query" type="search" aria-label="업무 검색어" placeholder="업무 검색" /></form></template>
        <template #actions><UIButton variant="outline" size="sm" @click="result = '알림을 확인했습니다.'">알림</UIButton><UIButton variant="ghost" size="sm" @click="result = '김민수 계정 선택됨'">김민수</UIButton></template>
      </UITopbar>
      <nav v-if="menuOpen" id="workspace-menu" aria-label="추가 메뉴" class="p-4"><a href="#settings" class="text-primary underline">설정</a></nav>
      <main id="workspace-home" class="p-6"><h1 class="ui-h1">내 업무</h1><p class="ui-body mt-2">상단 바는 내비게이션과 공통 작업을 제공하고, 본문 레이아웃은 화면에서 구성합니다.</p><p role="status" class="ui-body mt-4">{{ result }}</p></main>
    </div>`,
  }),
}
export const Sticky: Story = {
  args: { sticky: true },
  render: args => ({ components: { UITopbar }, setup: () => ({ args }), template: `<div style="height: 24rem; overflow: auto" data-testid="scroll-container"><UITopbar v-bind="args"><template #navigation><a href="#sticky-content" aria-current="page">업무 안내</a></template></UITopbar><main id="sticky-content" class="p-6"><p v-for="n in 30" :key="n" class="ui-body mb-4">{{ n }}. 업무 안내 내용을 확인하세요.</p></main></div>` }),
}
export const LongTitle: Story = { args: { title: '사내 업무 자동화 및 서비스 품질 개선 관리 포털 project_abcdefghijklmnopqrstuvwxyz_0123456789' } }
