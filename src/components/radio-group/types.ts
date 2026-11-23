export interface UIRadioGroupOption {
  /** Unique non-empty string within the group. */
  value: string
  label: string
  disabled?: boolean
}

export interface UIRadioGroupProps {
  modelValue?: string
  options: readonly UIRadioGroupOption[]
  label: string
  /** Non-empty field name, unique to this radio group within its form. */
  name: string
  form?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
}
