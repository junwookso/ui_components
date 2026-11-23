<script setup lang="ts">
import type { UIBreadcrumbItem, UIBreadcrumbProps } from './types'

withDefaults(defineProps<UIBreadcrumbProps>(), { label: '현재 위치' })
const emit = defineEmits<{ navigate: [item: UIBreadcrumbItem, event: MouseEvent] }>()
</script>

<template>
  <nav v-if="items.length" :aria-label="label" class="min-w-0">
    <ol role="list" class="ui-body m-0 flex list-none flex-wrap items-baseline gap-x-2 gap-y-1 p-0 ui-text-muted">
      <li v-for="(item, index) in items" :key="item.key" class="flex min-w-0 max-w-full items-baseline gap-2">
        <span v-if="index > 0" aria-hidden="true" class="shrink-0">/</span>
        <span v-if="index === items.length - 1" aria-current="page" class="min-w-0 font-medium text-foreground [overflow-wrap:anywhere]">
          {{ item.label }}
        </span>
        <a
          v-else-if="item.href"
          :href="item.href"
          :target="item.target"
          :rel="item.rel ?? (item.target === '_blank' ? 'noopener' : undefined)"
          class="min-w-0 rounded-sm text-foreground underline underline-offset-2 [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          @click="emit('navigate', item, $event)"
        >{{ item.label }}</a>
        <span v-else class="min-w-0 [overflow-wrap:anywhere]">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
