<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '../../lib/cn'
import { inputBaseClass, inputSizeClasses } from '../../lib/input-classes'
import type { UITimePickerProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<UITimePickerProps>(), {
  minuteStep: 1, size: 'default', disabled: false, readonly: false, invalid: false,
})
const model = defineModel<string>()
const stepSeconds = computed(() => Number.isInteger(props.minuteStep) && props.minuteStep > 0 && props.minuteStep <= 1440 ? props.minuteStep * 60 : 60)
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    type="time"
    :step="stepSeconds"
    :min="min"
    :max="max"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
    :class="cn(
      inputBaseClass,
      'ui-time-picker block motion-safe:transition-colors read-only:bg-secondary',
      inputSizeClasses[size],
      $props.class,
    )"
  />
</template>
