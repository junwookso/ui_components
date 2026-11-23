export interface UIFileUploadFailure {
  file: File
  message: string
}

export interface UIFileUploadProps {
  modelValue?: readonly File[]
  label: string
  accept?: string
  /** Maximum size of each file in bytes. */
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  failures?: readonly UIFileUploadFailure[]
}
