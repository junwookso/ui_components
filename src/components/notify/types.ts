export type UINotifyPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

export interface UINotifyProviderProps {
  /** Defaults to top (center). Left/right are physical positions, including RTL. */
  position?: UINotifyPosition
}

export type UINotifyType = 'info' | 'success' | 'warning' | 'error'

export interface UINotifyOptions {
  message: string
  title?: string
  type?: UINotifyType
  /** Milliseconds. 0 persists. Defaults: info/success 5000, warning/error 0. */
  duration?: number
}

export interface UINotifyService {
  /** Returns the notification ID, or null after provider teardown / for blank messages. */
  notify: (options: UINotifyOptions) => string | null
  dismiss: (id: string) => void
  clear: () => void
}
