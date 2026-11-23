export interface UIFormFieldProps {
  /** ID of the control; generated when omitted. */
  id?: string
  label: string
  required?: boolean
  description?: string
  error?: string
}

export interface UIFormFieldControlAttrs {
  id: string
  required: boolean
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}
