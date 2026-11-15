<script setup lang="ts">
import { computed, ref, useId, watch, type ComponentPublicInstance } from 'vue'
import { cn } from '../../lib/cn'
import type { UITabItem, UITabsProps } from './types'

const props = withDefaults(defineProps<UITabsProps>(), { orientation: 'horizontal' })
const model = defineModel<string>()
defineSlots<{
  icon?: (props: { item: UITabItem; active: boolean }) => unknown
  panel?: (props: { item: UITabItem; active: boolean }) => unknown
}>()
const baseId = useId()
const enabled = computed(() => props.items.filter(item => !item.disabled))
const selected = computed(() => enabled.value.find(item => item.value === model.value)?.value ?? enabled.value[0]?.value)
const focused = ref<string>()
const tabStop = computed(() => enabled.value.some(item => item.value === focused.value) ? focused.value : selected.value)
const buttons = new Map<string, HTMLButtonElement>()
watch(selected, value => { focused.value = value })

function setButton(value: string, element: Element | ComponentPublicInstance | null) {
  if (element instanceof HTMLButtonElement) buttons.set(value, element)
  else buttons.delete(value)
}
function select(item: UITabItem) {
  if (!item.disabled) model.value = item.value
}
function onKeydown(event: KeyboardEvent, value: string) {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  const values = enabled.value.map(item => item.value)
  if (!values.length) return
  let index = values.indexOf(value)
  const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl'
  const next = props.orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
  const previous = props.orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === next) index = (index + 1) % values.length
  else if (event.key === previous) index = (index - 1 + values.length) % values.length
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = values.length - 1
  else return
  event.preventDefault()
  buttons.get(values[index]!)?.focus()
}
function onFocusout(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    focused.value = selected.value
  }
}
</script>

<template>
  <div :class="cn('ui-tabs grid min-w-0 text-foreground', $props.class)" :data-orientation="orientation">
    <div class="ui-tabs-list flex gap-1" role="tablist" :aria-label="label" :aria-orientation="orientation" @focusout="onFocusout">
      <button
        v-for="(item, index) in items"
        :id="`${baseId}-tab-${index}`"
        :key="item.value"
        :ref="el => setButton(item.value, el)"
        type="button"
        role="tab"
        class="ui-tabs-trigger inline-flex items-center gap-2 text-sm font-medium"
        :aria-selected="selected === item.value"
        :aria-controls="`${baseId}-panel-${index}`"
        :tabindex="!item.disabled && tabStop === item.value ? 0 : -1"
        :disabled="item.disabled"
        @focus="focused = item.value"
        @click="select(item)"
        @keydown="onKeydown($event, item.value)"
      >
        <span v-if="$slots.icon" class="ui-tabs-icon" aria-hidden="true"><slot name="icon" :item="item" :active="selected === item.value" /></span>
        <span>{{ item.label }}</span>
      </button>
    </div>
    <div class="ui-tabs-panels min-w-0">
      <div
        v-for="(item, index) in items"
        :id="`${baseId}-panel-${index}`"
        :key="item.value"
        class="ui-tabs-panel ui-body border border-border bg-surface p-4"
        role="tabpanel"
        :aria-labelledby="`${baseId}-tab-${index}`"
        :hidden="selected !== item.value"
        tabindex="0"
      >
        <slot name="panel" :item="item" :active="selected === item.value" />
      </div>
    </div>
  </div>
</template>
