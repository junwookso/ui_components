import type { HTMLAttributes } from 'vue'

export interface UITooltipProps {
  text: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Hover delay in milliseconds. Keyboard focus opens immediately. */
  delayDuration?: number
  disabled?: boolean
  /** Applied to the tooltip popup. */
  class?: HTMLAttributes['class']
}
