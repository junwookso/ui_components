<script setup lang="ts">
import { useId } from 'vue'
import type { NavigationNode, UINavigationMenuItem } from './types'
defineProps<{ node: NavigationNode; expanded: Set<string> }>()
const emit = defineEmits<{ toggle: [key: string]; select: [item: UINavigationMenuItem, event: MouseEvent] }>()
defineSlots<{ icon?: (props: { item: UINavigationMenuItem; active: boolean }) => unknown }>()
const id = useId()
function activate(event: MouseEvent, node: NavigationNode) {
  if (!node.disabled && !node.item.href && node.item.routeName == null && node.children.length) {
    emit('toggle', node.item.key)
    return
  }
  if (node.disabled) { event.preventDefault(); return }
  emit('select', node.item, event)
}
</script>
<template>
  <li>
    <div class="ui-navigation-row" :data-active="node.active" :data-ancestor="node.ancestor" :data-disabled="node.disabled">
      <component :is="node.disabled ? 'span' : node.item.href ? 'a' : 'button'"
        class="ui-navigation-target" :href="!node.disabled ? node.item.href : undefined"
        :type="!node.disabled && !node.item.href ? 'button' : undefined"
        :aria-disabled="node.disabled || undefined" :aria-current="node.active ? 'page' : undefined"
        :aria-expanded="!node.item.href && node.item.routeName == null && node.children.length ? expanded.has(node.item.key) : undefined"
        :aria-controls="!node.item.href && node.item.routeName == null && node.children.length ? id : undefined"
        @click="activate($event, node)">
        <span v-if="$slots.icon" class="ui-navigation-icon" aria-hidden="true"><slot name="icon" :item="node.item" :active="node.active" /></span>
        <span class="ui-navigation-label">{{ node.item.label }}</span>
        <span v-if="!node.item.href && node.item.routeName == null && node.children.length" aria-hidden="true">{{ expanded.has(node.item.key) ? '−' : '+' }}</span>
      </component>
      <button v-if="node.children.length && (node.item.href || node.item.routeName != null)" type="button" class="ui-navigation-toggle"
        :disabled="node.disabled" :aria-label="`${node.item.label} 하위 메뉴`" :aria-expanded="expanded.has(node.item.key)" :aria-controls="id"
        @click="emit('toggle', node.item.key)"><span aria-hidden="true">{{ expanded.has(node.item.key) ? '−' : '+' }}</span></button>
    </div>
    <ul v-if="node.children.length" v-show="expanded.has(node.item.key)" :id="id" role="list">
      <UINavigationMenuNode v-for="child in node.children" :key="child.item.key" :node="child" :expanded="expanded"
        @toggle="key => emit('toggle', key)" @select="(item, event) => emit('select', item, event)">
        <template v-if="$slots.icon" #icon="scope"><slot name="icon" v-bind="scope" /></template>
      </UINavigationMenuNode>
    </ul>
  </li>
</template>
