import type { TextareaHTMLAttributes } from 'vue'

export interface UITextareaProps {
  modelValue?: string
  rows?: number
  minlength?: number
  maxlength?: number
  resize?: 'vertical' | 'none'
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  class?: TextareaHTMLAttributes['class']
}
