import type { InputHTMLAttributes } from 'vue'

export interface UIInputProps {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  class?: InputHTMLAttributes['class']
}
