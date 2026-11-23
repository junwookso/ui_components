<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UITextareaProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UITextareaProps>(), { rows: 3, resize: 'vertical' })
const model = defineModel<string>()
</script>

<template>
  <textarea
    v-model="model"
    :aria-invalid="invalid || undefined"
    v-bind="$attrs"
    :rows="rows"
    :minlength="minlength"
    :maxlength="maxlength"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :class="cn(
      'ui-input block w-full min-w-0 rounded-md border bg-surface px-3 py-2 text-sm text-foreground motion-safe:transition-colors placeholder:text-muted-foreground focus:border-2 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.5rem-1px)] read-only:bg-secondary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground disabled:resize-none',
      resize === 'none' ? 'resize-none' : 'resize-y',
      $props.class,
    )"
  />
</template>
