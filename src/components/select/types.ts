import type { SelectHTMLAttributes } from 'vue'

export interface UISelectOption {
  /** Unique non-empty string; empty string is reserved for the empty choice. */
  value: string
  label: string
  disabled?: boolean
}
export interface UISelectProps {
  modelValue?: string
  options: readonly UISelectOption[]
  /** Label of the selectable empty choice. Does not replace the field label. */
  placeholder?: string
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  class?: SelectHTMLAttributes['class']
}
