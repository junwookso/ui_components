<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UIListItem, UIListProps } from './types'

withDefaults(defineProps<UIListProps>(), {
  headingLevel: 2, bordered: true, size: 'default', emptyText: '표시할 항목이 없습니다.',
})
defineSlots<{
  leading?: (props: { item: UIListItem; index: number }) => unknown
  title?: (props: { item: UIListItem; index: number }) => unknown
  description?: (props: { item: UIListItem; index: number }) => unknown
  meta?: (props: { item: UIListItem; index: number }) => unknown
  actions?: (props: { item: UIListItem; index: number }) => unknown
  empty?: () => unknown
}>()
const id = useId()
</script>

<template>
  <section :class="cn('ui-list min-w-0 w-full', $props.class)" :aria-labelledby="`${id}-heading`" :data-bordered="bordered" :data-size="size">
    <component :is="`h${headingLevel}`" :id="`${id}-heading`" class="ui-list-heading ui-title">{{ label }}</component>
    <ul v-if="items.length" class="ui-list-items" role="list" :aria-labelledby="`${id}-heading`">
      <li v-for="(item, index) in items" :key="item.key" class="ui-list-row">
        <div v-if="$slots.leading" class="ui-list-leading"><slot name="leading" :item="item" :index="index" /></div>
        <div class="ui-list-content">
          <div class="ui-list-title"><slot name="title" :item="item" :index="index">{{ item.title }}</slot></div>
          <div v-if="item.description || $slots.description" class="ui-list-description"><slot name="description" :item="item" :index="index">{{ item.description }}</slot></div>
        </div>
        <div v-if="$slots.meta || $slots.actions" class="ui-list-trailing">
          <div v-if="$slots.meta" class="ui-list-meta"><slot name="meta" :item="item" :index="index" /></div>
          <div v-if="$slots.actions" class="ui-list-actions"><slot name="actions" :item="item" :index="index" /></div>
        </div>
      </li>
    </ul>
    <div v-else class="ui-list-empty"><slot name="empty">{{ emptyText }}</slot></div>
  </section>
</template>
