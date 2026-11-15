<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UIProgressProps } from './types'

const props = withDefaults(defineProps<UIProgressProps>(), {
  max: 100, showValue: true, size: 'default', variant: 'default',
})
const id = useId()
const maximum = computed(() => Number.isFinite(props.max) && props.max > 0 ? props.max : 100)
const current = computed(() => typeof props.value === 'number' && Number.isFinite(props.value)
  ? Math.min(maximum.value, Math.max(0, props.value)) : undefined)
const percent = computed(() => current.value === undefined ? undefined : current.value / maximum.value * 100)
const text = computed(() => props.valueText?.trim() || (percent.value === undefined ? '진행 중' : `${Math.floor(percent.value)}%`))
</script>

<template>
  <div :class="cn('ui-progress grid gap-2', $props.class)" :data-size="size" :data-variant="variant" :data-indeterminate="current === undefined">
    <div class="ui-progress-header flex items-start justify-between gap-3">
      <span :id="`${id}-label`" class="ui-progress-label">{{ label }}</span>
      <span v-if="showValue" class="ui-progress-value" aria-hidden="true">{{ text }}</span>
    </div>
    <progress class="ui-progress-native" :value="current" :max="maximum" :aria-labelledby="`${id}-label`" :aria-describedby="description ? `${id}-description` : undefined" :aria-valuetext="text" />
    <div class="ui-progress-track" aria-hidden="true">
      <div class="ui-progress-fill" :style="{ width: percent === undefined ? undefined : `${percent}%` }" />
    </div>
    <p v-if="description" :id="`${id}-description`" class="ui-progress-description">{{ description }}</p>
  </div>
</template>
