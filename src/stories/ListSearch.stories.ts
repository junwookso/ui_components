import { computed, ref, type DefineComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../components/button/UIButton.vue'
import UIChip from '../components/chip/UIChip.vue'
import UIDataTable from '../components/data-table/UIDataTable.vue'
import type { UIDataTableColumn, UIDataTableProps } from '../components/data-table/types'
import UIFormField from '../components/form-field/UIFormField.vue'
import UIInput from '../components/input/UIInput.vue'
import UISelect from '../components/select/UISelect.vue'

const statuses = {
  pending: { label: '검토 대기', variant: 'warning' },
  approved: { label: '승인 완료', variant: 'success' },
  returned: { label: '보완 요청', variant: 'info' },
} as const

interface RequestRow {
  id: string
  title: string
  status: keyof typeof statuses
  submittedAt: string
}

const requests: RequestRow[] = [
  { id: 'REQ-1048', title: '업무 포털 접근 권한 추가', status: 'pending', submittedAt: '2026-11-20' },
  { id: 'REQ-1047', title: '거래처 정보 수정', status: 'pending', submittedAt: '2026-11-20' },
  { id: 'REQ-1046', title: '공용 문서함 권한 변경', status: 'approved', submittedAt: '2026-11-19' },
  { id: 'REQ-1045', title: '교육 신청서 보완', status: 'returned', submittedAt: '2026-11-18' },
  { id: 'REQ-1044', title: '검토 담당자 변경', status: 'approved', submittedAt: '2026-11-18' },
  { id: 'REQ-1043', title: '장비 대여 신청', status: 'pending', submittedAt: '2026-11-17' },
  { id: 'REQ-1042', title: '업무 포털 권한 회수', status: 'approved', submittedAt: '2026-11-16' },
  { id: 'REQ-1041', title: '외부 회의비 정산', status: 'returned', submittedAt: '2026-11-16' },
]

const statusOptions = Object.entries(statuses).map(([value, { label }]) => ({ value, label }))
const columns: UIDataTableColumn<RequestRow>[] = [
  { accessorKey: 'id', header: '요청 번호' },
  { accessorKey: 'title', header: '제목' },
  { id: 'status', accessorFn: row => statuses[row.status].label, header: '처리 상태' },
  { accessorKey: 'submittedAt', header: '접수일' },
]
const getRowId = (row: RequestRow) => row.id
const emptyConditions = { keyword: '', status: '' }
const RequestTable = UIDataTable as unknown as DefineComponent<UIDataTableProps<RequestRow>>

const meta = {
  title: 'Patterns/List Search',
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    controls: { disable: true },
    docs: { description: { component: '업무 요청 목록에서 검색 조건을 적용하고 결과 수와 테이블을 확인하는 조합 예제입니다.' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Requests: Story = {
  render: () => ({
    components: { UIButton, UIChip, UIDataTable: RequestTable, UIFormField, UIInput, UISelect },
    setup: () => {
      const draft = ref({ ...emptyConditions })
      const applied = ref({ ...emptyConditions })
      const pagination = ref({ pageIndex: 0, pageSize: 5 })
      const hasConditions = computed(() => Boolean(applied.value.keyword || applied.value.status))
      const filtered = computed(() => {
        const { keyword, status } = applied.value
        return requests.filter(row =>
          (!status || row.status === status) &&
          (row.id.toLowerCase().includes(keyword) || row.title.toLowerCase().includes(keyword)),
        )
      })

      function apply() {
        applied.value = { keyword: draft.value.keyword.trim().toLowerCase(), status: draft.value.status }
        pagination.value = { ...pagination.value, pageIndex: 0 }
      }

      function reset() {
        draft.value = { ...emptyConditions }
        apply()
      }

      return { draft, pagination, hasConditions, filtered, apply, reset, statuses, statusOptions, columns, getRowId }
    },
    template: `
      <main class="@container mx-auto flex min-h-dvh w-full max-w-5xl min-w-0 flex-col gap-6 px-4 py-6 sm:px-6">
        <header class="grid gap-1">
          <h1 class="ui-h1">업무 요청 목록</h1>
          <p class="ui-subtitle ui-text-muted">접수된 요청과 처리 상태를 확인합니다.</p>
        </header>

        <section class="min-w-0 rounded-md border border-border bg-surface p-4" aria-label="검색 조건">
          <form class="grid gap-4" @submit.prevent="apply" @reset.prevent="reset">
            <h2 class="ui-h2">검색 조건</h2>
            <div class="grid gap-4 @min-[36rem]:grid-cols-2">
              <UIFormField v-slot="{ controlAttrs }" label="요청 번호 또는 제목">
                <UIInput v-bind="controlAttrs" v-model="draft.keyword" type="search" />
              </UIFormField>
              <UIFormField v-slot="{ controlAttrs }" label="처리 상태">
                <UISelect v-bind="controlAttrs" v-model="draft.status" :options="statusOptions" placeholder="전체 상태" />
              </UIFormField>
            </div>
            <div class="flex flex-wrap justify-end gap-2">
              <UIButton type="reset" variant="outline">초기화</UIButton>
              <UIButton type="submit">검색 적용</UIButton>
            </div>
          </form>
        </section>

        <section class="grid min-w-0 gap-3" aria-label="검색 결과">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 class="ui-h2">검색 결과</h2>
            <p class="ui-body ui-text-muted">{{ filtered.length }}건</p>
          </div>
          <UIDataTable v-model:pagination="pagination" :data="filtered" :columns="columns" :get-row-id="getRowId"
            label="업무 요청"
            :empty-text="hasConditions ? '조건에 맞는 요청이 없습니다. 검색 조건을 바꾸거나 초기화해 주세요.' : '접수된 요청이 없습니다.'">
            <template #cell-status="{ row }">
              <UIChip :label="statuses[row.status].label" :variant="statuses[row.status].variant" />
            </template>
          </UIDataTable>
        </section>
      </main>
    `,
  }),
}
