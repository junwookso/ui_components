import type { HTMLAttributes } from 'vue'

export interface UITopbarProps {
  /** Service name, rendered unless the brand slot is supplied. */
  title: string
  label?: string
  navigationLabel?: string
  /** Sticks to the top of the nearest scrolling ancestor. Defaults to false. */
  sticky?: boolean
  class?: HTMLAttributes['class']
}
