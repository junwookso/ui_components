import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDrawer from './UIDrawer.vue'
import UIButton from '../button/UIButton.vue'
import UIInput from '../input/UIInput.vue'

const meta = {
  title: 'Layout/UIDrawer', component: UIDrawer,
  args: { title: '업무 필터', description: '조건을 입력하고 적용해 주세요.', side: 'right', size: 'default', closeOnBackdrop: true },
  argTypes: { side: { control: 'select', options: ['left', 'right'] }, size: { control: 'select', options: ['sm', 'default', 'lg'] }, open: { control: false } },
  render: args => ({ components: { UIDrawer, UIButton, UIInput }, setup: () => ({ args, open: ref(false), query: ref(''), result: ref('') }), template: `<div><UIButton @click="open = true">필터 열기</UIButton><p role="status">{{ result }}</p><UIDrawer v-bind="args" v-model:open="open"><label for="drawer-query" class="ui-label block mb-2">업무명</label><UIInput id="drawer-query" v-model="query" /><template #actions="{ close }"><UIButton variant="ghost" @click="close">취소</UIButton><UIButton @click="result = (query || '전체') + ' 적용'; close()">적용</UIButton></template></UIDrawer></div>` }),
} satisfies Meta<typeof UIDrawer>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Left: Story = { args: { side: 'left' } }
export const BackdropLocked: Story = { args: { closeOnBackdrop: false } }
export const Large: Story = { args: { size: 'lg' } }
export const Navigation: Story = {
  args: { title: '서비스 메뉴', description: undefined, side: 'left', size: 'sm' },
  render: args => ({ components: { UIDrawer, UIButton }, setup: () => ({ args, open: ref(false) }), template: `<div><UIButton @click="open = true">메뉴 열기</UIButton><UIDrawer v-bind="args" v-model:open="open"><template #default="{ close }"><nav aria-label="서비스 메뉴" class="flex flex-col gap-4"><a href="#tasks" class="text-primary underline" @click="close">내 업무</a><a href="#projects" class="text-primary underline" @click="close">프로젝트</a></nav></template></UIDrawer></div>` }),
}
export const LongContent: Story = {
  render: args => ({ components: { UIDrawer, UIButton }, setup: () => ({ args, open: ref(false) }), template: `<div><UIButton @click="open = true">안내 열기</UIButton><UIDrawer v-bind="args" v-model:open="open"><p v-for="n in 40" :key="n" class="mb-4">{{ n }}. 변경 내용을 확인한 후 담당자에게 전달해 주세요.</p><template #actions="{ close }"><UIButton @click="close">확인</UIButton></template></UIDrawer></div>` }),
}
