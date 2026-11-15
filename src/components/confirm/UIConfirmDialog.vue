<script setup lang="ts">
import { useId } from 'vue'
import UIDialog from '../dialog/UIDialog.vue'
import UIButton from '../button/UIButton.vue'
import { useDialogContext } from '../dialog/context'
import type { UIConfirmOptions } from './types'

const { payload, complete, cancel } = useDialogContext<UIConfirmOptions, boolean>()
const messageId = `${useId()}-message`
</script>

<template>
  <UIDialog :title="payload.title" :aria-describedby="messageId">
    <p :id="messageId" class="ui-confirm-message">{{ payload.message }}</p>
    <template #actions>
      <UIButton variant="ghost" autofocus @click="cancel()">{{ payload.cancelLabel?.trim() || '취소' }}</UIButton>
      <UIButton :variant="payload.destructive ? 'destructive' : 'default'" @click="complete(true)">{{ payload.confirmLabel?.trim() || '확인' }}</UIButton>
    </template>
  </UIDialog>
</template>
