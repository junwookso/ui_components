<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { createDialogBackdrop } from '../../lib/dialog-backdrop'
import { lockBodyScroll } from '../../lib/scroll-lock'
import { cn } from '../../lib/cn'
import { useDialogContext } from './context'
import type { UIDialogProps } from './types'

defineProps<UIDialogProps>()
const { cancel, closeOnBackdrop } = useDialogContext<unknown, unknown>()
const dialog = ref<HTMLDialogElement>()
const id = useId()
let releaseScroll: (() => void) | undefined
const backdrop = createDialogBackdrop()
function backdropClick(event: MouseEvent) {
  if (backdrop.click(event) && closeOnBackdrop) cancel('backdrop')
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
    @pointerdown="backdrop.pointerDown" @pointercancel="backdrop.reset" @click="backdropClick">
    <header class="ui-dialog-header">
      <h2 :id="`${id}-title`" class="ui-dialog-title ui-title">{{ title }}</h2>
      <p v-if="description" :id="`${id}-description`" class="ui-dialog-description ui-subtitle ui-text-muted">{{ description }}</p>
    </header>
    <div class="ui-dialog-body ui-body"><slot /></div>
    <footer v-if="$slots.actions" class="ui-dialog-actions"><slot name="actions" /></footer>
  </dialog>
</template>
