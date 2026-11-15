import type { HTMLAttributes } from 'vue'

export interface UICardProps {
  title?: string
  description?: string
  headingLevel?: 2 | 3 | 4 | 5 | 6
  class?: HTMLAttributes['class']
}
