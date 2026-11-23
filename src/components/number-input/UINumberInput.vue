<script setup lang="ts">
import type { UINumberInputProps } from './types'

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
    class="ui-input block h-9 w-full min-w-0 rounded-md border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-2 focus:px-[calc(0.75rem-1px)] focus:py-[calc(0.375rem-1px)] read-only:bg-secondary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground"
    :value.prop="model ?? ''"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-invalid="invalid || undefined"
    @input="update"
  />
</template>
