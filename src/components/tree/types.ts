import type { HTMLAttributes } from 'vue'

export interface UITreeItem {
  /** Stable value, unique across the entire tree. */
  value: string
  label: string
  disabled?: boolean
  children?: readonly UITreeItem[]
}

export interface UITreeProps {
  items: readonly UITreeItem[]
  /** Accessible name for the tree. */
  label: string
  modelValue?: string
  expanded?: string[]
  emptyText?: string
  class?: HTMLAttributes['class']
}

/** Internal recursive renderer contract. */
export interface TreeController {
  selected?: string
  tabStop?: string
  expanded: ReadonlySet<string>
  register: (value: string, element: unknown) => void
  focus: (value: string) => void
  select: (item: UITreeItem) => void
  toggle: (item: UITreeItem) => void
  keydown: (event: KeyboardEvent, item: UITreeItem) => void
}
