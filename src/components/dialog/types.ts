import type { Component, HTMLAttributes } from 'vue'

export type UIDialogCancelReason = 'cancel' | 'escape' | 'backdrop'
export interface UIDialogOptions<TPayload, TResult> {
  payload: TPayload
  closeOnBackdrop?: boolean
  onResult: (result: TResult) => void
  onCancel?: (reason: UIDialogCancelReason) => void
}
export interface UIDialogService {
  openDialog<TPayload, TResult>(component: Component, options: UIDialogOptions<TPayload, TResult>): boolean
}
export interface UIDialogContext<TPayload, TResult> {
  readonly payload: TPayload
  readonly closeOnBackdrop: boolean
  complete: (result: TResult) => void
  cancel: (reason?: UIDialogCancelReason) => void
}
export interface UIDialogProps {
  title: string
  description?: string
  class?: HTMLAttributes['class']
}
