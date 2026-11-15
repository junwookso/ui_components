import { inject, type InjectionKey } from 'vue'
import type { UIConfirmService } from './types'

export const confirmServiceKey: InjectionKey<UIConfirmService> = Symbol('UIConfirmService')
export function useConfirm(): UIConfirmService {
  const service = inject(confirmServiceKey)
  if (!service) throw new Error('useConfirm() requires a UIDialogProvider ancestor.')
  return service
}
