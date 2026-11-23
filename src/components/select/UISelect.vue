<script setup lang="ts">
import { computed } from 'vue'
import type { SelectHTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import type { UISelectProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UISelectProps>(), {
  placeholder: '선택해 주세요', size: 'default', disabled: false, required: false, invalid: false,
})
const model = defineModel<string>()
const selection = computed({ get: () => model.value ?? '', set: (value: string) => { model.value = value } })
const sizes = {
  sm: 'h-8 px-3 py-1 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.25rem-1px)]',
  default: 'h-9 px-3 py-1.5 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.375rem-1px)]',
  lg: 'h-12 px-4 py-3 focus:px-[calc(1rem-1px)] focus:py-[calc(0.75rem-1px)]',
}
</script>

<template>
  <select
    v-model="selection"
    v-bind="$attrs"
    :multiple="false"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid || ($attrs['aria-invalid'] as SelectHTMLAttributes['aria-invalid'])"
    :class="cn(
      'ui-input ui-select block w-full min-w-0 rounded-md border focus:border-2 bg-surface text-sm text-foreground motion-safe:transition-colors disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground',
      sizes[size],
      $props.class,
    )"
  >
    <option value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
  </select>
</template>
