export type UIAlertType = 'info' | 'success' | 'warning' | 'error'
export type UIAlertAnnouncement = 'off' | 'polite' | 'assertive'

export interface UIAlertProps {
  type?: UIAlertType
  title?: string
  /** Plain text used when the default slot is omitted. */
  message?: string
  announce?: UIAlertAnnouncement
}
