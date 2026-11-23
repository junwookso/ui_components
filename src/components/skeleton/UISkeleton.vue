<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UISkeletonProps } from './types'

withDefaults(defineProps<UISkeletonProps>(), { shape: 'line', pulse: false })
</script>

<template>
  <div :class="cn('ui-skeleton', $props.class)" :data-shape="shape" :data-pulse="pulse || undefined" aria-hidden="true" />
</template>
