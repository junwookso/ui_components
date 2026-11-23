<script setup lang="ts">
import { computed, useId } from 'vue'
import type { UIFormFieldControlAttrs, UIFormFieldProps } from './types'

const props = defineProps<UIFormFieldProps>()
defineSlots<{ default: (props: { controlAttrs: UIFormFieldControlAttrs }) => unknown }>()

const baseId = `ui-field-${useId()}`
const descriptionId = `${baseId}-description`
const errorId = `${baseId}-error`
const descriptionText = computed(() => props.description?.trim())
const errorText = computed(() => props.error?.trim())
const controlAttrs = computed<UIFormFieldControlAttrs>(() => ({
  id: props.id || baseId,
  required: !!props.required,
  'aria-describedby': [errorText.value && errorId, descriptionText.value && descriptionId].filter(Boolean).join(' ') || undefined,
  'aria-invalid': errorText.value ? true : undefined,
}))
</script>

<template>
  <div class="grid min-w-0 gap-2 [overflow-wrap:anywhere]">
    <label class="ui-label" :for="controlAttrs.id">
      {{ label }}<span v-if="required" class="ms-1" aria-hidden="true">(필수)</span>
    </label>
    <slot :control-attrs="controlAttrs" />
    <p v-if="errorText" :id="errorId" class="ui-body text-destructive">{{ errorText }}</p>
    <p v-if="descriptionText" :id="descriptionId" class="ui-body ui-text-muted">{{ descriptionText }}</p>
  </div>
</template>
