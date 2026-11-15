<script setup lang="ts">
import { computed } from 'vue'
import type { TreeController, UITreeItem } from './types'
const props = defineProps<{ item: UITreeItem; level: number; disabled?: boolean; controller: TreeController }>()
const blocked = computed(() => props.disabled || props.item.disabled)
const branch = computed(() => !!props.item.children?.length)
const open = computed(() => props.controller.expanded.has(props.item.value))
defineSlots<{ icon?: (props: { item: UITreeItem; expanded: boolean; selected: boolean }) => unknown }>()
</script>

<template>
  <li
    :ref="el => controller.register(item.value, el)"
    role="treeitem"
    class="ui-tree-item"
    :aria-label="item.label"
    :aria-expanded="branch ? open : undefined"
    :aria-selected="blocked ? undefined : controller.selected === item.value"
    :aria-disabled="blocked || undefined"
    :tabindex="!blocked && controller.tabStop === item.value ? 0 : -1"
    @focus.stop="controller.focus(item.value)"
    @keydown.stop="!blocked && controller.keydown($event, item)"
  >
    <div class="ui-tree-row flex items-center gap-2" :style="{ paddingInlineStart: `${0.5 + (level - 1) * 1.25}rem` }" @mousedown="blocked && $event.preventDefault()" @click.stop="!blocked && controller.select(item)">
      <span class="ui-tree-toggle" aria-hidden="true" @click.stop="!blocked && controller.toggle(item)">
        <span v-if="branch" class="ui-tree-chevron" :data-expanded="open" />
      </span>
      <span v-if="$slots.icon" class="ui-tree-icon" aria-hidden="true"><slot name="icon" :item="item" :expanded="open" :selected="controller.selected === item.value" /></span>
      <span class="ui-tree-label">{{ item.label }}</span>
    </div>
    <ul v-if="branch && open" role="group" class="ui-tree-group">
      <UITreeNode v-for="child in item.children" :key="child.value" :item="child" :level="level + 1" :disabled="blocked" :controller="controller">
        <template v-if="$slots.icon" #icon="scope"><slot name="icon" v-bind="scope" /></template>
      </UITreeNode>
    </ul>
  </li>
</template>
