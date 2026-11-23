<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '../../lib/cn'
import UINavigationMenuNode from './UINavigationMenuNode.vue'
import type { NavigationNode, UINavigationMenuItem, UINavigationMenuProps } from './types'
const props = withDefaults(defineProps<UINavigationMenuProps>(), { label: '주요 메뉴' })
const emit = defineEmits<{ select: [item: UINavigationMenuItem, event: MouseEvent] }>()
defineSlots<{ icon?: (props: { item: UINavigationMenuItem; active: boolean }) => unknown }>()
const expanded = ref(new Set<string>())
const nodes = computed(() => {
  function build(items: readonly UINavigationMenuItem[], depth: number, disabled = false): NavigationNode[] {
    return items.map(item => {
      const children = depth < 3 ? build(item.children ?? [], depth + 1, disabled || !!item.disabled) : []
      return { item, children, disabled: disabled || !!item.disabled,
        active: item.routeName != null && item.routeName === props.currentRouteName,
        ancestor: children.some(child => child.active || child.ancestor) }
    })
  }
  return build(props.items, 1)
})
watch(nodes, tree => {
  const keys = new Set<string>()
  function visit(list: NavigationNode[]) {
    for (const node of list) {
      if (node.children.length && (node.ancestor || expanded.value.has(node.item.key))) keys.add(node.item.key)
      visit(node.children)
    }
  }
  visit(tree)
  expanded.value = keys
}, { immediate: true })
function toggle(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}
</script>
<template>
  <nav :aria-label="label" :class="cn('ui-navigation-menu w-full min-w-0', props.class)">
    <ul role="list">
      <UINavigationMenuNode v-for="node in nodes" :key="node.item.key" :node="node" :expanded="expanded"
        @toggle="toggle" @select="(item, event) => emit('select', item, event)">
        <template v-if="$slots.icon" #icon="scope"><slot name="icon" v-bind="scope" /></template>
      </UINavigationMenuNode>
    </ul>
  </nav>
</template>
