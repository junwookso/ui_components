<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue'
import type { UIRadioGroupProps } from './types'

const props = defineProps<UIRadioGroupProps>()
const model = defineModel<string>()
const group = useTemplateRef<HTMLFieldSetElement>('group')
const selection = computed(() => props.options.find(option => !option.disabled && option.value === model.value)?.value)

async function select(value: string) {
  model.value = value
  await nextTick()
  if (selection.value === value) return

  // The browser updates all radios before emitting change, even if the parent rejects it.
  group.value?.querySelectorAll('input').forEach(input => {
    input.checked = input.value === selection.value
  })
}
</script>

<template>
  <fieldset ref="group" class="ui-radio-group" :form="form" :disabled="disabled" :aria-invalid="invalid || undefined">
    <legend class="ui-label">{{ label }}</legend>
    <div class="ui-radio-options">
      <label v-for="option in options" :key="option.value" class="ui-radio-option ui-body">
        <input
          class="ui-radio"
          type="radio"
          :name="name"
          :form="form"
          :value="option.value"
          :checked="selection === option.value"
          :disabled="option.disabled"
          :required="required && !option.disabled"
          @change="select(option.value)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
