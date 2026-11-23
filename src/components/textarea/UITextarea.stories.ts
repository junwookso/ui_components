import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UITextarea from './UITextarea.vue'

const meta = {
  title: 'Components/UITextarea',
  component: UITextarea,
  args: { rows: 3, resize: 'vertical', disabled: false, readonly: false, invalid: false, required: false },
  argTypes: {
    resize: { control: 'select', options: ['vertical', 'none'] },
  },
  render: args => ({
    components: { UITextarea },
    setup: () => ({ args }),
    template: `
      <div class="grid w-full max-w-xs gap-2">
        <label for="textarea-playground" class="ui-label">업무 메모</label>
        <UITextarea id="textarea-playground" v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof UITextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { UITextarea },
    template: `
      <div class="grid w-full max-w-xs gap-4">
        <div class="grid gap-2">
          <label for="textarea-disabled" class="ui-label">접수 메모</label>
          <UITextarea id="textarea-disabled" :rows="2" disabled model-value="접수 전에는 메모를 수정할 수 없습니다." />
        </div>
        <div class="grid gap-2">
          <label for="textarea-readonly" class="ui-label">이전 검토 내용</label>
          <UITextarea id="textarea-readonly" :rows="2" readonly resize="none" model-value="검토를 마쳤으며 첨부 문서를 담당 팀에 전달했습니다." />
        </div>
        <div class="grid gap-2">
          <label for="textarea-error" class="ui-label">반려 사유 (필수)</label>
          <UITextarea id="textarea-error" required invalid aria-describedby="textarea-error-message" />
          <p id="textarea-error-message" class="ui-body text-destructive">신청자가 내용을 수정할 수 있도록 반려 사유를 입력해 주세요.</p>
        </div>
      </div>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { UIButton, UITextarea },
    setup: () => {
      const note = ref('')
      const saved = ref(false)
      function submit() {
        saved.value = true
      }
      function reset() {
        note.value = ''
        saved.value = false
      }
      return { note, saved, submit, reset }
    },
    template: `
      <form class="grid w-full max-w-xs gap-4" @submit.prevent="submit" @reset.prevent="reset">
        <div class="grid gap-2">
          <label for="textarea-note" class="ui-label">처리 사유 (필수)</label>
          <UITextarea id="textarea-note" v-model="note" name="note" required :minlength="5" :maxlength="24"
            aria-describedby="textarea-note-help" @input="saved = false" />
          <p id="textarea-note-help" class="ui-body ui-text-muted">처리 사유를 5~24자로 입력해 주세요.</p>
        </div>
        <div class="flex justify-end gap-2">
          <UIButton type="reset" variant="outline">초기화</UIButton>
          <UIButton type="submit">저장</UIButton>
        </div>
        <p role="status" class="ui-body">{{ saved ? '처리 사유를 저장했습니다.' : '' }}</p>
      </form>
    `,
  }),
}
