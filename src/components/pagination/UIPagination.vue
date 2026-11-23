<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { cn } from '../../lib/cn'
import UIButton from '../button/UIButton.vue'
import type { UIPaginationProps } from './types'

const props = withDefaults(defineProps<UIPaginationProps>(), { label: '페이지 이동' })
const page = defineModel<number>('page', { default: 1 })
const navigation = ref<HTMLElement>()

const count = computed(() => Number.isSafeInteger(props.pageCount) ? Math.max(0, props.pageCount) : 0)
const current = computed(() => Math.min(Math.max(Number.isSafeInteger(page.value) ? page.value : 1, 1), Math.max(1, count.value)))
const pages = computed(() => {
  const last = count.value
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1)
  if (current.value <= 4) return [1, 2, 3, 4, 5, 'after', last] as const
  if (current.value >= last - 3) return [1, 'before', last - 4, last - 3, last - 2, last - 1, last] as const
  return [1, 'before', current.value - 1, current.value, current.value + 1, 'after', last] as const
})

async function goTo(value: number, event: MouseEvent) {
  if (props.disabled || value < 1 || value > count.value || value === current.value) return
  const trigger = event.currentTarget as HTMLButtonElement
  const hadFocus = trigger === trigger.ownerDocument.activeElement
  page.value = value
  await nextTick()
  const active = trigger.ownerDocument.activeElement
  if (hadFocus && trigger.disabled && (active === trigger || active === trigger.ownerDocument.body)) {
    navigation.value?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus()
  }
}
</script>

<template>
  <nav v-if="count > 1" ref="navigation" :aria-label="label" :class="cn('ui-pagination', $props.class)">
    <ul class="ui-pagination-pages" role="list">
      <li>
        <UIButton size="sm" variant="outline" :disabled="disabled || current === 1" @click="goTo(current - 1, $event)">이전</UIButton>
      </li>
      <li v-for="item in pages" :key="item" :aria-hidden="typeof item !== 'number' || undefined">
        <UIButton
          v-if="typeof item === 'number'"
          size="sm"
          variant="outline"
          class="ui-pagination-page px-1.5 tabular-nums aria-[current=page]:font-semibold enabled:aria-[current=page]:bg-selected enabled:aria-[current=page]:text-selected-foreground enabled:aria-[current=page]:hover:bg-selected"
          :aria-label="`${item} 페이지`"
          :aria-current="item === current ? 'page' : undefined"
          :disabled="disabled"
          @click="goTo(item, $event)"
        >{{ item }}</UIButton>
        <span v-else class="ui-pagination-ellipsis">…</span>
      </li>
      <li>
        <UIButton size="sm" variant="outline" :disabled="disabled || current === count" @click="goTo(current + 1, $event)">다음</UIButton>
      </li>
    </ul>
  </nav>
</template>
