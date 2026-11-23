<script setup lang="ts" generic="TData extends object">
import { computed, nextTick, useId, watch } from 'vue'
import {
  FlexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable,
  type Cell, type Column, type Row, type PaginationState, type RowSelectionState, type SortingState, type Updater,
} from '@tanstack/vue-table'
import UIButton from '../button/UIButton.vue'
import UIInput from '../input/UIInput.vue'
import { cn } from '../../lib/cn'
import type { UIDataTableProps } from './types'

const props = withDefaults(defineProps<UIDataTableProps<TData>>(), {
  selectable: false, searchable: false, paginated: true, loading: false, mode: 'client',
  emptyText: '등록된 데이터가 없습니다.',
})
const emit = defineEmits<{ retry: [] }>()
const sorting = defineModel<SortingState>('sorting', { default: () => [] })
const pagination = defineModel<PaginationState>('pagination', { default: () => ({ pageIndex: 0, pageSize: 10 }) })
const rowSelection = defineModel<RowSelectionState>('rowSelection', { default: () => ({}) })
const globalFilter = defineModel<string>('globalFilter', { default: '' })
defineSlots<{
  toolbar?: (props: { selectedRows: TData[]; clearSelection: () => void }) => unknown
  cell?: (props: { row: TData; cell: Cell<TData, unknown>; value: unknown }) => unknown
  [name: `cell-${string}`]: (props: { row: TData; cell: Cell<TData, unknown>; value: unknown }) => unknown
}>()
const id = useId()
const blocked = computed(() => props.loading || !!props.error)
const server = computed(() => props.mode === 'server')
const serverTotal = computed(() => {
  const count = props.totalRows
  if (!props.paginated || count === undefined || !Number.isFinite(count)) return props.data.length
  return Math.max(0, Math.floor(count))
})
const table = useVueTable<TData>({
  get data() { return props.data },
  get columns() { return props.columns },
  getRowId: row => props.getRowId(row),
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  get manualPagination() { return server.value || !props.paginated },
  get manualSorting() { return server.value },
  get manualFiltering() { return server.value },
  get rowCount() { return server.value && props.paginated ? serverTotal.value : undefined },
  autoResetPageIndex: false,
  enableMultiSort: false,
  sortDescFirst: false,
  globalFilterFn: 'includesString',
  enableRowSelection: row => props.selectable && (props.canSelectRow?.(row.original) ?? true),
  state: {
    get sorting() { return sorting.value },
    get pagination() { return safePagination.value },
    get rowSelection() { return rowSelection.value },
    get globalFilter() { return globalFilter.value },
  },
  onSortingChange: updater => { sorting.value = resolve(updater, sorting.value) },
  onPaginationChange: updater => { pagination.value = resolve(updater, safePagination.value) },
  onRowSelectionChange: updater => { rowSelection.value = resolve(updater, rowSelection.value) },
})
function resolve<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(previous) : updater
}
const total = computed(() => server.value ? serverTotal.value : table.getFilteredRowModel().rows.length)
const safePagination = computed(() => {
  const pageSize = Number.isFinite(pagination.value.pageSize) ? Math.max(1, Math.floor(pagination.value.pageSize)) : 10
  const pageIndex = Number.isFinite(pagination.value.pageIndex) ? Math.max(0, Math.floor(pagination.value.pageIndex)) : 0
  const keepServerPage = server.value && (blocked.value || !props.paginated)
  const last = Math.max(0, Math.ceil(total.value / pageSize) - 1)
  return { pageSize, pageIndex: keepServerPage ? pageIndex : Math.min(last, pageIndex) }
})
watch([globalFilter, sorting], () => {
  if (pagination.value.pageIndex !== 0) pagination.value = { ...safePagination.value, pageIndex: 0 }
}, { deep: true })
watch(safePagination, value => {
  if (value.pageIndex !== pagination.value.pageIndex || value.pageSize !== pagination.value.pageSize) pagination.value = value
}, { immediate: true })
const rows = computed(() => table.getRowModel().rows)
const selectedRows = computed(() => {
  if (server.value && blocked.value) return []
  return table.getSelectedRowModel().rows.filter(row => row.getCanSelect()).map(row => row.original)
})
const selectablePageRows = computed(() => rows.value.filter(row => row.getCanSelect()))
const allPageSelected = computed(() => selectablePageRows.value.length > 0 && selectablePageRows.value.every(row => row.getIsSelected()))
const somePageSelected = computed(() => !allPageSelected.value && selectablePageRows.value.some(row => row.getIsSelected()))
const pageSizes = computed(() => [...new Set([10, 20, 50, safePagination.value.pageSize])].sort((a, b) => a - b))
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / safePagination.value.pageSize)))
const start = computed(() => total.value && rows.value.length ? (props.paginated ? safePagination.value.pageIndex * safePagination.value.pageSize : 0) + 1 : 0)
const end = computed(() => start.value ? Math.min(total.value, start.value + rows.value.length - 1) : 0)
const columnCount = computed(() => Math.max(1, table.getVisibleLeafColumns().length + Number(props.selectable)))
async function selectRow(event: Event, row?: Row<TData>) {
  const input = event.target as HTMLInputElement
  if (row) row.toggleSelected(input.checked)
  else table.toggleAllPageRowsSelected(input.checked)
  await nextTick()
  // A controlled parent may reject the update; restore the native input too.
  input.checked = row ? row.getCanSelect() && row.getIsSelected() : allPageSelected.value
  if (!row) input.indeterminate = somePageSelected.value
}
function clearSelection() { rowSelection.value = {} }
function sortLabel(column: Column<TData, unknown>) {
  const label = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
  const next = column.getNextSortingOrder()
  return `${label}: ${next === 'asc' ? '오름차순 정렬' : next === 'desc' ? '내림차순 정렬' : '정렬 해제'}`
}
function pageSizeChanged(event: Event) {
  pagination.value = { pageIndex: 0, pageSize: Number((event.target as HTMLSelectElement).value) }
}
</script>

<template>
  <div :class="cn('ui-data-table', $props.class)">
    <div v-if="searchable || $slots.toolbar" class="ui-data-table-toolbar flex flex-wrap items-end gap-3">
      <div v-if="searchable" class="ui-data-table-search">
        <label :for="`${id}-search`" class="ui-label">검색</label>
        <UIInput :id="`${id}-search`" v-model="globalFilter" type="search" size="sm" :disabled="loading && !server" :aria-label="`${label} 검색`" placeholder="검색어를 입력하세요" />
      </div>
      <div v-if="$slots.toolbar" class="ui-data-table-actions flex flex-wrap items-center gap-2">
        <slot name="toolbar" :selected-rows="selectedRows" :clear-selection="clearSelection" />
      </div>
    </div>
    <div class="ui-data-table-scroll" role="region" :aria-label="`${label} 표 영역`" tabindex="0">
      <table class="ui-data-table-native" :aria-busy="loading">
        <caption>{{ label }}</caption>
        <thead>
          <tr v-for="(group, groupIndex) in table.getHeaderGroups()" :key="group.id">
            <th v-if="selectable && groupIndex === 0" scope="col" :rowspan="table.getHeaderGroups().length" class="ui-data-table-check-cell">
              <input type="checkbox" class="ui-data-table-checkbox" aria-label="현재 페이지 전체 선택" :checked="allPageSelected" :indeterminate="somePageSelected" :disabled="blocked || !selectablePageRows.length" @change="selectRow($event)" />
            </th>
            <th v-for="header in group.headers" :key="header.id" :colspan="header.colSpan" :scope="header.subHeaders.length ? 'colgroup' : 'col'" :data-align="header.column.columnDef.meta?.align" :aria-sort="!header.isPlaceholder && header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? 'ascending' : 'descending') : undefined">
              <template v-if="!header.isPlaceholder">
                <button v-if="header.column.getCanSort()" type="button" class="ui-data-table-sort" :disabled="blocked" :aria-label="sortLabel(header.column)" @click="header.column.toggleSorting()">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <span aria-hidden="true" class="ui-data-table-sort-indicator">{{ header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕' }}</span>
                </button>
                <FlexRender v-else :render="header.column.columnDef.header" :props="header.getContext()" />
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading || error || !rows.length">
            <td :colspan="columnCount" class="ui-data-table-state">
              <span v-if="loading">데이터를 불러오는 중입니다.</span>
              <div v-else-if="error" class="ui-data-table-error">
                <p>{{ error }}</p><UIButton variant="outline" size="sm" @click="emit('retry')">다시 시도</UIButton>
              </div>
              <span v-else>{{ globalFilter ? '검색 결과가 없습니다. 검색어를 변경해 주세요.' : emptyText }}</span>
            </td>
          </tr>
          <tr v-for="row in (blocked ? [] : rows)" :key="row.id" :data-selected="row.getCanSelect() && row.getIsSelected()">
            <td v-if="selectable" class="ui-data-table-check-cell">
              <input type="checkbox" class="ui-data-table-checkbox" :aria-label="`${getRowLabel?.(row.original) ?? row.id} 선택`" :checked="row.getCanSelect() && row.getIsSelected()" :disabled="!row.getCanSelect()" @change="selectRow($event, row)" />
            </td>
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" :data-align="cell.column.columnDef.meta?.align">
              <slot :name="`cell-${cell.column.id}`" :row="row.original" :cell="cell" :value="cell.getValue()">
                <slot name="cell" :row="row.original" :cell="cell" :value="cell.getValue()">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="ui-data-table-footer flex flex-wrap items-center gap-3">
      <p class="ui-data-table-summary" role="status" aria-atomic="true">
        <template v-if="loading">데이터를 불러오는 중입니다.</template>
        <template v-else-if="error">{{ error }}</template>
        <template v-else>총 {{ total }}건 중 {{ start }}–{{ end }}건<span v-if="selectable"> · {{ server ? '현재 응답에서' : '전체 데이터 중' }} {{ selectedRows.length }}건 선택</span></template>
      </p>
      <div v-if="paginated" class="ui-data-table-pagination flex flex-wrap items-center gap-2" role="group" :aria-label="`${label} 페이지 이동`">
        <label :for="`${id}-page-size`">페이지당 행</label>
        <select :id="`${id}-page-size`" class="ui-data-table-page-size" :value="safePagination.pageSize" :disabled="blocked" @change="pageSizeChanged">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
        <span>{{ safePagination.pageIndex + 1 }} / {{ pageCount }} 페이지</span>
        <UIButton variant="outline" size="sm" :disabled="blocked || !table.getCanPreviousPage()" @click="table.previousPage()">이전</UIButton>
        <UIButton variant="outline" size="sm" :disabled="blocked || !table.getCanNextPage()" @click="table.nextPage()">다음</UIButton>
      </div>
    </div>
  </div>
</template>
