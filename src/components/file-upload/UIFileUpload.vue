<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue'
import UIButton from '../button/UIButton.vue'
import type { UIFileUploadProps } from './types'

const props = defineProps<UIFileUploadProps>()
const model = defineModel<readonly File[]>({ default: () => [] })
const emit = defineEmits<{ retry: [file: File] }>()
const id = useId()
const picker = useTemplateRef<HTMLInputElement>('picker')
const errors = ref<string[]>([])
const filters = computed(() => props.accept?.toLowerCase().split(',').map(token => token.trim()).filter(Boolean) ?? [])
const failures = computed(() => new Map(props.failures?.map(({ file, message }) => [file, message])))

function accepts(file: File) {
  return !filters.value.length || filters.value.some(token => {
    if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token)
    if (token.endsWith('/*')) return file.type.toLowerCase().startsWith(token.slice(0, -1))
    return file.type.toLowerCase() === token
  })
}

function choose(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  const accepted: File[] = []
  const rejected: string[] = []
  for (const file of files) {
    if (!accepts(file)) rejected.push(`${file.name}: 허용되지 않는 파일 형식입니다.`)
    else if (props.maxSize !== undefined && file.size > props.maxSize) rejected.push(`${file.name}: 파일 크기 제한을 초과했습니다.`)
    else accepted.push(file)
  }
  errors.value = rejected
  if (accepted.length) model.value = props.multiple ? [...model.value, ...accepted] : accepted.slice(0, 1)
}

async function remove(index: number) {
  model.value = model.value.filter((_, position) => position !== index)
  await nextTick()
  picker.value?.focus()
}
</script>

<template>
  <div class="grid min-w-0 gap-2">
    <label :for="id" class="ui-label">{{ label }}</label>
    <div class="ui-file-control" :data-disabled="disabled || undefined">
      <span class="ui-file-control-action" aria-hidden="true">파일 선택</span>
      <span v-if="model.length" aria-hidden="true">{{ model.length }}개 선택</span>
      <input
        :id="id"
        ref="picker"
        type="file"
        class="ui-file-picker"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-describedby="accept || maxSize !== undefined ? `${id}-constraints` : undefined"
        @change="choose"
      />
    </div>
    <p v-if="accept || maxSize !== undefined" :id="`${id}-constraints`" class="ui-body ui-text-muted [overflow-wrap:anywhere]">
      <span v-if="accept">허용 형식 {{ accept }}</span>
      <span v-if="accept && maxSize !== undefined"> · </span>
      <span v-if="maxSize !== undefined">파일당 최대 {{ maxSize.toLocaleString('ko-KR') }}바이트</span>
    </p>
    <div role="status" class="ui-body text-destructive [overflow-wrap:anywhere]">
      <p v-for="(error, index) in errors" :key="index" class="m-0">{{ error }}</p>
    </div>
    <ul v-if="model.length" role="list" aria-label="선택한 파일" class="m-0 grid list-none gap-2 p-0">
      <li v-for="(file, index) in model" :key="index" class="grid min-w-0 gap-2 rounded-md border border-border bg-surface p-3">
        <p class="ui-body [overflow-wrap:anywhere]">{{ file.name }}</p>
        <p v-if="failures.get(file)" class="ui-body text-destructive">{{ failures.get(file) }}</p>
        <div class="flex flex-wrap justify-end gap-2">
          <UIButton v-if="failures.get(file)" variant="outline" size="sm" :disabled="disabled" :aria-label="`${file.name} 다시 시도`" @click="emit('retry', file)">다시 시도</UIButton>
          <UIButton variant="ghost" size="sm" :disabled="disabled" :aria-label="`${file.name} 제거`" @click="remove(index)">제거</UIButton>
        </div>
      </li>
    </ul>
  </div>
</template>
