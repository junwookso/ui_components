import type { HTMLAttributes } from 'vue'

export interface UICircleProgressProps {
  /** Accessible name that identifies the task in progress. */
  label: string
  size?: 'sm' | 'default' | 'lg'
  /** Additional context connected to the accessible name. */
  description?: string
  class?: HTMLAttributes['class']
}
