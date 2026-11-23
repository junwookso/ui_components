import type { InputHTMLAttributes } from 'vue'

export interface UICheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  class?: InputHTMLAttributes['class']
}
