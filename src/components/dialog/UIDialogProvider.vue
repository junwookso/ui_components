<script setup lang="ts">
import { defineComponent, h, nextTick, onBeforeUnmount, provide, shallowRef, type Component } from 'vue'
import UIConfirmDialog from '../confirm/UIConfirmDialog.vue'
import { confirmServiceKey } from '../confirm/context'
import type { UIConfirmService } from '../confirm/types'
import { dialogContextKey, dialogServiceKey } from './context'
import type { UIDialogContext, UIDialogService, UIDialogOptions } from './types'

interface Entry {
  component: Component
  context: UIDialogContext<unknown, unknown>
}
const active = shallowRef<Entry>()
let closing = false
let alive = true
let sequence = 0

const DialogInstance = defineComponent({
  setup() {
    const entry = active.value!
    provide(dialogContextKey, entry.context)
    return () => h(entry.component)
  },
})
const service: UIDialogService = {
  openDialog<TPayload, TResult>(component: Component, options: UIDialogOptions<TPayload, TResult>) {
    if (!alive || active.value || closing) return false
    const trigger = typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null
    let settled = false
    const finish = (callback: () => void) => {
      if (settled || !alive) return
      settled = true
      closing = true
      active.value = undefined
      void nextTick(() => {
        closing = false
        if (!alive) return
        if (trigger?.isConnected) trigger.focus()
        callback()
      })
    }
    sequence += 1
    active.value = {
      component,
      context: {
        payload: options.payload,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        complete: result => finish(() => options.onResult(result as TResult)),
        cancel: (reason = 'cancel') => finish(() => options.onCancel?.(reason)),
      },
    }
    return true
  },
}
const pendingConfirms = new Set<(value: boolean) => void>()
const confirmService: UIConfirmService = {
  confirm(options) {
    return new Promise<boolean>(resolve => {
      const settle = (value: boolean) => {
        pendingConfirms.delete(settle)
        resolve(value)
      }
      pendingConfirms.add(settle)
      const opened = service.openDialog(UIConfirmDialog, {
        payload: { ...options },
        closeOnBackdrop: options.closeOnBackdrop ?? false,
        onResult: (result: boolean) => settle(result),
        onCancel: () => settle(false),
      })
      if (!opened) settle(false)
    })
  },
}
provide(dialogServiceKey, service)
provide(confirmServiceKey, confirmService)
onBeforeUnmount(() => {
  alive = false
  active.value = undefined
  for (const settle of pendingConfirms) settle(false)
})
</script>

<template>
  <slot />
  <DialogInstance v-if="active" :key="sequence" />
</template>
