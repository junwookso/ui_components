<script setup lang="ts">
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { computed, watch } from 'vue'
import { cn } from '../../lib/cn'
import type { UITooltipProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<UITooltipProps>(), { side: 'top', delayDuration: 400 })
defineSlots<{ default: () => unknown }>()

const open = defineModel<boolean>('open')
const disabled = computed(() => props.disabled || !props.text.trim())
const isOpen = computed({
  get: () => !disabled.value && (open.value ?? false),
  set: value => {
    if (!value || !disabled.value) open.value = value
  },
})

watch(disabled, value => {
  if (value && open.value) open.value = false
})
</script>

<template>
  <TooltipProvider>
    <TooltipRoot v-model:open="isOpen" :disabled="disabled" :delay-duration="delayDuration" ignore-non-keyboard-focus>
      <TooltipTrigger as-child><slot /></TooltipTrigger>
      <TooltipContent
        v-bind="$attrs"
        :class="cn('ui-tooltip', $props.class)"
        :aria-label="text"
        :side="side"
        :side-offset="6"
        :collision-padding="8"
        hide-when-detached
      >
        <span aria-hidden="true">{{ text }}</span>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
