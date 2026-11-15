import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UICard from './UICard.vue'
import UIButton from '../button/UIButton.vue'
import UIInput from '../input/UIInput.vue'

const meta = {
  title: 'Components/UICard',
  component: UICard,
  args: { title: '프로젝트 정보', description: '프로젝트의 기본 정보와 담당자를 확인합니다.', headingLevel: 2 },
  argTypes: { headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] } },
  render: (args) => ({
    components: { UICard, UIButton },
    setup: () => ({ args, onAction: fn() }),
    template: `<div class="card-demo"><UICard v-bind="args">
      <dl class="card-demo-details"><dt>프로젝트</dt><dd>사내 서비스 UI</dd><dt>담당 부서</dt><dd>서비스개발팀</dd><dt>상태</dt><dd>진행 중</dd></dl>
      <template #actions><UIButton @click="onAction">수정하기</UIButton></template>
    </UICard></div>`,
  }),
} satisfies Meta<typeof UICard>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const ActionHierarchy: Story = {
  name: 'Action Hierarchy',
  parameters: { docs: { description: { story: '액션은 우측 정렬입니다. 취소(ghost) → 보조 동작(outline) → 주요 동작(default/filled) 순서로 배치하고, filled 버튼은 하나만 사용합니다.' } } },
  render: () => ({
    components: { UICard, UIButton },
    setup: () => ({ message: ref('') }),
    template: `<div class="card-demo">
      <UICard title="변경 사항 검토" description="내용을 확인한 후 변경 사항을 저장하세요.">
        <p>프로젝트 이름과 담당 부서가 변경되었습니다. 미리보기로 확인하거나 저장할 수 있습니다.</p>
        <template #actions>
          <UIButton variant="ghost" @click="message = '변경을 취소했습니다.'">취소</UIButton>
          <UIButton variant="outline" @click="message = '변경 내용을 미리 확인합니다.'">미리보기</UIButton>
          <UIButton @click="message = '변경 사항을 저장했습니다.'">저장하기</UIButton>
        </template>
      </UICard>
      <p class="field-help card-demo-status" role="status">{{ message }}</p>
    </div>`,
  }),
}
export const WithForm: Story = {
  render: () => ({
    components: { UICard, UIInput, UIButton },
    setup() {
      const name = ref('사내 서비스 UI')
      const department = ref('서비스개발팀')
      const message = ref('')
      function cancel() {
        name.value = '사내 서비스 UI'
        department.value = '서비스개발팀'
        message.value = '변경을 취소했습니다.'
      }
      function save() { message.value = `${name.value}의 정보를 저장했습니다.` }
      return { name, department, message, cancel, save }
    },
    template: `<form class="card-demo" @submit.prevent="save">
      <UICard title="프로젝트 설정" description="업무에 필요한 기본 정보를 관리합니다.">
        <div class="story-grid">
          <div><label class="field-label ui-label" for="card-project-name">프로젝트 이름</label><UIInput id="card-project-name" v-model="name" name="projectName" required @input="message = ''" /></div>
          <div><label class="field-label ui-label" for="card-department">담당 부서</label><UIInput id="card-department" v-model="department" name="department" required @input="message = ''" /></div>
        </div>
        <template #actions>
          <UIButton variant="ghost" @click="cancel">취소</UIButton>
          <UIButton variant="outline" @click="message = '입력한 정보를 임시 저장했습니다.'">임시 저장</UIButton>
          <UIButton type="submit">저장하기</UIButton>
        </template>
      </UICard>
      <p class="field-help card-demo-status" role="status">{{ message }}</p>
    </form>`,
  }),
}
export const WithoutActions: Story = {
  render: () => ({
    components: { UICard },
    template: '<div class="card-demo"><UICard title="이용 안내"><p>조회 권한이 있는 정보만 표시됩니다.</p></UICard></div>',
  }),
}
export const CustomTitle: Story = {
  render: () => ({
    components: { UICard, UIButton },
    template: `<div class="card-demo"><UICard :heading-level="3">
      <template #title>승인 요청 <span style="color: var(--ui-muted-foreground); font-weight: 400">(2건)</span></template>
      <template #description>검토가 필요한 요청을 확인하세요.</template>
      <p>새로운 접근 권한 요청이 있습니다.</p>
      <template #actions><UIButton>요청 확인</UIButton></template>
    </UICard></div>`,
  }),
}
