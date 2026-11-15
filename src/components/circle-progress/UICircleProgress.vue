<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UICircleProgressProps } from './types'

const props = withDefaults(defineProps<UICircleProgressProps>(), { size: 'default' })
const id = useId()
</script>

<template>
  <div :class="cn('ui-circle-progress inline-flex items-center justify-center', $props.class)" :data-size="size">
    <svg class="ui-circle-progress-graphic" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
      <circle class="ui-circle-progress-track" cx="20" cy="20" r="17" />
      <circle class="ui-circle-progress-indicator" cx="20" cy="20" r="17" />
    </svg>
    <span class="ui-circle-progress-label" :id="`${id}-label`">{{ label }}</span>
    <span v-if="description" class="ui-circle-progress-description" :id="`${id}-description`">{{ description }}</span>
    <span class="ui-circle-progress-semantic" role="status" aria-live="polite" aria-atomic="true" :aria-labelledby="`${id}-label`" :aria-describedby="description ? `${id}-description` : undefined">로딩 중</span>
  </div>
</template>
