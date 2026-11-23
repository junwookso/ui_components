import { ref, useId } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../components/button/UIButton.vue'
import UIChip from '../components/chip/UIChip.vue'

const meta = {
  title: 'Patterns/Page Header',
  args: { title: '승인 요청 상세' },
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    docs: {
      description: {
        component: '업무 화면 제목, 상태, 설명과 액션의 배치 예제입니다. 본문에 사용 가능한 너비에 맞춰 액션 위치가 바뀝니다.',
      },
    },
  },
  render: args => ({
    components: { UIButton, UIChip },
    setup: () => ({ args, approved: ref(false), showAttachments: ref(false), attachmentsId: `page-header-attachments-${useId()}` }),
    template: `
      <main class="@container mx-auto flex min-h-dvh w-full max-w-5xl min-w-0 flex-col gap-6 px-4 py-6 sm:px-6">
        <header class="flex flex-col gap-4 @min-[42rem]:flex-row @min-[42rem]:items-start @min-[42rem]:justify-between">
          <div class="flex min-w-0 flex-col gap-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 class="ui-h1 min-w-0 [overflow-wrap:anywhere]">{{ args.title }}</h1>
              <span role="status" class="inline-flex">
                <UIChip :label="approved ? '승인 완료' : '검토 대기'" :variant="approved ? 'success' : 'warning'" />
              </span>
            </div>
            <p class="ui-subtitle ui-text-muted">요청 번호 APR-1042 · 요청 부서 운영지원팀</p>
          </div>
          <div class="flex flex-wrap justify-end gap-2 @min-[42rem]:shrink-0">
            <UIButton variant="outline" :aria-controls="attachmentsId" :aria-expanded="showAttachments"
              @click="showAttachments = !showAttachments">첨부 문서 보기</UIButton>
            <UIButton :disabled="approved" @click="approved = true">승인하기</UIButton>
          </div>
        </header>

        <section class="grid gap-2 rounded-md border border-border bg-surface p-4">
          <h2 class="ui-h2">요청 정보</h2>
          <p class="ui-body">사내 업무 포털의 접근 권한을 운영지원팀에 추가하는 요청입니다.</p>
        </section>

        <section v-show="showAttachments" :id="attachmentsId" class="grid gap-2 rounded-md border border-border bg-surface p-4">
          <h2 class="ui-h2">첨부 문서</h2>
          <p class="ui-body">운영지원팀 접근 권한 검토서.pdf</p>
        </section>
      </main>
    `,
  }),
} satisfies Meta<{ title: string }>

export default meta
type Story = StoryObj<typeof meta>

export const ApprovalRequest: Story = {}

export const LongTitle: Story = {
  args: { title: '사내 업무 포털 운영지원팀 접근 권한 추가 및 검토 요청 상세' },
}
