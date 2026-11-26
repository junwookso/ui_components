<script setup lang="ts">
import { computed } from 'vue'
import type { SelectHTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { inputBaseClass, inputSizeClasses } from '../../lib/input-classes'
import type { UISelectProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UISelectProps>(), {
  placeholder: '선택해 주세요', size: 'default', disabled: false, required: false, invalid: false,
})
const model = defineModel<string>()
const selection = computed({ get: () => model.value ?? '', set: (value: string) => { model.value = value } })
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
      inputBaseClass,
      'ui-select block motion-safe:transition-colors',
      inputSizeClasses[size],
      $props.class,
    )"
  >
    <option value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
  </select>
</template>
