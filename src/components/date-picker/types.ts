import type { InputHTMLAttributes } from 'vue'

export interface UIDatePickerProps {
  /** Local calendar value: YYYY-MM-DD for day, YYYY-MM for month; empty string clears. */
  modelValue?: string
  level?: 'day' | 'month'
  size?: 'sm' | 'default' | 'lg'
  /** Inclusive limits, in the same format as modelValue. */
  min?: string
  max?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  class?: InputHTMLAttributes['class']
}
