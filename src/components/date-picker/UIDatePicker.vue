<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { inputBaseClass, inputSizeClasses } from '../../lib/input-classes'
import type { UIDatePickerProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UIDatePickerProps>(), {
  level: 'day', size: 'default', disabled: false, readonly: false, invalid: false,
})
const model = defineModel<string>()
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
    :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
    :class="cn(
      inputBaseClass,
      'ui-date-picker block motion-safe:transition-colors read-only:bg-secondary',
      inputSizeClasses[size],
      $props.class,
    )"
  />
</template>
