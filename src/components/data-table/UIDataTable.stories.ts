import { h, nextTick, onUnmounted, ref, watch, type DefineComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDataTable from './UIDataTable.vue'
import UIButton from '../button/UIButton.vue'
import UIChip from '../chip/UIChip.vue'
import type { UIDataTableColumn, UIDataTablePagination, UIDataTableRowSelection, UIDataTableSorting, UIDataTableProps } from './types'

interface Employee { id: string; name: string; team: string; email: string; projects: number; status: string }
const names = ['김민수', '이서연', '박지훈', '최유진', '정도현', '강하은', '조현우', '윤수빈', '장지우', '임준서', '한예린', '오시우']
const data: Employee[] = names.map((name, index) => ({
  id: `employee-${index + 1}`, name,
  team: ['플랫폼팀', '디자인팀', '서비스개발팀'][index % 3]!,
  email: `member${index + 1}@company.example`, projects: (index * 3) % 11,
  status: index === 3 ? '휴직' : '재직',
}))
const columns: UIDataTableColumn<Employee>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'team', header: '소속' },
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'projects', header: '프로젝트 수', meta: { align: 'end' } },
  { accessorKey: 'status', header: '상태', enableSorting: false },
]
// Storybook metadata needs a concrete props type for a generic Vue SFC.
const EmployeeTable = UIDataTable as unknown as DefineComponent<UIDataTableProps<Employee>>
const meta = {
  title: 'Components/UIDataTable',
  component: EmployeeTable,
  parameters: { layout: 'fullscreen' },
  args: {
    label: '직원 목록', data, columns, getRowId: (row: Employee) => row.id,
    getRowLabel: (row: Employee) => row.name, searchable: true, selectable: true,
    canSelectRow: (row: Employee) => row.status !== '휴직',
  },
  render: args => ({
    components: { UIDataTable: EmployeeTable, UIButton, UIChip },
    setup: () => ({ args, selected: ref<UIDataTableRowSelection>({}), message: ref('') }),
    template: `<div style="max-width: 70rem; margin: auto"><p class="ui-body ui-text-muted" style="margin-bottom: 1rem">직원을 검색하고 선택하세요. 휴직자는 선택할 수 없습니다. 전체 선택은 현재 페이지에만 적용됩니다.</p><UIDataTable v-bind="args" v-model:row-selection="selected" @retry="message = '다시 시도 요청을 받았습니다.'"><template #toolbar="{ selectedRows, clearSelection }"><UIButton v-if="selectedRows.length" size="sm" variant="ghost" @click="clearSelection">선택 해제</UIButton><UIButton size="sm" variant="outline" :disabled="!selectedRows.length || args.loading || !!args.error" @click="message = selectedRows.map(row => row.name).join(', ') + ' 선택됨'">선택 직원 확인</UIButton></template><template #cell-status="{ row }"><UIChip :label="row.status" size="sm" :variant="row.status === '휴직' ? 'default' : 'success'" /></template></UIDataTable><p class="ui-body" role="status" style="margin-top: 1rem">{{ message }}</p></div>`,
  }),
} satisfies Meta<UIDataTableProps<Employee>>
export default meta
type Story = StoryObj<typeof meta>
export const Employees: Story = {}
export const Basic: Story = { args: { searchable: false, selectable: false, paginated: false, data: data.slice(0, 5) } }
export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { data: [] } }
export const NoResults: Story = { args: { globalFilter: '일치하지 않는 검색어' } }
export const Error: Story = { args: { error: '직원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' } }
export const CustomCells: Story = {
  args: { columns: [...columns, { id: 'actions', header: '작업', enableSorting: false, cell: ({ row }) => h(UIButton, { size: 'sm', variant: 'outline', onClick: () => window.alert(`${row.original.name} 상세 보기 예제`) }, () => '상세 보기') }] },
}

interface EmployeeQuery extends UIDataTablePagination {
  keyword: string
  sorting: UIDataTableSorting[number] | undefined
}

interface EmployeePage {
  rows: Employee[]
  totalRows: number
}

const sortableFields = ['name', 'team', 'email', 'projects'] as const
const collator = new Intl.Collator('ko', { numeric: true })

function fetchEmployeePage(query: EmployeeQuery, shouldFail: boolean): Promise<EmployeePage> {
  const delay = query.keyword === '플랫폼' ? 900 : 250
  return new Promise((resolve, reject) => setTimeout(() => {
    if (shouldFail) {
      reject(new globalThis.Error('직원 목록을 불러오지 못했습니다. 다시 시도해 주세요.'))
      return
    }
    const matching = data.filter(employee =>
      [employee.name, employee.team, employee.email].some(text => text.toLowerCase().includes(query.keyword)),
    )
    const sortKey = sortableFields.find(key => key === query.sorting?.id)
    if (sortKey) {
      const direction = query.sorting?.desc ? -1 : 1
      matching.sort((left, right) => direction * collator.compare(String(left[sortKey]), String(right[sortKey])))
    }
    const offset = query.pageIndex * query.pageSize
    resolve({ rows: matching.slice(offset, offset + query.pageSize), totalRows: matching.length })
  }, delay))
}

export const Server: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '모의 API가 현재 페이지의 행과 전체 건수를 반환합니다. 버튼으로 응답 순서 역전과 일시적인 실패를 재현할 수 있습니다.' } },
  },
  render: () => ({
    components: { UIDataTable: EmployeeTable, UIButton, UIChip },
    setup: () => {
      const page = ref<EmployeePage>({ rows: [], totalRows: 0 })
      const pagination = ref<UIDataTablePagination>({ pageIndex: 0, pageSize: 5 })
      const sorting = ref<UIDataTableSorting>([])
      const search = ref('')
      const selection = ref<UIDataTableRowSelection>({})
      const tableArea = ref<HTMLElement | null>(null)
      const loading = ref(false)
      const error = ref('')
      let requestId = 0
      let raceTimer: ReturnType<typeof setTimeout> | undefined

      async function load(shouldFail = false) {
        const id = ++requestId
        loading.value = true
        error.value = ''
        const query = {
          ...pagination.value,
          keyword: search.value.trim().toLowerCase(),
          sorting: sorting.value[0],
        }
        try {
          const result = await fetchEmployeePage(query, shouldFail)
          if (id === requestId) page.value = result
        } catch (cause) {
          if (id === requestId) error.value = cause instanceof globalThis.Error ? cause.message : '목록을 불러오지 못했습니다.'
        } finally {
          if (id === requestId) loading.value = false
        }
      }

      async function retry() {
        void load()
        await nextTick()
        tableArea.value?.querySelector<HTMLElement>('[role="region"]')?.focus()
      }

      function simulateOutOfOrder() {
        clearTimeout(raceTimer)
        const first = search.value === '플랫폼' ? ' 플랫폼' : '플랫폼'
        search.value = first
        raceTimer = setTimeout(() => {
          if (search.value === first) search.value = '이서연'
        }, 100)
      }

      watch([pagination, sorting, search], () => { void load() }, { immediate: true, flush: 'post' })
      onUnmounted(() => {
        requestId++
        clearTimeout(raceTimer)
      })

      return { page, pagination, sorting, search, selection, tableArea, loading, error, load, retry, simulateOutOfOrder, columns, getRowId: (row: Employee) => row.id }
    },
    template: `
      <main class="mx-auto grid w-full min-w-0 max-w-5xl gap-4 px-4 py-6 sm:px-6">
        <header class="grid gap-1">
          <h1 class="ui-h1">직원 목록 서버 조회</h1>
          <p class="ui-subtitle ui-text-muted">응답 순서 체험은 플랫폼팀을 먼저 검색한 뒤 이서연의 결과를 먼저 받습니다.</p>
        </header>
        <div class="flex flex-wrap justify-end gap-2">
          <UIButton variant="outline" size="sm" :disabled="loading" @click="simulateOutOfOrder">응답 순서 체험</UIButton>
          <UIButton variant="outline" size="sm" :disabled="loading" @click="load(true)">조회 실패 체험</UIButton>
        </div>
        <div ref="tableArea" class="min-w-0">
          <UIDataTable mode="server" label="서버 직원 목록" searchable selectable
            :data="page.rows" :total-rows="page.totalRows" :columns="columns" :get-row-id="getRowId"
            :get-row-label="row => row.name"
            v-model:pagination="pagination" v-model:sorting="sorting" v-model:global-filter="search"
            v-model:row-selection="selection" :loading="loading" :error="error" @retry="retry">
            <template #cell-status="{ row }">
              <UIChip :label="row.status" size="sm" :variant="row.status === '휴직' ? 'default' : 'success'" />
            </template>
          </UIDataTable>
        </div>
      </main>
    `,
  }),
}
