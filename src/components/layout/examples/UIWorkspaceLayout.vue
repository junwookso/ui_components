<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import UITopbar from '../../topbar/UITopbar.vue'
import UIDrawer from '../../drawer/UIDrawer.vue'
import UIFooter from '../../footer/UIFooter.vue'
import UIButton from '../../button/UIButton.vue'
import UICard from '../../card/UICard.vue'
import UIList from '../../list/UIList.vue'
import UIChip from '../../chip/UIChip.vue'
import UIWorkspaceNavigation from './UIWorkspaceNavigation.vue'
import type { WorkspacePage } from './types'

const pages: readonly WorkspacePage[] = [
  { key: 'tasks', label: '내 업무', description: '오늘 검토할 요청과 진행 중인 업무를 확인하세요.' },
  { key: 'projects', label: '프로젝트', description: '담당 프로젝트의 진행 상황과 일정을 확인하세요.' },
  { key: 'reports', label: '보고서', description: '운영 현황과 검토 결과를 확인하세요.' },
  { key: 'settings', label: '설정', description: '업무 환경과 알림 설정을 확인하세요.' },
]
const current = ref<WorkspacePage>(pages[0]!)
const desktop = ref(false)
const menuOpen = ref(false)
const sidebar = ref<HTMLElement>()
const menuTrigger = ref<HTMLElement>()
const main = ref<HTMLElement>()
const id = useId()
const status = ref('')
let media: MediaQueryList | undefined
let alive = true
const tasks = Array.from({ length: 12 }, (_, i) => ({ key: `task-${i}`, title: ['접근 권한 검토', '프로젝트 일정 확인', '운영 보고서 검토'][i % 3]! + ` ${i + 1}`, description: ['플랫폼개발팀 · 김민수', '서비스운영팀 · 이서연', '품질관리팀 · 박지훈'][i % 3] }))
async function setViewport(matches: boolean) {
  const moveToSidebar = matches && (menuOpen.value || !!menuTrigger.value?.contains(document.activeElement))
  const moveToTrigger = !matches && !!sidebar.value?.contains(document.activeElement)
  desktop.value = matches
  menuOpen.value = false
  await nextTick()
  if (!alive) return
  if (moveToSidebar) sidebar.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus()
  else if (moveToTrigger) menuTrigger.value?.querySelector('button')?.focus()
}
function changeViewport(event: MediaQueryListEvent) { void setViewport(event.matches) }
async function navigate(page: WorkspacePage) {
  current.value = page
  menuOpen.value = false
  status.value = ''
  await nextTick()
  if (alive && main.value) {
    main.value.scrollTop = 0
    main.value.focus()
  }
}
onMounted(() => {
  media = window.matchMedia('(min-width: 64rem)')
  void setViewport(media.matches)
  media.addEventListener('change', changeViewport)
})
onBeforeUnmount(() => { alive = false; media?.removeEventListener('change', changeViewport) })
</script>

<template>
  <div class="grid h-dvh min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] bg-page text-foreground" data-testid="workspace-layout">
    <a :href="`#${id}-main`" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:p-3 focus:text-primary" @click.prevent="main?.focus()">본문으로 건너뛰기</a>
    <UITopbar title="업무 포털">
      <template v-if="!desktop" #leading><span ref="menuTrigger"><UIButton variant="ghost" size="sm" :aria-expanded="menuOpen" :aria-controls="`${id}-drawer`" @click="menuOpen = true">메뉴 열기</UIButton></span></template>
      <template #actions><span class="ui-body">김민수 · 플랫폼개발팀</span></template>
    </UITopbar>
    <div class="grid min-h-0 min-w-0" :class="desktop ? 'grid-cols-[16rem_minmax(0,1fr)]' : 'grid-cols-1'">
      <aside v-if="desktop" ref="sidebar" aria-label="서비스 메뉴" class="min-h-0 overflow-y-auto border-r border-border bg-surface p-4">
        <p class="ui-label mb-3 px-3 text-muted-foreground">업무 공간</p>
        <UIWorkspaceNavigation :current="current.key" :pages="pages" @navigate="navigate" />
      </aside>
      <main :id="`${id}-main`" ref="main" tabindex="-1" class="min-h-0 min-w-0 overflow-y-auto p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:p-6" :aria-labelledby="`${id}-heading`">
        <h1 :id="`${id}-heading`" class="ui-h1">{{ current.label }}</h1>
        <p class="ui-body mt-2 text-muted-foreground">{{ current.description }}</p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <UICard title="검토 대기"><p class="ui-h1">12건</p><p class="ui-body mt-2 text-muted-foreground">담당 업무를 확인해 주세요.</p></UICard>
          <UICard title="이번 주 완료"><p class="ui-h1">28건</p><p class="ui-body mt-2 text-muted-foreground">완료한 업무의 결과를 공유했습니다.</p></UICard>
        </div>
        <div class="mt-6"><UIList :label="`${current.label} 목록`" :items="tasks"><template #meta="{ index }"><UIChip :label="index % 2 ? '진행 중' : '검토 필요'" :variant="index % 2 ? 'info' : 'warning'" size="sm" /></template><template #actions="{ item }"><UIButton variant="outline" size="sm" :aria-label="`${item.title} 상세 보기`" @click="status = item.title + ' 선택됨'">상세 보기</UIButton></template></UIList></div>
        <p role="status" class="ui-body mt-4">{{ status }}</p>
      </main>
    </div>
    <UIFooter text="© 업무 포털 · 플랫폼운영팀"><template #navigation><a href="mailto:support@company.example">운영팀 문의</a></template></UIFooter>
    <UIDrawer :id="`${id}-drawer`" v-model:open="menuOpen" title="서비스 메뉴" side="left" size="sm">
      <UIWorkspaceNavigation :current="current.key" :pages="pages" @navigate="navigate" />
    </UIDrawer>
  </div>
</template>
