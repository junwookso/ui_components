export interface UIConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** Uses the existing destructive button variant. */
  destructive?: boolean
  /** Defaults to false. Escape and the cancel button always cancel. */
  closeOnBackdrop?: boolean
}

export interface UIConfirmService {
  /** True only on explicit confirmation. Busy/disposed providers resolve false. */
  confirm: (options: UIConfirmOptions) => Promise<boolean>
}
