<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UIDatePickerProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UIDatePickerProps>(), {
  level: 'day', size: 'default', disabled: false, readonly: false, invalid: false,
})
const model = defineModel<string>()
const sizes = {
  sm: 'h-8 px-3 py-1 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.25rem-1px)]',
  default: 'h-9 px-3 py-1.5 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.375rem-1px)]',
  lg: 'h-12 px-4 py-3 focus:px-[calc(1rem-1px)] focus:py-[calc(0.75rem-1px)]',
}
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :type="level === 'month' ? 'month' : 'date'"
    :min="min"
    :max="max"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="invalid || undefined"
    :class="cn(
      'ui-input ui-date-picker block w-full min-w-0 rounded-md border focus:border-2 bg-surface text-sm text-foreground motion-safe:transition-colors disabled:cursor-not-allowed read-only:bg-secondary disabled:bg-disabled disabled:text-disabled-foreground',
      sizes[size],
      $props.class,
    )"
  />
</template>
