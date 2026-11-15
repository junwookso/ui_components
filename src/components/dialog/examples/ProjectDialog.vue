<script setup lang="ts">
import { ref, useId } from 'vue'
import UIDialog from '../UIDialog.vue'
import { useDialogContext } from '../context'
import UIButton from '../../button/UIButton.vue'
import UIInput from '../../input/UIInput.vue'
import type { ProjectPayload, ProjectResult } from './types'

const { payload, complete, cancel } = useDialogContext<ProjectPayload, ProjectResult>()
const name = ref(payload.name)
const error = ref(false)
const id = useId()
function submit() {
  error.value = !name.value.trim()
  if (!error.value) complete({ name: name.value.trim() })
}
</script>

<template>
  <UIDialog title="프로젝트 편집" description="프로젝트 이름을 입력하고 완료를 눌러 주세요.">
    <form :id="id + '-form'" @submit.prevent="submit">
      <label class="field-label ui-label" :for="id + '-name'">프로젝트 이름</label>
      <UIInput :id="id + '-name'" v-model="name" autofocus :aria-invalid="error || undefined" :aria-describedby="error ? id + '-error' : undefined" />
      <p v-if="error" :id="id + '-error'" role="alert" class="field-error ui-body">프로젝트 이름을 입력해 주세요.</p>
      <template v-if="payload.longContent"><p v-for="n in 30" :key="n">{{ n }}. 프로젝트 설정 안내입니다. 내용을 확인한 후 입력을 완료해 주세요.</p></template>
    </form>
    <template #actions>
      <UIButton variant="ghost" @click="cancel()">취소</UIButton>
      <UIButton type="submit" :form="id + '-form'">완료</UIButton>
    </template>
  </UIDialog>
</template>
