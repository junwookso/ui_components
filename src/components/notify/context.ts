import { inject, type InjectionKey } from 'vue'
import type { UINotifyService } from './types'

export const notifyServiceKey: InjectionKey<UINotifyService> = Symbol('UINotifyService')
export function useNotify(): UINotifyService {
  const service = inject(notifyServiceKey)
  if (!service) throw new Error('useNotify() requires a UINotifyProvider ancestor.')
  return service
}
