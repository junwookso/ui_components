<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, useId, useTemplateRef } from 'vue'
import {
  UIAlert, UIBreadcrumb, UIButton, UICard, UIChip, UIDataTable, UIDescriptions, UIDrawer,
  UIFooter, UIFormField, UIInput, UIList, UIProgress, UISelect, UITabs,
  UITextarea, UITopbar, useNotify,
  type UIDataTablePagination, type UINavigationMenuItem,
} from '../../index'
import { columns, initialActivity, initialRequests, periods, sampleDate, statusVariants, teams, type Request } from './admin-dashboard-data'
import {
  UIBarChart, UILineChart, UIPieChart,
  type UIBarChartOption, type UILineChartOption, type UIPieChartOption,
} from '../../charts'
import { chartPalette } from '../../components/chart/palette'
import UIAdminNavigation from './UIAdminNavigation.vue'

const dark = defineModel<boolean>('dark', { required: true })
const id = useId()
const notify = useNotify()
function sectionLink(key: string, label: string) {
  return { key, label, routeName: key, href: `#${id}-${key}` }
}
const overviewLink = sectionLink('overview', '대시보드')
const navigation: UINavigationMenuItem[] = [
  {
    key: 'operations',
    label: '운영 현황',
    children: [overviewLink, sectionLink('trend', '처리 추이'), sectionLink('teams', '팀 운영 현황')],
  },
  {
    key: 'request-management',
    label: '요청 관리',
    children: [sectionLink('requests', '업무 요청')],
  },
]
const activeSection = ref(overviewLink.key)
const menuOpen = ref(false)
const sidebar = useTemplateRef<HTMLElement>('sidebar')
let desktopViewport: MediaQueryList | undefined
const createOpen = ref(false)
const detailOpen = ref(false)
const requests = ref(initialRequests.slice())
const activity = ref(initialActivity.slice())
const selectedId = ref('')
const selectedRequest = computed(() => requests.value.find(request => request.id === selectedId.value))
const pagination = ref<UIDataTablePagination>({ pageIndex: 0, pageSize: 5 })
const statusFilter = ref('')
const search = ref('')
const statusOptions = Object.keys(statusVariants).map(status => ({ value: status, label: status }))
const visibleRequests = computed(() => requests.value.filter(request => !statusFilter.value || request.status === statusFilter.value))
const pending = computed(() => requests.value.filter(request => request.status !== '완료').length)
const received = computed(() => requests.value.filter(request => request.status === '접수').length)
const detailItems = computed(() => {
  const request = selectedRequest.value
  if (!request) return []
  return [
    { key: 'id', label: '요청 번호', value: request.id },
    { key: 'team', label: '담당 팀', value: request.team },
    { key: 'date', label: '접수일', value: request.date },
    { key: 'status', label: '상태', value: request.status },
    { key: 'description', label: '요청 내용', value: request.description },
  ]
})
const draft = reactive({ title: '', team: '', description: '' })
const titleError = ref('')
const titleInputId = `${id}-request-title`
let nextRequestNumber = 1049

const [latestPeriod, ...earlierPeriods] = periods
const periodKey = ref('')
const period = computed(() => earlierPeriods.find(item => item.value === periodKey.value) ?? latestPeriod)
const periodStats = computed(() => {
  const { intake, completed, firstDay } = period.value
  let intakeTotal = 0
  let completedTotal = 0
  const days = intake.map((dailyIntake, index) => {
    const dailyCompleted = completed[index]!
    intakeTotal += dailyIntake
    completedTotal += dailyCompleted
    return {
      day: firstDay + index,
      intake: dailyIntake,
      completed: dailyCompleted,
      cumulativeIntake: intakeTotal,
      cumulativeCompleted: completedTotal,
    }
  })
  return { days, intakeTotal, completedTotal }
})
const dayLabels = computed(() => periodStats.value.days.map(({ day }) => `${day}일`))
const chartLabel = computed(() => `11월 일별 업무 요청(건). ${periodStats.value.days.map(day =>
  `${day.day}일 접수 ${day.intake}건, 완료 ${day.completed}건`).join('. ')}.`)
const chartOption = computed<UIBarChartOption>(() => ({
  xAxis: { type: 'category', data: dayLabels.value, axisLabel: { interval: 0 } },
  yAxis: { type: 'value', min: 0, max: 40, interval: 10 },
  series: [
    { type: 'bar', name: '접수', data: periodStats.value.days.map(day => day.intake), barMaxWidth: 24, emphasis: { disabled: true },
      itemStyle: { color: 'var(--admin-bar-intake)', borderColor: 'var(--ui-muted-foreground)', borderWidth: 1 } },
    { type: 'bar', name: '완료', data: periodStats.value.days.map(day => day.completed), barMaxWidth: 24, emphasis: { disabled: true },
      itemStyle: { color: 'var(--admin-bar-completed)' } },
  ],
}))
const cumulativeLabel = computed(() => `11월 누적 업무 처리(건). ${periodStats.value.days.map(day =>
  `${day.day}일 누적 접수 ${day.cumulativeIntake}건, 누적 완료 ${day.cumulativeCompleted}건`).join('. ')}.`)
const cumulativeOption = computed<UILineChartOption>(() => ({
  xAxis: { type: 'category', data: dayLabels.value, axisLabel: { hideOverlap: true } },
  yAxis: { type: 'value', min: 0, minInterval: 1 },
  series: [
    { type: 'line', name: '누적 접수', data: periodStats.value.days.map(day => day.cumulativeIntake),
      symbol: 'circle' },
    { type: 'line', name: '누적 완료', data: periodStats.value.days.map(day => day.cumulativeCompleted),
      symbol: 'diamond', lineStyle: { type: 'dashed' } },
  ],
}))
const percent = new Intl.NumberFormat('ko-KR', { style: 'percent', maximumFractionDigits: 1 })
const statusCounts = computed(() => statusOptions.map(({ value: name }) => ({
  name,
  value: requests.value.filter(request => request.status === name).length,
})))
const statusChartLabel = computed(() => `전체 요청 상태 비중. ${statusCounts.value.map(({ name, value }) =>
  `${name} ${value}건`).join(', ')}.`)
const statusChartOption = computed<UIPieChartOption>(() => ({
  series: [{
    type: 'pie', radius: ['48%', '85%'], data: statusCounts.value, stillShowZeroSum: false,
    label: { show: false }, emphasis: { disabled: true },
    itemStyle: { borderColor: 'var(--ui-surface, var(--ui-background))', borderWidth: 2 },
  }],
}))
const metrics = computed(() => {
  const { intakeTotal, completedTotal } = periodStats.value
  return [
    { icon: 'inbox', label: '접수 건수', value: intakeTotal, unit: '건', description: '선택 기간에 접수한 요청' },
    { icon: 'check', label: '완료 건수', value: completedTotal, unit: '건', description: '선택 기간에 완료한 요청' },
    { icon: 'percent', label: '접수 대비 완료', value: Math.round(completedTotal / intakeTotal * 100), unit: '%', description: '선택 기간의 완료 ÷ 접수' },
    { icon: 'clock', label: '미완료 요청', value: pending.value, unit: '건', description: '현재 목록의 접수·처리 중 요청' },
  ]
})
const operationTabs = [{ value: 'team', label: '팀별 진행률' }, { value: 'activity', label: '최근 활동' }]
const teamProgress = computed(() => teams.map(team => {
  const assigned = requests.value.filter(request => request.team === team)
  return { team, total: assigned.length, completed: assigned.filter(request => request.status === '완료').length }
}))
const teamOptions = teams.map(team => ({ value: team, label: team }))

async function navigate(item: UINavigationMenuItem, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !item.href) return
  event.preventDefault()
  activeSection.value = item.key
  menuOpen.value = false
  await nextTick()
  const target = document.getElementById(item.href.slice(1))
  target?.scrollIntoView({ block: 'start' })
  target?.focus({ preventScroll: true })
}

async function closeMenuOnDesktop(event: MediaQueryListEvent) {
  if (!event.matches || !menuOpen.value) return
  menuOpen.value = false
  await nextTick()
  sidebar.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus()
}

onMounted(() => {
  desktopViewport = window.matchMedia('(min-width: 64rem)')
  desktopViewport.addEventListener('change', closeMenuOnDesktop)
})
onUnmounted(() => desktopViewport?.removeEventListener('change', closeMenuOnDesktop))

function filterStatus(status = '') {
  statusFilter.value = status
  pagination.value = { ...pagination.value, pageIndex: 0 }
}

function openDetail(request: Request) {
  selectedId.value = request.id
  detailOpen.value = true
}

function openCreate() {
  Object.assign(draft, { title: '', team: '', description: '' })
  titleError.value = ''
  createOpen.value = true
}

async function saveRequest() {
  const title = draft.title.trim()
  if (!title) {
    titleError.value = '공백을 제외한 요청 제목을 입력해 주세요.'
    await nextTick()
    document.getElementById(titleInputId)?.focus()
    return
  }
  const request: Request = {
    id: `REQ-${nextRequestNumber++}`, title, team: draft.team,
    date: sampleDate, status: '접수', description: draft.description.trim(),
  }
  requests.value = [request, ...requests.value]
  search.value = ''
  filterStatus()
  createOpen.value = false
  await recordActivity(request, '등록')
}

async function completeRequest(request: Request) {
  requests.value = requests.value.map(item => item.id === request.id ? { ...item, status: '완료' } : item)
  detailOpen.value = false
  await recordActivity(request, '완료')
  // The original detail button can disappear when the status filter is active.
  if (document.activeElement === document.body) document.getElementById(`${id}-requests`)?.focus()
}

async function recordActivity(request: Request, action: '등록' | '완료') {
  const title = `${request.title} ${action}`
  activity.value = [{ key: `${request.id}-${action}`, title, description: `방금 전 · ${request.team}` }, ...activity.value].slice(0, 4)
  await nextTick()
  notify.notify({ type: 'success', message: `${request.id} 요청을 ${action}했습니다.` })
}
</script>

<template>
  <div class="admin-dashboard">
    <a :href="overviewLink.href" class="admin-skip-link sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:p-3 focus:text-primary"
      @click="navigate(overviewLink, $event)">본문으로 건너뛰기</a>
    <UITopbar variant="primary" title="운영 포털" label="운영 포털 상단 바">
      <template #leading>
        <div class="lg:hidden">
          <UIButton variant="outline" size="sm" class="[--ui-ring:var(--ui-primary-foreground)]" aria-haspopup="dialog" :aria-expanded="menuOpen" :aria-controls="`${id}-menu`" @click="menuOpen = true">메뉴</UIButton>
        </div>
      </template>
      <template #brand>
        <span class="flex items-center gap-2.5">
          <span class="admin-mark" aria-hidden="true"></span>
          운영 포털
        </span>
      </template>
      <template #actions>
        <UIChip label="샘플 데이터" variant="outline" size="sm" class="hidden border-current bg-transparent text-current sm:inline-flex" />
        <UIButton :variant="dark ? 'secondary' : 'outline'" size="sm" class="[--ui-ring:var(--ui-primary-foreground)]"
          :aria-pressed="dark" @click="dark = !dark">다크 모드</UIButton>
      </template>
    </UITopbar>

    <div class="admin-shell">
      <aside ref="sidebar" class="admin-sidebar" aria-label="운영 포털 사이드바" tabindex="0">
        <p class="ui-label ui-text-muted px-3 pb-2">운영 관리</p>
        <UIAdminNavigation :items="navigation" :current-route-name="activeSection" @select="navigate" />
      </aside>

      <div class="admin-content" role="group" aria-label="대시보드 본문 영역" tabindex="0">
        <main class="admin-main grid min-w-0 content-start gap-6">
          <header class="grid gap-3">
            <UIBreadcrumb :items="[{ key: 'admin', label: '운영 관리' }, { key: 'overview', label: '대시보드' }]" />
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div class="grid gap-1">
                <h1 :id="`${id}-overview`" class="ui-h1 admin-anchor" tabindex="-1">운영 대시보드</h1>
                <p class="ui-subtitle ui-text-muted">업무 요청의 접수와 처리 현황을 확인합니다.</p>
              </div>
              <UIButton @click="openCreate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                새 요청 등록
              </UIButton>
            </div>
          </header>

          <div class="admin-metrics">
            <UICard v-for="metric in metrics" :key="metric.icon" class="admin-metric">
              <template #title><span class="ui-text-muted">{{ metric.label }}</span></template>
              <span class="admin-metric-icon" :data-icon="metric.icon" aria-hidden="true"></span>
              <p class="admin-metric-value"><strong>{{ metric.value }}</strong><span>{{ metric.unit }}</span></p>
              <p class="ui-caption ui-text-muted mt-1">{{ metric.description }}</p>
            </UICard>
          </div>

          <div class="admin-insights">
            <UICard class="admin-chart">
              <template #title><span :id="`${id}-trend`" class="admin-anchor" tabindex="-1">업무 처리 추이</span></template>
              <div class="flex flex-wrap items-end justify-between gap-3">
                <div class="flex flex-wrap gap-x-4 gap-y-2 pb-2">
                  <span class="admin-legend"><i class="admin-intake" aria-hidden="true"></i>접수</span>
                  <span class="admin-legend"><i class="admin-completed" aria-hidden="true"></i>완료</span>
                </div>
                <UIFormField v-slot="{ controlAttrs }" label="집계 기간">
                  <UISelect v-bind="controlAttrs" v-model="periodKey" :options="earlierPeriods" :placeholder="latestPeriod.label" size="sm" />
                </UIFormField>
              </div>
              <UIBarChart :option="chartOption" :label="chartLabel" />
            </UICard>

            <UICard class="admin-operations">
              <template #title><span :id="`${id}-teams`" class="admin-anchor" tabindex="-1">팀 운영 현황</span></template>
              <UITabs :items="operationTabs" label="팀 운영 현황">
                <template #panel="{ item, active }">
                  <div v-if="active && item.value === 'team'" class="grid gap-4">
                    <UIProgress v-for="team in teamProgress" :key="team.team" :label="team.team" size="sm"
                      :value="team.completed" :max="team.total" :value-text="`${team.completed} / ${team.total}건 완료`" />
                  </div>
                  <UIList v-else-if="active" label="요청 활동 기록" :items="activity" :heading-level="3" size="sm" />
                </template>
              </UITabs>
            </UICard>
          </div>

          <div class="admin-insights">
            <UICard class="admin-chart" title="기간 내 누적 처리 추이">
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                <span class="admin-legend">
                  <span class="admin-line-key" aria-hidden="true"></span>누적 접수
                </span>
                <span class="admin-legend">
                  <span class="admin-line-key admin-line-completed" aria-hidden="true"></span>누적 완료
                </span>
              </div>
              <UILineChart :option="cumulativeOption" :label="cumulativeLabel" />
            </UICard>

            <UICard class="admin-chart" title="요청 상태별 비중">
              <UIPieChart :option="statusChartOption" :label="statusChartLabel" />
              <ul class="flex list-none flex-wrap justify-center gap-x-4 gap-y-2 p-0" aria-label="요청 상태 범례">
                <li v-for="(status, index) in statusCounts" :key="status.name" class="admin-legend">
                  <i :style="{ backgroundColor: chartPalette[index] }" aria-hidden="true"></i>
                  {{ status.name }} {{ status.value }}건 ({{ percent.format(status.value / (requests.length || 1)) }})
                </li>
              </ul>
            </UICard>
          </div>

          <UIAlert v-if="received" type="info" title="검토 대기 요청">
            담당 팀에서 검토할 신규 요청이 {{ received }}건 있습니다.
          </UIAlert>

          <UICard class="admin-requests">
            <template #title><span :id="`${id}-requests`" class="admin-anchor" tabindex="-1">업무 요청</span></template>
            <UIDataTable v-model:global-filter="search" v-model:pagination="pagination" label="요청 목록" searchable search-size="default"
              :data="visibleRequests" :columns="columns" :get-row-id="row => row.id" empty-text="해당 상태의 요청이 없습니다.">
              <template #toolbar>
                <UIFormField v-slot="{ controlAttrs }" label="상태">
                  <UISelect v-bind="controlAttrs" :model-value="statusFilter" :options="statusOptions" placeholder="전체 상태" @update:model-value="filterStatus" />
                </UIFormField>
              </template>
              <template #cell-title="{ row }">
                <UIButton variant="link" size="sm" class="admin-row-link" @click="openDetail(row)">{{ row.title }}</UIButton>
              </template>
              <template #cell-status="{ row }">
                <UIChip :label="row.status" :variant="statusVariants[row.status]" size="sm" />
              </template>
              <template #cell-date="{ row }"><time :datetime="row.date" class="whitespace-nowrap">{{ row.date }}</time></template>
            </UIDataTable>
          </UICard>
        </main>

        <UIFooter class="admin-footer" text="운영 포털 · 관리자 화면 샘플">
          <template #navigation>
            <a :href="overviewLink.href" @click="navigate(overviewLink, $event)">대시보드로 이동</a>
          </template>
        </UIFooter>
      </div>
    </div>

    <UIDrawer :id="`${id}-menu`" v-model:open="menuOpen" title="운영 관리 메뉴" side="left" size="sm">
      <UIAdminNavigation :items="navigation" :current-route-name="activeSection" @select="navigate" />
    </UIDrawer>

    <UIDrawer v-model:open="detailOpen" title="요청 상세" :description="selectedRequest?.title" size="lg">
      <UIDescriptions v-if="selectedRequest" label="요청 정보" :heading-level="3" :items="detailItems">
        <template #value-status><UIChip :label="selectedRequest.status" :variant="statusVariants[selectedRequest.status]" size="sm" /></template>
        <template #value-description="{ value }">{{ value || '입력한 내용이 없습니다.' }}</template>
      </UIDescriptions>
      <template #actions="{ close }">
        <UIButton variant="ghost" @click="close">닫기</UIButton>
        <UIButton v-if="selectedRequest && selectedRequest.status !== '완료'" @click="completeRequest(selectedRequest)">처리 완료</UIButton>
      </template>
    </UIDrawer>

    <UIDrawer v-model:open="createOpen" title="새 요청 등록" description="요청 제목과 담당 팀을 입력해 주세요.">
      <form :id="`${id}-request-form`" class="grid gap-6" @submit.prevent="saveRequest">
        <UIFormField v-slot="{ controlAttrs }" :id="titleInputId" label="요청 제목" required :error="titleError">
          <UIInput v-bind="controlAttrs" v-model="draft.title" maxlength="80" @update:model-value="titleError = ''" />
        </UIFormField>
        <UIFormField v-slot="{ controlAttrs }" label="담당 팀" required>
          <UISelect v-bind="controlAttrs" v-model="draft.team" :options="teamOptions" placeholder="담당 팀 선택" />
        </UIFormField>
        <UIFormField v-slot="{ controlAttrs }" label="요청 내용">
          <UITextarea v-bind="controlAttrs" v-model="draft.description" :rows="4" :maxlength="500" />
        </UIFormField>
      </form>
      <template #actions="{ close }">
        <UIButton variant="ghost" @click="close">취소</UIButton>
        <UIButton type="submit" :form="`${id}-request-form`">등록</UIButton>
      </template>
    </UIDrawer>
  </div>
</template>

<style scoped>
.admin-dashboard {
  --admin-bar-completed: var(--ui-chart-2);
  --admin-bar-intake: var(--ui-chart-1);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100dvh;
  background: var(--ui-page-background);
}
.admin-mark {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  border-radius: .375rem;
  background: var(--ui-primary-foreground);
  color: var(--ui-primary);
}
.admin-mark::before {
  content: '';
  width: .75rem;
  height: .75rem;
  background: linear-gradient(currentColor 0 0) left bottom / 27% 50% no-repeat,
    linear-gradient(currentColor 0 0) center bottom / 27% 75% no-repeat,
    linear-gradient(currentColor 0 0) right bottom / 27% 100% no-repeat;
}
.admin-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.admin-sidebar { display: none; }
.admin-content {
  display: flex;
  flex-direction: column;
}
.admin-content, .admin-sidebar {
  overflow-y: auto;
  overscroll-behavior: contain;
}
.admin-content:focus-visible, .admin-sidebar:focus-visible {
  outline: 2px solid var(--ui-ring);
  outline-offset: -2px;
}
.admin-main {
  flex: 1 0 auto;
  width: min(100%, 90rem);
  margin-inline: auto;
  padding: 1.5rem clamp(1rem, 3vw, 2rem) 2rem;
}
.admin-anchor { scroll-margin-top: 1.5rem; }
.admin-anchor:focus-visible { outline: 2px solid var(--ui-ring); outline-offset: 3px; }
.admin-metrics, .admin-insights { display: grid; gap: 1rem; }
.admin-metrics {
  --admin-metric-columns: 2;
  container-type: inline-size;
  grid-template-columns: repeat(var(--admin-metric-columns), minmax(0, 1fr));
}
.admin-insights { grid-template-columns: minmax(0, 1fr); }
.admin-metric {
  --admin-metric-width: calc((100cqw + 1rem) / var(--admin-metric-columns) - 1rem);
  --admin-metric-icon-size: clamp(1.75rem, calc(var(--admin-metric-width) - 6.75rem), 5.25rem);
  position: relative;
  padding-inline-start: calc(var(--admin-metric-icon-size) + .5rem);
  text-align: end;
}
.admin-metric :deep(.ui-card-header), .admin-chart :deep(.ui-card-header),
.admin-operations :deep(.ui-card-header), .admin-requests :deep(.ui-card-header) { padding-bottom: 0; }
.admin-requests :deep(.ui-data-table-toolbar) { margin-bottom: .5rem; }
.admin-requests :deep(.ui-data-table-pagination) { display: contents; }
.admin-requests :deep(.ui-data-table-page-size-field) { order: -1; }
.admin-requests :deep(.ui-data-table-page-navigation) { margin-inline-start: auto; }
.admin-metric :deep(.ui-card-header), .admin-metric :deep(.ui-card-body) { padding-inline: .75rem; }
.admin-metric :deep(.ui-card-body) { padding-top: .5rem; }
.admin-metric-value { display: flex; align-items: baseline; justify-content: end; gap: .25rem; color: var(--ui-foreground); }
.admin-metric-value strong { font-size: 1.875rem; line-height: 1.15; font-variant-numeric: tabular-nums; }
.admin-metric-icon {
  display: grid;
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: .75rem;
  transform: translateY(-50%);
  place-items: center;
  width: var(--admin-metric-icon-size);
  height: var(--admin-metric-icon-size);
  border-radius: .375rem;
  background: transparent;
  color: var(--ui-primary);
  font-size: calc(var(--admin-metric-icon-size) / 1.75);
}
[data-ui-color-mode="dark"] .admin-metric-icon { color: var(--ui-muted-foreground); }
.admin-metric-icon[data-icon="inbox"]::before {
  content: '';
  width: .875em;
  height: .6875em;
  border: .09375em solid currentColor;
  border-radius: .1875em;
  background: linear-gradient(currentColor 0 0) center 55% / 50% .09375em no-repeat;
}
.admin-metric-icon[data-icon="check"]::before {
  content: '';
  width: .75em;
  height: .4375em;
  border-block-end: .125em solid currentColor;
  border-inline-start: .125em solid currentColor;
  transform: translateY(-.0625em) rotate(-45deg);
}
.admin-metric-icon[data-icon="percent"]::before { content: '%'; font-size: .875em; font-weight: 600; line-height: 1; }
.admin-metric-icon[data-icon="clock"]::before {
  content: '';
  width: .875em;
  height: .875em;
  border: .09375em solid currentColor;
  border-radius: 50%;
}
.admin-metric-icon[data-icon="clock"]::after {
  content: '';
  position: absolute;
  inset: .5625em auto auto .8125em;
  width: .3125em;
  height: .375em;
  border-block-end: .09375em solid currentColor;
  border-inline-start: .09375em solid currentColor;
}
.admin-legend { display: inline-flex; align-items: center; gap: .375rem; }
.admin-legend i { width: .75rem; height: .75rem; border-radius: .125rem; }
.admin-intake { background: var(--admin-bar-intake); border: 1px solid var(--ui-muted-foreground); }
.admin-completed { background: var(--admin-bar-completed); }
.admin-line-key { width: 1.25rem; border-top: 2px solid var(--ui-chart-1); }
.admin-line-completed { border-top: 2px dashed var(--ui-chart-2); }
.admin-row-link { height: auto; min-height: 2rem; padding: 0; text-align: start; text-decoration: underline; white-space: normal; }
.admin-footer { border-top: 0; background: transparent; }
.admin-footer :deep(.ui-footer-navigation > a:not(:hover)) { color: var(--ui-muted-foreground); }
[data-ui-color-mode="dark"] .admin-row-link,
[data-ui-color-mode="dark"] .admin-skip-link:focus,
[data-ui-color-mode="dark"] .admin-dashboard :deep(.ui-footer-navigation > a:hover) {
  color: var(--admin-link-color, var(--ui-info-foreground));
}
@media (min-width: 48rem) {
  .admin-metrics { --admin-metric-columns: 4; }
  .admin-insights { grid-template-columns: minmax(0, 1.8fr) minmax(17rem, 1fr); }
}
@media (min-width: 64rem) {
  .admin-shell { grid-template-columns: 18rem minmax(0, 1fr); }
  .admin-sidebar {
    --admin-sidebar-background: #f2f2f4;
    --ui-accent: color-mix(in srgb, var(--admin-sidebar-background) 92%, var(--ui-foreground));
    --ui-selected-background: #fff;
    --ui-selected-foreground: var(--ui-primary);
    display: block;
    padding: 1.5rem .75rem;
    border-inline-end: 1px solid var(--ui-border);
    background: var(--admin-sidebar-background);
  }
  [data-ui-color-mode="dark"] .admin-sidebar {
    --admin-sidebar-background: #2b2b2e;
    --ui-accent: color-mix(in srgb, var(--admin-sidebar-background) 75%, black);
    --ui-selected-background: #d4d4d8;
    --ui-selected-foreground: #1f2328;
  }
  .admin-sidebar :deep(.ui-navigation-row[data-active="false"][data-disabled="false"] .ui-navigation-label) {
    color: var(--ui-muted-foreground);
  }
  .admin-sidebar :deep(.ui-navigation-row[data-active="true"]) {
    --ui-accent: color-mix(in srgb, var(--ui-selected-background) 92%, var(--ui-selected-foreground));
  }
  .admin-dashboard :deep(.ui-topbar-leading) { display: none; }
}
@media (forced-colors: active) {
  .admin-dashboard { --admin-bar-intake: Canvas; --admin-bar-completed: CanvasText; }
  .admin-intake { forced-color-adjust: none; background: Canvas; border-color: CanvasText; }
  .admin-completed { forced-color-adjust: none; background: CanvasText; }
}
</style>
