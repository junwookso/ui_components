import type { HTMLAttributes } from 'vue'

export interface UISwitchProps {
  modelValue?: boolean
  disabled?: boolean
  falseLabel?: string
  trueLabel?: string
  class?: HTMLAttributes['class']
}
