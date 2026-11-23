<script setup lang="ts">
import { nextTick } from 'vue'
import type { InputHTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import type { UICheckboxProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<UICheckboxProps>()
const checked = defineModel<boolean>({ default: false })

async function handleChange(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  checked.value = input.checked
  await nextTick()
  // Native activation clears the mixed state even if the parent keeps it.
  input.checked = checked.value
  input.indeterminate = !!props.indeterminate
}
</script>

<template>
  <input
    v-bind="$attrs"
    type="checkbox"
    :checked="checked"
    :indeterminate="!!indeterminate"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
    :class="cn('ui-checkbox', $props.class)"
    @change="handleChange"
  />
</template>
