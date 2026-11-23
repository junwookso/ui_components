import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UIAlert from './UIAlert.vue'

const meta = {
  title: 'Components/UIAlert',
  component: UIAlert,
  args: { type: 'info', title: '일괄 검토 안내', message: '선택한 요청에 같은 검토 기준을 적용합니다.', announce: 'off' },
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    announce: { control: 'select', options: ['off', 'polite', 'assertive'] },
  },
  render: args => ({
    components: { UIAlert },
    setup: () => ({ args }),
    template: '<div class="w-full max-w-md"><UIAlert v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UIAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Types: Story = {
  render: () => ({
    components: { UIAlert },
    template: `
      <div class="grid w-full max-w-md gap-3">
        <UIAlert title="열람 범위" message="이 문서는 담당 팀에서 열람할 수 있습니다." />
        <UIAlert type="success" title="검토 완료" message="이 요청의 검토 기록을 열람할 수 있습니다." />
        <UIAlert type="warning" title="승인 기한 임박" message="내일 업무 종료 전까지 결재를 완료해 주세요." />
        <UIAlert type="error" title="첨부 문서 누락" message="승인에 필요한 문서를 추가해 주세요." />
      </div>
    `,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: { UIAlert, UIButton },
    setup: () => ({ showDetails: ref(false) }),
    template: `
      <div class="grid w-full max-w-md gap-3">
        <UIAlert type="error" title="첨부 문서 누락">
          승인 요청을 제출하려면 최신 검토 보고서를 첨부해 주세요.
          <template #actions>
            <UIButton variant="outline" size="sm" aria-controls="alert-attachments" :aria-expanded="showDetails"
              @click="showDetails = !showDetails">{{ showDetails ? '첨부 안내 접기' : '첨부 안내 보기' }}</UIButton>
          </template>
        </UIAlert>
        <p v-show="showDetails" id="alert-attachments" class="ui-body">검토 보고서는 PDF로 첨부해 주세요.</p>
      </div>
    `,
  }),
}

export const Announcements: Story = {
  render: () => ({
    components: { UIAlert, UIButton },
    setup: () => ({ result: ref('') }),
    template: `
      <div class="grid w-full max-w-md gap-3">
        <div class="flex flex-wrap gap-2">
          <UIButton variant="outline" @click="result = 'saved'">검토 완료로 표시</UIButton>
          <UIButton variant="outline" @click="result = 'failed'">저장 실패로 표시</UIButton>
        </div>
        <UIAlert type="success" announce="polite" :message="result === 'saved' ? '검토 결과를 저장했습니다.' : ''" />
        <UIAlert type="error" announce="assertive" :message="result === 'failed' ? '검토 결과를 저장할 수 없습니다. 연결 상태를 확인해 주세요.' : ''" />
      </div>
    `,
  }),
}
