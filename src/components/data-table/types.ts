import type { HTMLAttributes } from 'vue'
import type { ColumnDef, PaginationState, RowData, RowSelectionState, SortingState } from '@tanstack/vue-table'
import type { UIInputProps } from '../input/types'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Text and numeric alignment; does not change data or sorting. */
    align?: 'start' | 'center' | 'end'
  }
}

export type UIDataTableColumn<TData extends object, TValue = unknown> = ColumnDef<TData, TValue>
export type UIDataTableSorting = SortingState
export type UIDataTablePagination = PaginationState
export type UIDataTableRowSelection = RowSelectionState

export interface UIDataTableProps<TData extends object> {
  data: TData[]
  columns: UIDataTableColumn<TData>[]
  /** Visible caption and accessible table name. */
  label: string
  /** Stable, unique business ID; never use the row index. */
  getRowId: (row: TData) => string
  getRowLabel?: (row: TData) => string
  selectable?: boolean
  canSelectRow?: (row: TData) => boolean
  searchable?: boolean
  searchSize?: UIInputProps['size']
  paginated?: boolean
  mode?: 'client' | 'server'
  /** Count before pagination for the current server query. */
  totalRows?: number
  sorting?: SortingState
  pagination?: PaginationState
  rowSelection?: RowSelectionState
  globalFilter?: string
  loading?: boolean
  error?: string
  emptyText?: string
  class?: HTMLAttributes['class']
}
