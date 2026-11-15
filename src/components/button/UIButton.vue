<script setup lang="ts">
import { cn } from '../../lib/cn'
import { buttonVariants, type UIButtonProps } from './variants'

const emit = defineEmits<{ click: [event: MouseEvent] }>()

withDefaults(defineProps<UIButtonProps>(), {
  variant: 'default',
  size: 'default',
  type: 'button',
  disabled: false,
  loading: false,
})
</script>

<template>
  <button
    @click="emit('click', $event)"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="cn(buttonVariants({ variant, size }), $props.class)"
  >
    <svg v-if="loading" class="ui-button-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
    </svg>
    <slot />
  </button>
</template>
