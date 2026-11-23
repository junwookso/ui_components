import { computed, nextTick, onMounted, onUnmounted, ref, type DefineComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIAlert from '../components/alert/UIAlert.vue'
import UIButton from '../components/button/UIButton.vue'
import { buttonVariants } from '../components/button/variants'
import UIDataTable from '../components/data-table/UIDataTable.vue'
import type { UIDataTableColumn, UIDataTableProps } from '../components/data-table/types'

type ScreenState = 'empty' | 'no-results' | 'loading' | 'failure' | 'forbidden' | 'not-found'

interface RequestRow {
  id: string
  title: string
  team: string
}

const rows: RequestRow[] = [
  { id: 'REQ-1048', title: '업무 포털 접근 권한 추가', team: '운영지원팀' },
  { id: 'REQ-1047', title: '거래처 정보 수정', team: '재무팀' },
]
const columns: UIDataTableColumn<RequestRow>[] = [
  { accessorKey: 'id', header: '요청 번호' },
  { accessorKey: 'title', header: '제목' },
  { accessorKey: 'team', header: '요청 부서' },
]
const getRowId = (row: RequestRow) => row.id
const RequestTable = UIDataTable as unknown as DefineComponent<UIDataTableProps<RequestRow>>
const listUrl = './?path=/story/patterns-list-search--requests'
const createUrl = './?path=/story/patterns-create-and-edit-form--create-request'

const meta = {
  title: 'Patterns/Screen States',
  args: { state: 'empty' },
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    controls: { disable: true },
    docs: { description: { component: '업무 화면에서 데이터 상태와 페이지 접근 상태를 구분하고 다음 동작을 안내하는 예제입니다.' } },
  },
  render: args => ({
    components: { UIAlert, UIButton, UIDataTable: RequestTable },
    setup: () => {
      const state = ref<ScreenState | 'ready'>(args.state)
      const tableArea = ref<HTMLElement | null>(null)
      const filter = ref(args.state === 'no-results' ? 'REQ-0000' : '')
      const requested = ref(false)
      const data = computed(() => state.value === 'empty' ? [] : rows)
      const loading = computed(() => state.value === 'loading')
      let timer: ReturnType<typeof setTimeout> | undefined

      function load() {
        if (timer !== undefined) return
        state.value = 'loading'
        timer = setTimeout(() => {
          timer = undefined
          state.value = 'ready'
        }, 2400)
      }

      async function reload() {
        load()
        await nextTick()
        tableArea.value?.querySelector<HTMLElement>('[role="region"]')?.focus()
      }

      onMounted(() => { if (loading.value) load() })
      onUnmounted(() => clearTimeout(timer))
      return {
        args, state, tableArea, filter, requested, data, loading, reload,
        columns, getRowId, listUrl, createUrl,
        primaryLink: buttonVariants(),
        secondaryLink: buttonVariants({ variant: 'outline' }),
      }
    },
    template: `
      <main class="@container mx-auto flex min-h-dvh w-full max-w-5xl min-w-0 flex-col gap-6 px-4 py-6 sm:px-6">
        <template v-if="state === 'forbidden' || state === 'not-found'">
          <h1 class="ui-h1">업무 요청 상세</h1>
          <UIAlert v-if="state === 'forbidden'" class="max-w-2xl" :type="requested ? 'success' : 'warning'"
            announce="polite"
            :title="requested ? '접근 권한 요청 완료' : '접근 권한이 필요합니다'"
            :message="requested ? '관리자가 승인하면 이 요청을 열 수 있습니다.' : '이 업무 요청을 열려면 문서 소유자에게 접근 권한을 요청해 주세요.'">
            <template #actions>
              <a :href="listUrl" target="_top" :class="secondaryLink">목록으로 돌아가기</a>
              <UIButton :disabled="requested" @click="requested = true">권한 요청</UIButton>
            </template>
          </UIAlert>
          <UIAlert v-else class="max-w-2xl" title="페이지를 찾을 수 없습니다"
            message="주소가 바뀌었거나 요청이 삭제되었을 수 있습니다. 목록에서 요청을 다시 찾아보세요.">
            <template #actions><a :href="listUrl" target="_top" :class="primaryLink">목록으로 돌아가기</a></template>
          </UIAlert>
        </template>

        <template v-else>
          <header class="flex flex-col gap-4 @min-[42rem]:flex-row @min-[42rem]:items-start @min-[42rem]:justify-between">
            <div class="grid gap-1">
              <h1 class="ui-h1">업무 요청 목록</h1>
              <p class="ui-subtitle ui-text-muted">접수된 요청과 담당 부서를 확인합니다.</p>
            </div>
            <div v-if="state === 'empty' || args.state === 'loading'" class="flex flex-wrap justify-end gap-2">
              <a v-if="state === 'empty'" :href="createUrl" target="_top" :class="primaryLink">업무 요청 등록</a>
              <UIButton v-else variant="outline" :disabled="loading" @click="reload">다시 불러오기</UIButton>
            </div>
          </header>

          <div ref="tableArea" class="min-w-0">
            <UIDataTable v-model:global-filter="filter" :data="data" :columns="columns" :get-row-id="getRowId"
              label="업무 요청" :searchable="args.state === 'no-results'" :paginated="false" :loading="loading"
              :error="state === 'failure' ? '업무 요청을 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.' : undefined"
              empty-text="아직 등록된 업무 요청이 없습니다." @retry="reload">
              <template v-if="args.state === 'no-results'" #toolbar>
                <UIButton variant="outline" size="sm" @click="filter = ''">검색 초기화</UIButton>
              </template>
            </UIDataTable>
          </div>
        </template>
      </main>
    `,
  }),
} satisfies Meta<{ state: ScreenState }>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const NoResults: Story = { args: { state: 'no-results' } }
export const Loading: Story = { args: { state: 'loading' } }
export const Failure: Story = { args: { state: 'failure' } }
export const Forbidden: Story = { args: { state: 'forbidden' } }
export const NotFound: Story = { args: { state: 'not-found' } }
