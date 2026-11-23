import { onUnmounted, ref, useId } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UIFormField from '../form-field/UIFormField.vue'
import UICombobox from './UICombobox.vue'
import type { UIComboboxOption } from './types'

const employees: UIComboboxOption[] = [
  { value: '101', label: '김민수 · 운영지원팀', keywords: ['EMP-101'] },
  { value: '102', label: '이서연 · 플랫폼팀', keywords: ['EMP-102'], disabled: true },
  { value: '103', label: '박지훈 · 플랫폼팀', keywords: ['EMP-103'] },
  { value: '104', label: '최유진 · 재무팀', keywords: ['EMP-104'] },
]

const meta = {
  title: 'Components/UICombobox',
  component: UICombobox,
  args: { options: employees },
  render: args => ({
    components: { UICombobox, UIFormField },
    setup: () => ({ args }),
    template: `
      <UIFormField class="w-full max-w-xs" v-slot="{ controlAttrs }" label="담당자" description="이름, 소속 또는 사번으로 검색하세요.">
        <UICombobox v-bind="{ ...controlAttrs, ...args }" />
      </UIFormField>
    `,
  }),
} satisfies Meta<typeof UICombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Disabled: Story = { args: { disabled: true, modelValue: '101' } }
export const Empty: Story = { args: { options: [] } }

export const Remote: Story = {
  render: () => ({
    components: { UICombobox, UIFormField },
    setup: () => {
      const value = ref('101')
      const options = ref<UIComboboxOption[]>([])
      const loading = ref(false)
      const error = ref('')
      let timer: ReturnType<typeof setTimeout> | undefined

      function search(query: string) {
        clearTimeout(timer)
        error.value = ''
        options.value = []
        loading.value = !!query.trim()
        if (!loading.value) return
        timer = setTimeout(() => {
          const term = query.trim().toLowerCase()
          if (term === '실패') error.value = '직원을 불러오지 못했습니다. 검색어를 바꿔 다시 시도해 주세요.'
          else options.value = employees.filter(option => option.label.toLowerCase().includes(term))
          loading.value = false
        }, 600)
      }

      onUnmounted(() => clearTimeout(timer))
      return { value, options, loading, error, search, initial: employees[0] }
    },
    template: `
      <UIFormField class="w-full max-w-xs" v-slot="{ controlAttrs }" label="담당자 검색" description="이름을 입력하세요. ‘실패’를 입력하면 조회 오류를 확인할 수 있습니다.">
        <UICombobox v-bind="controlAttrs" v-model="value" :options="options" :selected-option="initial"
          remote :loading="loading" :error="error" @search="search" />
      </UIFormField>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { UIButton, UICombobox, UIFormField },
    setup: () => {
      const value = ref('')
      const submitted = ref('')
      const formId = `combobox-form-${useId()}`
      function submit(event: SubmitEvent) {
        const form = event.currentTarget as HTMLFormElement
        submitted.value = String(new FormData(form).get('assignee'))
      }
      return { employees, value, formId, submitted, submit }
    },
    template: `
      <div class="grid w-full max-w-xs gap-4">
        <UIFormField v-slot="{ controlAttrs }" label="업무 담당자" required>
          <UICombobox v-bind="controlAttrs" v-model="value" :options="employees" name="assignee" :form="formId" />
        </UIFormField>
        <form :id="formId" class="flex justify-end" @submit.prevent="submit"><UIButton type="submit">적용</UIButton></form>
        <p class="ui-body" data-testid="submitted">{{ submitted }}</p>
      </div>
    `,
  }),
}
