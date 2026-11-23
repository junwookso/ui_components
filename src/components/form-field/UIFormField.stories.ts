import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UIInput from '../input/UIInput.vue'
import UISelect from '../select/UISelect.vue'
import UITextarea from '../textarea/UITextarea.vue'
import UIFormField from './UIFormField.vue'

const meta = {
  title: 'Components/UIFormField',
  component: UIFormField,
  args: { label: '업무 제목', required: false, description: '목록에서 알아보기 쉬운 이름을 입력해 주세요.' },
  render: args => ({
    components: { UIFormField, UIInput },
    setup: () => ({ args }),
    template: `
      <UIFormField v-slot="{ controlAttrs }" v-bind="args" class="w-full max-w-xs">
        <UIInput v-bind="controlAttrs" />
      </UIFormField>
    `,
  }),
} satisfies Meta<typeof UIFormField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { UIFormField, UIInput, UITextarea },
    template: `
      <div class="grid w-full max-w-xs gap-4">
        <UIFormField v-slot="{ controlAttrs }" label="요청 번호" description="요청 번호는 접수 후 자동으로 발급됩니다.">
          <UIInput v-bind="controlAttrs" disabled model-value="REQ-1042" />
        </UIFormField>
        <UIFormField v-slot="{ controlAttrs }" label="처리 사유 (검토 담당자 작성)" required
          error="요청자가 다음 조치를 알 수 있도록 처리 사유를 입력해 주세요."
          description="처리 기준과 후속 조치를 포함해 주세요.">
          <UITextarea v-bind="controlAttrs" />
        </UIFormField>
      </div>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { UIButton, UIFormField, UIInput, UISelect },
    setup: () => {
      const title = ref('')
      const team = ref('')
      const submitted = ref(false)
      const saved = ref(false)
      const teams = [{ value: 'operations', label: '운영팀' }, { value: 'support', label: '지원팀' }]
      function submit() {
        submitted.value = true
        saved.value = !!(title.value.trim() && team.value)
      }
      return { title, team, teams, submitted, saved, submit }
    },
    template: `
      <form class="grid w-full max-w-xs gap-4" novalidate @submit.prevent="submit" @input="saved = false">
        <UIFormField v-slot="{ controlAttrs }" label="업무 제목" required
          description="목록에 표시할 이름입니다." :error="submitted && !title.trim() ? '업무 제목을 입력해 주세요.' : undefined">
          <UIInput v-bind="controlAttrs" v-model="title" name="title" />
        </UIFormField>
        <UIFormField v-slot="{ controlAttrs }" label="담당 팀" required
          description="요청을 처리할 팀입니다." :error="submitted && !team ? '담당 팀을 선택해 주세요.' : undefined">
          <UISelect v-bind="controlAttrs" v-model="team" name="team" :options="teams" />
        </UIFormField>
        <div class="flex justify-end"><UIButton type="submit">저장</UIButton></div>
        <p role="status" class="ui-body">{{ saved ? '업무를 저장했습니다.' : '' }}</p>
      </form>
    `,
  }),
}
