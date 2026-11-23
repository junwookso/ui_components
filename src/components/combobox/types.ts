import type { InputHTMLAttributes } from 'vue'

export interface UIComboboxOption {
  /** Unique non-empty string; empty string represents no selection. */
  value: string
  label: string
  keywords?: readonly string[]
  disabled?: boolean
}

export interface UIComboboxProps {
  modelValue?: string
  options: readonly UIComboboxOption[]
  /** Supplies the label for an existing selection outside the current result set. */
  selectedOption?: UIComboboxOption
  remote?: boolean
  loading?: boolean
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
  class?: InputHTMLAttributes['class']
}
