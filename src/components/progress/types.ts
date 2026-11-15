import type { HTMLAttributes } from 'vue'

export interface UIProgressProps {
  /** Visible, accessible name describing the task. */
  label: string
  /** Omit or pass null when the amount completed is unknown. */
  value?: number | null
  max?: number
  /** Custom visible and accessible value text, e.g. '3 / 10 files'. */
  valueText?: string
  description?: string
  showValue?: boolean
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'success' | 'destructive'
  class?: HTMLAttributes['class']
}
