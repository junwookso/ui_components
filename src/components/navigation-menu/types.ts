import type { HTMLAttributes } from 'vue'

export interface UINavigationMenuItem {
  /** Unique across the entire menu. */
  key: string
  label: string
  routeName?: string | symbol
  /** Resolved URL; preserves open-in-new-tab behavior. */
  href?: string
  disabled?: boolean
  children?: readonly UINavigationMenuItem[]
}
export interface UINavigationMenuProps {
  items: readonly UINavigationMenuItem[]
  currentRouteName?: string | symbol | null
  label?: string
  class?: HTMLAttributes['class']
}
export interface NavigationNode {
  item: UINavigationMenuItem
  children: NavigationNode[]
  active: boolean
  ancestor: boolean
  disabled: boolean
}
