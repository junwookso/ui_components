import { defineComponent, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDialog from './UIDialog.vue'
import UIDialogProvider from './UIDialogProvider.vue'
import { useDialog } from './context'
import UIButton from '../button/UIButton.vue'
import ProjectDialog from './examples/ProjectDialog.vue'
import type { ProjectPayload, ProjectResult } from './examples/types'

function renderExample(closeOnBackdrop = true, longContent = false) {
  const Opener = defineComponent({
    components: { UIButton },
    setup() {
      const { openDialog } = useDialog()
      const result = ref('아직 결과가 없습니다.')
      const name = ref('사내 업무 포털')
      const open = () => openDialog<ProjectPayload, ProjectResult>(ProjectDialog, {
        payload: { name: name.value, longContent }, closeOnBackdrop,
        onResult: value => { name.value = value.name; result.value = `완료: ${value.name}` },
        onCancel: reason => { result.value = `취소: ${reason}` },
      })
      return { open, result }
    },
    template: '<div class="story-grid"><UIButton @click="open">프로젝트 편집 열기</UIButton><p role="status">{{ result }}</p></div>',
  })
  return { components: { UIDialogProvider, Opener }, template: '<UIDialogProvider><Opener /></UIDialogProvider>' }
}
const meta = {
  title: 'Components/UIDialog', component: UIDialog,
  args: { title: '프로젝트 편집' },
  parameters: { controls: { disable: true } },
  render: () => renderExample(),
} satisfies Meta<typeof UIDialog>
export default meta
type Story = StoryObj<typeof meta>
export const ProjectForm: Story = {}
export const BackdropLocked: Story = { render: () => renderExample(false) }
export const LongContent: Story = { render: () => renderExample(true, true) }
