<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UITopbarProps } from './types'

withDefaults(defineProps<UITopbarProps>(), {
  label: '상단 바', navigationLabel: '주요 메뉴', sticky: false, variant: 'default',
})
defineSlots<{
  leading?: () => unknown
  brand?: () => unknown
  navigation?: () => unknown
  search?: () => unknown
  actions?: () => unknown
}>()
</script>

<template>
  <header :class="cn('ui-topbar w-full min-w-0', $props.class)" :aria-label="label" :data-sticky="sticky" :data-variant="variant">
    <div class="ui-topbar-inner">
      <div class="ui-topbar-start">
        <div v-if="$slots.leading" class="ui-topbar-leading"><slot name="leading" /></div>
        <div class="ui-topbar-brand"><slot name="brand">{{ title }}</slot></div>
      </div>
      <nav v-if="$slots.navigation" class="ui-topbar-navigation" :aria-label="navigationLabel"><slot name="navigation" /></nav>
      <div v-if="$slots.search" class="ui-topbar-search"><slot name="search" /></div>
      <div v-if="$slots.actions" class="ui-topbar-actions"><slot name="actions" /></div>
    </div>
  </header>
</template>
