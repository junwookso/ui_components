import type { HTMLAttributes } from 'vue'

export interface UISkeletonProps {
  shape?: 'line' | 'block' | 'circle'
  /** Opt in to a brief pulse that respects reduced-motion preferences. */
  pulse?: boolean
  class?: HTMLAttributes['class']
}
