<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UIDescriptionItem, UIDescriptionsProps } from './types'

withDefaults(defineProps<UIDescriptionsProps>(), {
  headingLevel: 2, bordered: true, layout: 'horizontal', emptyValue: '미등록', emptyText: '표시할 정보가 없습니다.',
})
defineSlots<{
  value?: (props: { item: UIDescriptionItem; value: UIDescriptionItem['value'] }) => unknown
  [name: `value-${string}`]: ((props: { item: UIDescriptionItem; value: UIDescriptionItem['value'] }) => unknown) | undefined
}>()
const id = useId()
function isEmpty(value: UIDescriptionItem['value']) {
  return value === null || value === undefined || (typeof value === 'string' && !value.trim())
}
function format(value: UIDescriptionItem['value']) {
  return typeof value === 'boolean' ? value ? '예' : '아니요' : value
}
</script>

<template>
  <section :class="cn('ui-descriptions min-w-0 w-full', $props.class)" :aria-labelledby="`${id}-heading`" :data-bordered="bordered" :data-layout="layout">
    <component :is="`h${headingLevel}`" :id="`${id}-heading`" class="ui-descriptions-heading ui-title">{{ label }}</component>
    <dl v-if="items.length" class="ui-descriptions-list">
      <div v-for="item in items" :key="item.key" class="ui-descriptions-row">
        <dt class="ui-descriptions-term">{{ item.label }}</dt>
        <dd class="ui-descriptions-detail">
          <slot :name="`value-${item.key}`" :item="item" :value="item.value">
            <slot name="value" :item="item" :value="item.value">
              <span :class="{ 'ui-text-muted': isEmpty(item.value) }">{{ isEmpty(item.value) ? emptyValue : format(item.value) }}</span>
            </slot>
          </slot>
        </dd>
      </div>
    </dl>
    <p v-else class="ui-descriptions-empty ui-body ui-text-muted">{{ emptyText }}</p>
  </section>
</template>
