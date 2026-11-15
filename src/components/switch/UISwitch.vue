<script setup lang="ts">
import { cn } from '../../lib/cn'
import type { UISwitchProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<UISwitchProps>(), { disabled: false, falseLabel: 'False', trueLabel: 'True' })
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <span :class="cn('ui-switch relative inline-flex shrink-0 align-middle', $props.class)">
    <input v-model="model" v-bind="$attrs" type="checkbox" role="switch" :disabled="disabled" class="ui-switch-input" />
    <span class="ui-switch-track rounded-full" aria-hidden="true">
      <span class="ui-switch-option ui-switch-false">{{ falseLabel }}</span>
      <span class="ui-switch-option ui-switch-true">{{ trueLabel }}</span>
    </span>
  </span>
</template>
