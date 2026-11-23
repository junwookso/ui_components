import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIFileUpload from './UIFileUpload.vue'
import type { UIFileUploadFailure } from './types'

const meta = {
  title: 'Components/UIFileUpload',
  component: UIFileUpload,
  args: { label: '첨부 문서', accept: '.pdf,image/*', maxSize: 1024, multiple: true },
  render: args => ({
    components: { UIFileUpload },
    setup: () => ({ args, files: ref<readonly File[]>([]) }),
    template: `<div class="w-full max-w-sm"><UIFileUpload v-bind="args" v-model="files" /></div>`,
  }),
} satisfies Meta<typeof UIFileUpload>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Retry: Story = {
  render: () => ({
    components: { UIFileUpload },
    setup: () => {
      const file = new File(['demo'], '검토서.pdf', { type: 'application/pdf' })
      const files = ref<readonly File[]>([file])
      const failures = ref<UIFileUploadFailure[]>([{ file, message: '문서를 첨부하지 못했습니다.' }])
      const feedback = ref('')
      function retry(file: File) {
        failures.value = failures.value.filter(failure => failure.file !== file)
        feedback.value = `${file.name} 첨부를 완료했습니다.`
      }
      return { files, failures, feedback, retry }
    },
    template: `<div class="grid w-full max-w-sm gap-3">
      <UIFileUpload v-model="files" label="첨부 문서" accept=".pdf" :failures="failures" @retry="retry" />
      <p class="ui-body" role="status">{{ feedback }}</p>
    </div>`,
  }),
}
