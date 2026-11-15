import type { HTMLAttributes } from 'vue'

export interface UIDescriptionItem {
  /** Stable key, unique within this list. Also used for value-{key} slots. */
  key: string
  label: string
  value?: string | number | boolean | null
}

export interface UIDescriptionsProps {
  /** Visible section heading and accessible name. */
  label: string
  items: readonly UIDescriptionItem[]
  headingLevel?: 2 | 3 | 4 | 5 | 6
  bordered?: boolean
  layout?: 'horizontal' | 'vertical'
  emptyValue?: string
  emptyText?: string
  class?: HTMLAttributes['class']
}
