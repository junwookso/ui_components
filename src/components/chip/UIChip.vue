<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UIChipProps } from './types'

const props = withDefaults(defineProps<UIChipProps>(), {
  variant: 'default', size: 'default', shape: 'rect', removable: false, disabled: false,
})
const emit = defineEmits<{ remove: [event: MouseEvent] }>()
defineSlots<{ icon?: () => unknown }>()
function remove(event: MouseEvent) {
  if (!props.disabled) emit('remove', event)
}
</script>

<template>
  <span :class="cn('ui-chip inline-flex items-center gap-1', $props.class)" :data-variant="variant" :data-size="size" :data-shape="shape" :data-disabled="disabled" :data-removable="removable">
    <span v-if="$slots.icon" class="ui-chip-icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="ui-chip-label">{{ label }}</span>
    <button v-if="removable" class="ui-chip-remove" type="button" :disabled="disabled" :aria-label="removeLabel || `${label} 제거`" @click.stop="remove">
      <span class="ui-chip-cross" aria-hidden="true" />
    </button>
  </span>
</template>
