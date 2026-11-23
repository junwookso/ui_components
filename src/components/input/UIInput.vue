<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UIInputProps } from './types'

defineOptions({ inheritAttrs: false })
defineSlots<{ prefix?: () => unknown; suffix?: () => unknown }>()

withDefaults(defineProps<UIInputProps>(), {
  type: 'text',
  size: 'default',
  disabled: false,
  readonly: false,
  invalid: false,
})

const model = defineModel<string>()

const sizes = {
  sm: 'h-8 px-3 py-1 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.25rem-1px)]',
  default: 'h-9 px-3 py-1.5 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.375rem-1px)]',
  lg: 'h-12 px-4 py-3 focus:px-[calc(1rem-1px)] focus:py-[calc(0.75rem-1px)]',
}
</script>

<template>
  <span class="ui-input-wrapper relative inline-flex w-full min-w-0">
    <input
      v-model="model"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      v-bind="$attrs"
      :class="cn(
        'ui-input flex w-full min-w-0 rounded-md border focus:border-2 bg-surface text-sm text-foreground motion-safe:transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed read-only:bg-secondary disabled:bg-disabled disabled:text-disabled-foreground',
        sizes[size],
        $slots.prefix && 'pl-10 focus:pl-[calc(2.5rem-1px)]',
        $slots.suffix && 'pr-10 focus:pr-[calc(2.5rem-1px)]',
        $props.class,
      )"
    />
    <span v-if="$slots.prefix" class="ui-input-icon ui-input-prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>
    <span v-if="$slots.suffix" class="ui-input-icon ui-input-suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>
  </span>
</template>
