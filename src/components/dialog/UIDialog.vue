<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { lockBodyScroll } from '../../lib/scroll-lock'
import { cn } from '../../lib/cn'
import { useDialogContext } from './context'
import type { UIDialogProps } from './types'

defineProps<UIDialogProps>()
const { cancel, closeOnBackdrop } = useDialogContext<unknown, unknown>()
const dialog = ref<HTMLDialogElement>()
const id = useId()
let releaseScroll: (() => void) | undefined
let outsidePress = false
function outside(event: MouseEvent) {
  const rect = dialog.value!.getBoundingClientRect()
  return event.target === dialog.value && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
}
function backdropClick(event: MouseEvent) {
  if (closeOnBackdrop && outsidePress && outside(event)) cancel('backdrop')
  outsidePress = false
}
onMounted(() => {
  dialog.value!.showModal()
  releaseScroll = lockBodyScroll(document)
})
onBeforeUnmount(() => {
  dialog.value?.close()
  releaseScroll?.()
})
</script>

<template>
  <dialog ref="dialog" :class="cn('ui-dialog', $props.class)" :aria-labelledby="`${id}-title`"
    :aria-describedby="description ? `${id}-description` : undefined" aria-modal="true"
    @cancel.prevent="cancel('escape')" @close="cancel()"
    @pointerdown="outsidePress = outside($event)" @click="backdropClick">
    <header class="ui-dialog-header">
      <h2 :id="`${id}-title`" class="ui-dialog-title ui-title">{{ title }}</h2>
      <p v-if="description" :id="`${id}-description`" class="ui-dialog-description ui-subtitle ui-text-muted">{{ description }}</p>
    </header>
    <div class="ui-dialog-body ui-body"><slot /></div>
    <footer v-if="$slots.actions" class="ui-dialog-actions"><slot name="actions" /></footer>
  </dialog>
</template>
