import { defineComponent, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDialogProvider from '../dialog/UIDialogProvider.vue'
import UIButton from '../button/UIButton.vue'
import { useConfirm } from './context'
import type { UIConfirmOptions } from './types'

function example(options: UIConfirmOptions) {
  const Example = defineComponent({
    components: { UIButton },
    setup() {
      const { confirm } = useConfirm()
      const result = ref('아직 실행하지 않았습니다.')
      async function open() {
        result.value = await confirm(options) ? '확인했습니다.' : '취소했습니다.'
      }
      return { open, result }
    },
    template: '<div class="story-grid"><UIButton @click="open">확인 요청 열기</UIButton><p role="status">{{ result }}</p></div>',
  })
  return { components: { UIDialogProvider, Example }, template: '<UIDialogProvider><Example /></UIDialogProvider>' }
}
const meta = {
  title: 'Actions/Confirm', component: UIDialogProvider,
  parameters: { controls: { disable: true }, docs: { description: { component: '기존 UIDialogProvider 아래에서 useConfirm()을 호출합니다. await confirm({ title, message })는 명시적 확인에만 true를 반환합니다. 취소·Escape·열기 거절·provider 해제는 false입니다. 기존 UIDialog와 동일한 표면, 간격, 버튼 배치를 사용합니다.' } } },
  render: () => example({ title: '변경사항을 저장할까요?', message: '저장한 내용은 팀원에게 바로 반영됩니다.' }),
} satisfies Meta<typeof UIDialogProvider>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Destructive: Story = { render: () => example({ title: '프로젝트를 삭제할까요?', message: '프로젝트와 연결된 설정이 삭제됩니다.\n삭제한 내용은 복구할 수 없습니다.', destructive: true, confirmLabel: '프로젝트 삭제', cancelLabel: '돌아가기' }) }
export const BackdropDismiss: Story = { render: () => example({ title: '작업을 종료할까요?', message: '작성 중인 내용은 저장되지 않습니다.', closeOnBackdrop: true, confirmLabel: '종료' }) }
export const LongMessage: Story = { render: () => example({ title: '일괄 변경 내용을 적용할까요?', message: Array.from({ length: 24 }, (_, i) => `${i + 1}. 대상 프로젝트의 접근 권한이 변경됩니다. 담당자와 변경 내용을 확인해 주세요.`).join('\n'), confirmLabel: '변경 적용' }) }
