<script setup lang="ts">
import type { UIAlertProps, UIAlertType } from './types'

withDefaults(defineProps<UIAlertProps>(), { type: 'info', announce: 'off' })
defineSlots<{
  default?: () => unknown
  icon?: () => unknown
  actions?: () => unknown
}>()

const labels: Record<UIAlertType, string> = { info: '안내', success: '성공', warning: '주의', error: '오류' }
</script>

<template>
  <div class="ui-alert" :data-type="type" :data-visible="Boolean(title || message || $slots.default)">
    <div :aria-live="announce === 'off' ? undefined : announce" :aria-atomic="announce === 'off' ? undefined : true">
      <div v-if="title || message || $slots.default" class="ui-alert-content">
        <span v-if="$slots.icon" class="ui-alert-icon" aria-hidden="true"><slot name="icon" /></span>
        <div class="ui-alert-text">
          <p class="ui-alert-kind ui-label">{{ labels[type] }}</p>
          <p v-if="title" class="ui-title">{{ title }}</p>
          <div v-if="$slots.default || message" class="ui-body">
            <slot><p class="ui-alert-message">{{ message }}</p></slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="(title || message || $slots.default) && $slots.actions" class="ui-alert-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
