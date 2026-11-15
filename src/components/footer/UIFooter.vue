<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UIFooterProps } from './types'

withDefaults(defineProps<UIFooterProps>(), { label: '하단 정보', navigationLabel: '관련 링크' })
defineSlots<{ default?: () => unknown; navigation?: () => unknown; actions?: () => unknown }>()
</script>

<template>
  <footer :class="cn('ui-footer w-full min-w-0', $props.class)" :aria-label="label">
    <div class="ui-footer-inner">
      <div v-if="text || $slots.default" class="ui-footer-content"><slot>{{ text }}</slot></div>
      <nav v-if="$slots.navigation" class="ui-footer-navigation" :aria-label="navigationLabel"><slot name="navigation" /></nav>
      <div v-if="$slots.actions" class="ui-footer-actions"><slot name="actions" /></div>
    </div>
  </footer>
</template>
