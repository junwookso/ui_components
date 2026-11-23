export interface UIBreadcrumbItem {
  /** Unique within the trail. */
  key: string
  label: string
  href?: string
  target?: string
  rel?: string
}

export interface UIBreadcrumbProps {
  /** Ancestors first, current page last. */
  items: readonly UIBreadcrumbItem[]
  label?: string
}
