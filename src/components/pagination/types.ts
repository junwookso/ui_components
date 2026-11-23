import type { HTMLAttributes } from 'vue'

export interface UIPaginationProps {
  /** Total number of pages. Values below two hide the navigation. */
  pageCount: number
  label?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}
