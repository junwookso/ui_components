<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import UIButton from '../button/UIButton.vue'
import { cn } from '../../lib/cn'
import { createDialogBackdrop } from '../../lib/dialog-backdrop'
import { lockBodyScroll } from '../../lib/scroll-lock'
import type { UIDrawerDismissReason, UIDrawerProps } from './types'

withDefaults(defineProps<UIDrawerProps>(), { side: 'right', size: 'default', closeOnBackdrop: true })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ dismiss: [reason: UIDrawerDismissReason] }>()
defineSlots<{ default?: (props: { close: () => void }) => unknown; actions?: (props: { close: () => void }) => unknown }>()
const dialog = ref<HTMLDialogElement>()
const id = useId()
let releaseScroll: (() => void) | undefined
let trigger: HTMLElement | null = null
const backdrop = createDialogBackdrop()
function restore() {
  releaseScroll?.()
  releaseScroll = undefined
  if (trigger?.isConnected) trigger.focus()
  trigger = null
  backdrop.reset()
}
function sync() {
  const element = dialog.value
  if (!element) return
  if (open.value && !element.open) {
    trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    element.showModal()
    releaseScroll = lockBodyScroll(document)
  } else if (!open.value) {
    if (element.open) element.close()
    restore()
  }
}
function dismiss(reason: UIDrawerDismissReason) {
  if (!open.value) return
  open.value = false
  emit('dismiss', reason)
}
function nativeClose() {
  // A delayed close event from a previous opening must not close a reopened drawer.
  if (!dialog.value?.open) dismiss('native')
}
watch(open, sync, { flush: 'post' })
onMounted(sync)
onBeforeUnmount(() => { dialog.value?.close(); restore() })
</script>

<template>
  <dialog ref="dialog" :class="cn('ui-drawer', $props.class)" :data-side="side" :data-size="size"
    :aria-labelledby="`${id}-title`" :aria-describedby="description ? `${id}-description` : undefined" aria-modal="true"
    @cancel.prevent="dismiss('escape')" @close="nativeClose"
    @pointerdown="backdrop.pointerDown" @pointercancel="backdrop.reset"
    @click="backdrop.click($event) && closeOnBackdrop && dismiss('backdrop')">
    <template v-if="open">
      <header class="ui-drawer-header">
        <div class="ui-drawer-heading"><h2 :id="`${id}-title`" class="ui-title">{{ title }}</h2><p v-if="description" :id="`${id}-description`" class="ui-drawer-description ui-subtitle ui-text-muted">{{ description }}</p></div>
        <UIButton variant="ghost" size="sm" :aria-label="closeLabel || `${title} 닫기`" @click="dismiss('close-button')">닫기</UIButton>
      </header>
      <div class="ui-drawer-body ui-body"><slot :close="() => dismiss('action')" /></div>
      <footer v-if="$slots.actions" class="ui-drawer-actions"><slot name="actions" :close="() => dismiss('action')" /></footer>
    </template>
  </dialog>
</template>
