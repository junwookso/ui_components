export interface UINumberInputProps {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number | 'any'
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
}
