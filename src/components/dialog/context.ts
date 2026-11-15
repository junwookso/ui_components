import { inject, type InjectionKey } from 'vue'
import type { UIDialogContext, UIDialogService } from './types'

export const dialogServiceKey: InjectionKey<UIDialogService> = Symbol('UIDialogService')
export const dialogContextKey: InjectionKey<UIDialogContext<unknown, unknown>> = Symbol('UIDialogContext')

export function useDialog(): UIDialogService {
  const service = inject(dialogServiceKey)
  if (!service) throw new Error('useDialog() requires a UIDialogProvider ancestor.')
  return service
}

export function useDialogContext<TPayload, TResult>(): UIDialogContext<TPayload, TResult> {
  const context = inject(dialogContextKey)
  if (!context) throw new Error('useDialogContext() must be used inside a dialog opened by UIDialogProvider.')
  return context as UIDialogContext<TPayload, TResult>
}
