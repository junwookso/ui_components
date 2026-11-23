import type { HTMLAttributes } from 'vue'

export interface UIAccordionItem {
  /** Unique non-empty section identifier. */
  value: string
  label: string
  content?: string
  disabled?: boolean
}

export interface UIAccordionProps {
  items: readonly UIAccordionItem[]
  multiple?: boolean
  /** Initial open section IDs for an uncontrolled accordion. */
  defaultValue?: readonly string[]
  headingLevel?: 2 | 3 | 4 | 5 | 6
  disabled?: boolean
  class?: HTMLAttributes['class']
}
