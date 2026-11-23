<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import UIButton from '../button/UIButton.vue'
import type { UIDropdownMenuItem, UIDropdownMenuProps } from './types'

defineProps<UIDropdownMenuProps>()
defineEmits<{ select: [item: UIDropdownMenuItem] }>()
defineSlots<{ icon?: () => unknown }>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child :disabled="disabled || !items.length">
      <UIButton variant="outline" size="sm">
        <span v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></span>
        {{ label }}
      </UIButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :side-offset="4" :collision-padding="8" loop class="ui-dropdown-menu">
      <DropdownMenuItem
        v-for="item in items"
        :key="item.id"
        :disabled="item.disabled"
        :data-destructive="item.destructive || undefined"
        class="ui-dropdown-menu-item"
        @select="$emit('select', item)"
      >{{ item.label }}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
