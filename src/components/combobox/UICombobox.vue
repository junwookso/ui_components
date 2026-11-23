<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue'
import type { InputHTMLAttributes } from 'vue'
import {
  ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxItem,
  ComboboxItemIndicator, ComboboxRoot, ComboboxTrigger, ComboboxViewport,
} from 'reka-ui'
import { cn } from '../../lib/cn'
import type { UIComboboxOption, UIComboboxProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<UIComboboxProps>(), { placeholder: '검색해 선택해 주세요' })
const emit = defineEmits<{ search: [query: string] }>()
const model = defineModel<string>()

const comboboxInput = useTemplateRef<InstanceType<typeof ComboboxInput>>('input')
const input = computed(() => comboboxInput.value?.$el as HTMLInputElement | undefined)
const open = ref(false)
const text = ref('')
const query = ref('')
const lastOption = ref<UIComboboxOption>()
const knownOption = computed(() => props.options.find(option => option.value === model.value)
  ?? (props.selectedOption?.value === model.value ? props.selectedOption : undefined))
const displayLabel = computed(() => knownOption.value?.label
  ?? (lastOption.value?.value === model.value ? lastOption.value?.label : undefined)
  ?? model.value ?? '')

function normalize(value: string) {
  return value.normalize().toLowerCase()
}

const matches = computed(() => {
  if (props.loading || props.error) return []
  const term = normalize(query.value.trim())
  return props.remote || !term ? props.options : props.options.filter(option =>
    [option.label, ...(option.keywords ?? [])].some(value => normalize(value).includes(term)),
  )
})
const message = computed(() => {
  if (props.loading) return '검색 중입니다.'
  if (props.error) return props.error
  return matches.value.length ? '' : '검색 결과가 없습니다.'
})

watch(knownOption, option => { if (option) lastOption.value = option }, { immediate: true })
watch(displayLabel, label => { if (!query.value || !open.value) text.value = label }, { immediate: true })
watch(open, expanded => {
  if (!expanded) {
    text.value = displayLabel.value
    setQuery('')
  }
})
watch(() => props.disabled, disabled => { if (disabled) open.value = false })
watchEffect(() => {
  input.value?.setCustomValidity(props.required && !model.value ? '목록에서 항목을 선택해 주세요.' : '')
})

function setQuery(value: string) {
  if (query.value === value) return
  query.value = value
  emit('search', value)
}

function updateText(value: string) {
  text.value = value
  setQuery(value)
}

function select(value: unknown) {
  if (typeof value === 'string') model.value = value
}

function clear() {
  model.value = ''
  open.value = false
  input.value?.focus()
}

function handleEnter(event: KeyboardEvent) {
  if (open.value && !event.isComposing) event.preventDefault()
}

function preserveCaretNavigation(event: KeyboardEvent) {
  // Keep Home and End as native text-editing keys instead of moving the list selection.
  if (event.key === 'Home' || event.key === 'End') event.stopPropagation()
}
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    :model-value="model ?? ''"
    :disabled="disabled"
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    open-on-click
    ignore-filter
    :class="cn('ui-combobox', $props.class)"
    :data-selected="!!model && !disabled"
    @update:model-value="select"
  >
    <ComboboxAnchor class="ui-combobox-anchor">
      <ComboboxInput
        ref="input"
        v-bind="$attrs"
        class="ui-input ui-combobox-input"
        :model-value="text"
        :form="form"
        :placeholder="placeholder"
        :aria-required="required || undefined"
        :aria-invalid="invalid || ($attrs['aria-invalid'] as InputHTMLAttributes['aria-invalid'])"
        @keydown.capture="preserveCaretNavigation"
        @update:model-value="updateText"
        @keydown.enter="handleEnter"
        @keydown.tab="open = false"
      />
      <button v-if="model && !disabled" type="button" class="ui-combobox-clear" @click="clear">지우기</button>
      <ComboboxTrigger as-child>
        <button type="button" class="ui-combobox-trigger" :aria-label="open ? '선택 목록 닫기' : '선택 목록 열기'">
          <span aria-hidden="true" />
        </button>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <input v-if="name" type="hidden" :name="name" :value="model ?? ''" :form="form" :disabled="disabled" />
    <span class="sr-only" role="status">{{ open ? message : '' }}</span>
    <ComboboxContent class="ui-combobox-popup" position="popper" align="start" :side-offset="4" :collision-padding="8" :aria-busy="loading || undefined">
      <ComboboxViewport>
        <p v-if="message" aria-hidden="true" class="ui-combobox-message" :data-error="!!error">{{ message }}</p>
        <ComboboxItem
          v-for="option in matches"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
          :aria-disabled="option.disabled || undefined"
          class="ui-combobox-option"
        >
          <span>{{ option.label }}</span>
          <ComboboxItemIndicator class="ui-combobox-check" aria-hidden="true" />
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
