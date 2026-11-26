import type { HTMLAttributes } from 'vue'

export interface UIChipProps {
  /** Visible text; also used to name the remove button. */
  label: string
  variant?: 'default' | 'outline' | 'primary' | 'success' | 'warning' | 'info' | 'destructive'
  size?: 'sm' | 'default'
  shape?: 'rect' | 'pill'
  removable?: boolean
  disabled?: boolean
  /** Defaults to `${label} 제거`. */
  removeLabel?: string
  class?: HTMLAttributes['class']
}
