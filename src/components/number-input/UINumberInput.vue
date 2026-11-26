<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { inputBaseClass, inputSizeClasses } from '../../lib/input-classes'
import type { UINumberInputProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UINumberInputProps>(), { step: 1 })
const model = defineModel<number | null>()

function update(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.validity.badInput) model.value = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : null
}
</script>

<template>
  <input
    type="number"
    :class="[inputBaseClass, 'block read-only:bg-secondary', inputSizeClasses.default]"
    :value.prop="model ?? ''"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    @input="update"
    v-bind="$attrs"
    :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
  />
</template>
