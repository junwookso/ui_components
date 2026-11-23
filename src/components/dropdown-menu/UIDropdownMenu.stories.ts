import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDropdownMenu from './UIDropdownMenu.vue'
import type { UIDropdownMenuItem } from './types'

const items: UIDropdownMenuItem[] = [
  { id: 'edit', label: '수정' },
  { id: 'copy', label: '복제', disabled: true },
  { id: 'delete', label: '삭제', destructive: true },
]
const meta = {
  title: 'Components/UIDropdownMenu',
  component: UIDropdownMenu,
  args: { label: '요청 더보기', items },
  render: args => ({
    components: { UIDropdownMenu },
    setup: () => ({ args, selected: ref('') }),
    template: `<div class="grid justify-items-end gap-2">
      <UIDropdownMenu v-bind="args" @select="selected = $event.label" />
      <p class="ui-body" role="status">{{ selected }}</p>
    </div>`,
  }),
} satisfies Meta<typeof UIDropdownMenu>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Disabled: Story = { args: { disabled: true } }
