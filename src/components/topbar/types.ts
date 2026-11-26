import type { HTMLAttributes } from 'vue'

export interface UITopbarProps {
  /** Service name, rendered unless the brand slot is supplied. */
  title: string
  label?: string
  navigationLabel?: string
  /** Uses the surface by default or the service's primary color. */
  variant?: 'default' | 'primary'
  /** Sticks to the top of the nearest scrolling ancestor. Defaults to false. */
  sticky?: boolean
  class?: HTMLAttributes['class']
}
