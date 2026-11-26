<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { inputBaseClass, inputSizeClasses } from '../../lib/input-classes'
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
</script>

<template>
  <span class="ui-input-wrapper relative inline-flex w-full min-w-0">
    <input
      v-model="model"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="$attrs"
      :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
      :class="cn(
        inputBaseClass,
        'flex motion-safe:transition-colors placeholder:text-muted-foreground read-only:bg-secondary',
        inputSizeClasses[size],
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
