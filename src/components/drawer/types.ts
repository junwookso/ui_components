import type { HTMLAttributes } from 'vue'

export type UIDrawerDismissReason = 'close-button' | 'escape' | 'backdrop' | 'action' | 'native'
export interface UIDrawerProps {
  title: string
  description?: string
  /** Physical side, also in RTL. Defaults to right. */
  side?: 'left' | 'right'
  size?: 'sm' | 'default' | 'lg'
  closeOnBackdrop?: boolean
  closeLabel?: string
  class?: HTMLAttributes['class']
}
