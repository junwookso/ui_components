import type { InputHTMLAttributes } from 'vue'

export interface UITimePickerProps {
  /** Local time in HH:mm (24-hour) format; empty string clears. No timezone conversion. */
  modelValue?: string
  size?: 'sm' | 'default' | 'lg'
  /** Inclusive time limits in HH:mm format. */
  min?: string
  max?: string
  /** Native step in minutes, default 1. Invalid values fall back to 1 minute. */
  minuteStep?: number
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  class?: InputHTMLAttributes['class']
}
