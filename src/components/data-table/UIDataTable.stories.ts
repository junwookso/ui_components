import { h, ref, type DefineComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDataTable from './UIDataTable.vue'
import UIButton from '../button/UIButton.vue'
import UIChip from '../chip/UIChip.vue'
import type { UIDataTableColumn, UIDataTableRowSelection, UIDataTableProps } from './types'

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
