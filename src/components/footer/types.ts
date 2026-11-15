import type { HTMLAttributes } from 'vue'

export interface UIFooterProps {
  label?: string
  navigationLabel?: string
  /** Service/copyright text. Replaced by the default slot when supplied. */
  text?: string
  class?: HTMLAttributes['class']
}
