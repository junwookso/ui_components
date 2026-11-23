import { computed, ref, useId } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIBreadcrumb from '../components/breadcrumb/UIBreadcrumb.vue'
import type { UIBreadcrumbItem } from '../components/breadcrumb/types'
import UIButton from '../components/button/UIButton.vue'
import { buttonVariants } from '../components/button/variants'
import UIChip from '../components/chip/UIChip.vue'
import UIDescriptions from '../components/descriptions/UIDescriptions.vue'
import type { UIDescriptionItem } from '../components/descriptions/types'
import UIList from '../components/list/UIList.vue'
import type { UIListItem } from '../components/list/types'

const details: UIDescriptionItem[] = [
  { key: 'number', label: '요청 번호', value: 'REQ-1048' },
  { key: 'requester', label: '요청 부서', value: '운영지원팀' },
  { key: 'assignee', label: '담당 팀', value: '플랫폼팀' },
  { key: 'date', label: '접수일', value: '2026-11-20' },
  { key: 'description', label: '요청 내용', value: '운영지원팀이 포털에서 접수 내역을 확인할 수 있도록 열람 권한을 추가해 주세요.' },
]

const attachments: UIListItem[] = [
  { key: 'review', title: '업무 포털 접근 권한 검토서.pdf', description: '운영지원팀 제출 · 2026-11-20' },
  { key: 'roles', title: '열람 권한 대상 목록.xlsx', description: '운영지원팀 제출 · 2026-11-20' },
]

const initialHistory: UIListItem[] = [
  { key: 'assigned', title: '플랫폼팀에 배정', description: '2026-11-20 10:15 · 운영지원팀' },
  { key: 'received', title: '요청 접수', description: '2026-11-20 09:40 · 운영지원팀' },
]

const breadcrumbs: UIBreadcrumbItem[] = [
  { key: 'requests', label: '업무 요청 목록', href: './?path=/story/patterns-list-search--requests', target: '_top' },
  { key: 'request', label: 'REQ-1048 상세' },
]

const meta = {
  title: 'Patterns/Request Detail',
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    controls: { disable: true },
    docs: { description: { component: '업무 요청의 현재 위치, 처리 상태, 기본 정보와 관련 문서·처리 이력을 배치한 예제입니다.' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Request: Story = {
  render: () => ({
    components: { UIBreadcrumb, UIButton, UIChip, UIDescriptions, UIList },
    setup: () => {
      const approved = ref(false)
      const history = computed(() => approved.value
        ? [{ key: 'approved', title: '요청 승인', description: '플랫폼팀 검토자가 요청을 승인했습니다.' }, ...initialHistory]
        : initialHistory)
      const historyId = `request-history-${useId()}`
      const secondaryAction = buttonVariants({ variant: 'outline' })
      return { approved, attachments, breadcrumbs, details, history, historyId, secondaryAction }
    },
    template: `
      <main class="@container mx-auto flex min-h-dvh w-full max-w-5xl min-w-0 flex-col gap-6 px-4 py-6 sm:px-6">
        <div class="grid min-w-0 gap-4">
          <UIBreadcrumb :items="breadcrumbs" />
          <header class="flex flex-col gap-4 @min-[42rem]:flex-row @min-[42rem]:items-start @min-[42rem]:justify-between">
            <div class="flex min-w-0 flex-col gap-1">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 class="ui-h1 min-w-0 [overflow-wrap:anywhere]">업무 포털 접근 권한 추가</h1>
                <span role="status" class="inline-flex">
                  <UIChip :label="approved ? '승인 완료' : '검토 대기'" :variant="approved ? 'success' : 'warning'" />
                </span>
              </div>
              <p class="ui-subtitle ui-text-muted">운영지원팀의 업무 포털 열람 권한을 검토합니다.</p>
            </div>
            <div class="flex flex-wrap justify-end gap-2 @min-[42rem]:shrink-0">
              <a :href="'#' + historyId" :class="secondaryAction">처리 이력 보기</a>
              <UIButton :disabled="approved" @click="approved = true">승인하기</UIButton>
            </div>
          </header>
        </div>

        <UIDescriptions label="기본 정보" :items="details">
          <template #value-date="{ value }"><time :datetime="String(value)">{{ value }}</time></template>
        </UIDescriptions>

        <div class="grid min-w-0 items-start gap-6 @min-[42rem]:grid-cols-2">
          <UIList label="관련 문서" :items="attachments" />
          <UIList :id="historyId" tabindex="-1" label="처리 이력" :items="history" />
        </div>
      </main>
    `,
  }),
}
