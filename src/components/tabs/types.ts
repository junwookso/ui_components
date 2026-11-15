import type { HTMLAttributes } from 'vue'

export interface UITabItem {
  /** Stable, unique value within this tab group. */
  value: string
  label: string
  disabled?: boolean
}

export interface UITabsProps {
  items: readonly UITabItem[]
  /** Accessible name for the tab list. */
  label: string
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
  class?: HTMLAttributes['class']
}
