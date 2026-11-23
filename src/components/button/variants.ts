import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'vue'

// Adapted from shadcn-vue's Button (MIT). See THIRD_PARTY_NOTICES.md.
export const buttonVariants = cva(
  'ui-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium motion-safe:transition-colors disabled:bg-disabled disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground enabled:hover:bg-primary-hover enabled:active:bg-primary-pressed',
        secondary: 'bg-secondary text-secondary-foreground enabled:hover:bg-secondary-hover enabled:active:bg-accent-pressed',
        outline: 'border border-control-border bg-surface text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground enabled:active:bg-accent-pressed',
        ghost: 'bg-transparent text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground enabled:active:bg-accent-pressed',
        destructive: 'bg-destructive text-destructive-foreground enabled:hover:bg-destructive-hover enabled:active:bg-destructive-pressed',
        link: 'bg-transparent text-primary underline-offset-4 enabled:hover:underline enabled:hover:text-primary-hover enabled:active:text-primary-pressed',
      },
      size: {
        default: 'h-9 px-4 py-1.5',
        sm: 'h-8 px-3 py-1',
        lg: 'h-12 px-6 py-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type Variants = VariantProps<typeof buttonVariants>
export interface UIButtonProps {
  variant?: NonNullable<Variants['variant']>
  size?: NonNullable<Variants['size']>
  disabled?: boolean
  loading?: boolean
  type?: ButtonHTMLAttributes['type']
  class?: ButtonHTMLAttributes['class']
}
