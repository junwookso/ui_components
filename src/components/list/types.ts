import type { HTMLAttributes } from 'vue'

export interface UIListItem {
  /** Stable key, unique within the list. */
  key: string
  title: string
  description?: string
}

export interface UIListProps {
  /** Visible section heading and accessible name. */
  label: string
  items: readonly UIListItem[]
  headingLevel?: 2 | 3 | 4 | 5 | 6
  bordered?: boolean
  size?: 'default' | 'sm'
  emptyText?: string
  class?: HTMLAttributes['class']
}
