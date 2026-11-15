<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { cn } from '../../lib/cn'
import UITreeNode from './UITreeNode.vue'
import type { TreeController, UITreeItem, UITreeProps } from './types'

const props = withDefaults(defineProps<UITreeProps>(), { emptyText: '표시할 항목이 없습니다.' })
const model = defineModel<string>()
const expanded = defineModel<string[]>('expanded', { default: () => [] })
defineSlots<{ icon?: (props: { item: UITreeItem; expanded: boolean; selected: boolean }) => unknown }>()
const root = ref<HTMLElement>()
const focused = ref<string>()
const elements = new Map<string, HTMLElement>()
const expandedSet = computed(() => new Set(expanded.value))
const visible = computed(() => {
  const result: { item: UITreeItem; parent?: string; disabled: boolean }[] = []
  function visit(items: readonly UITreeItem[], parent?: string, disabled = false) {
    for (const item of items) {
      const blocked = disabled || !!item.disabled
      result.push({ item, parent, disabled: blocked })
      if (expandedSet.value.has(item.value) && item.children) visit(item.children, item.value, blocked)
    }
  }
  visit(props.items)
  return result
})
const enabled = computed(() => visible.value.filter(entry => !entry.disabled))
const tabStop = computed(() => {
  const values = enabled.value.map(entry => entry.item.value)
  return values.includes(focused.value!) ? focused.value : values.includes(model.value!) ? model.value : values[0]
})
function move(value?: string) {
  if (value === undefined) return
  focused.value = value
  elements.get(value)?.focus()
}
function select(item: UITreeItem) {
  move(item.value)
  model.value = item.value
}
function toggle(item: UITreeItem) {
  if (!item.children?.length) return
  move(item.value)
  expanded.value = expandedSet.value.has(item.value)
    ? expanded.value.filter(value => value !== item.value)
    : [...expanded.value, item.value]
}
let search = ''
let lastTyped = 0
function keydown(event: KeyboardEvent, item: UITreeItem) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
  const entries = enabled.value
  const index = entries.findIndex(entry => entry.item.value === item.value)
  const rtl = getComputedStyle(root.value!).direction === 'rtl'
  const openKey = rtl ? 'ArrowLeft' : 'ArrowRight'
  const closeKey = rtl ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === 'ArrowDown') move(entries[Math.min(index + 1, entries.length - 1)]?.item.value)
  else if (event.key === 'ArrowUp') move(entries[Math.max(index - 1, 0)]?.item.value)
  else if (event.key === 'Home') move(entries[0]?.item.value)
  else if (event.key === 'End') move(entries.at(-1)?.item.value)
  else if (event.key === openKey) {
    if (item.children?.length && !expandedSet.value.has(item.value)) toggle(item)
    else move(entries.find(entry => entry.parent === item.value)?.item.value)
  } else if (event.key === closeKey) {
    if (item.children?.length && expandedSet.value.has(item.value)) toggle(item)
    else move(entries[index]?.parent)
  } else if (event.key === 'Enter' || event.key === ' ') select(item)
  else if (event.key.length === 1) {
    const now = Date.now()
    search = now - lastTyped > 700 ? event.key : search + event.key
    lastTyped = now
    const query = Array.from(search).every(char => char === search[0]) ? search[0]! : search
    const ordered = [...entries.slice(index + 1), ...entries.slice(0, index + 1)]
    move(ordered.find(entry => entry.item.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))?.item.value)
  } else return
  event.preventDefault()
}
// Repair focus before removed/collapsed rows disappear, without stealing focus outside the tree.
watch(visible, async (rows, previous) => {
  if (rows.some(entry => entry.item.value === focused.value && !entry.disabled)) return
  const hadFocus = !!root.value?.contains(document.activeElement)
  let candidate = focused.value
  while (candidate !== undefined && !rows.some(entry => entry.item.value === candidate && !entry.disabled)) {
    candidate = previous.find(entry => entry.item.value === candidate)?.parent
  }
  focused.value = candidate
  await nextTick()
  if (hadFocus) {
    if (tabStop.value !== undefined) move(tabStop.value)
    else root.value?.focus()
  }
})
const controller = computed<TreeController>(() => ({
  selected: model.value, tabStop: tabStop.value, expanded: expandedSet.value,
  register(value, element) {
    if (element instanceof HTMLElement) elements.set(value, element)
    else elements.delete(value)
  },
  focus(value) { focused.value = value }, select, toggle, keydown,
}))
function focusout(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node | null)) focused.value = undefined
}
</script>

<template>
  <div :class="cn('ui-tree', $props.class)">
    <ul ref="root" role="tree" :aria-label="label" class="ui-tree-root" :tabindex="enabled.length ? -1 : 0" @focusout="focusout">
      <UITreeNode v-for="item in items" :key="item.value" :item="item" :level="1" :controller="controller">
        <template v-if="$slots.icon" #icon="scope"><slot name="icon" v-bind="scope" /></template>
      </UITreeNode>
    </ul>
    <p v-if="!items.length" class="ui-tree-empty" role="status">{{ emptyText }}</p>
  </div>
</template>
