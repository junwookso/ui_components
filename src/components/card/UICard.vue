<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UICardProps } from './types'

withDefaults(defineProps<UICardProps>(), { headingLevel: 2 })
defineSlots<{
  title?: () => unknown
  description?: () => unknown
  default?: () => unknown
  actions?: () => unknown
}>()
const titleId = useId()
</script>

<template>
  <section
    :aria-labelledby="title || $slots.title ? titleId : undefined"
    :class="cn('ui-card min-w-0 w-full rounded-md border border-border bg-surface text-foreground', $props.class)"
  >
    <header v-if="title || $slots.title || description || $slots.description" class="ui-card-header p-4">
      <component :is="`h${headingLevel}`" v-if="title || $slots.title" :id="titleId" class="ui-card-title ui-title">
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="description || $slots.description" class="ui-card-description ui-subtitle ui-text-muted">
        <slot name="description">{{ description }}</slot>
      </p>
    </header>
    <div v-if="$slots.default" class="ui-card-body ui-body min-w-0 p-4">
      <slot />
    </div>
    <footer v-if="$slots.actions" class="ui-card-actions flex flex-wrap items-center justify-end gap-2 p-4">
      <slot name="actions" />
    </footer>
  </section>
</template>
