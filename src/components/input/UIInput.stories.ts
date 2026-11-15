import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UIInput from './UIInput.vue'
import UIButton from '../button/UIButton.vue'

const meta = {
  title: 'Components/UIInput',
  component: UIInput,
  args: { type: 'text', size: 'default', disabled: false, readonly: false, invalid: false, 'onUpdate:modelValue': fn() },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url'] },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    modelValue: { control: 'text' },
  },
  render: (args) => ({
    components: { UIInput },
    setup: () => ({ args }),
    template: '<div class="input-demo"><label class="field-label ui-label" for="playground-input">이름</label><UIInput id="playground-input" placeholder="이름을 입력하세요" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UIInput>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Sizes: Story = {
  render: () => ({
    components: { UIInput },
    template: `<div class="input-demo story-grid">
      <div><label class="field-label ui-label" for="input-small">Small</label><UIInput id="input-small" size="sm" placeholder="32px" /></div>
      <div><label class="field-label ui-label" for="input-default">Default</label><UIInput id="input-default" placeholder="40px" /></div>
      <div><label class="field-label ui-label" for="input-large">Large</label><UIInput id="input-large" size="lg" placeholder="48px" /></div>
    </div>`,
  }),
}
export const States: Story = {
  render: () => ({
    components: { UIInput },
    template: `<div class="input-demo story-grid">
      <div><label class="field-label ui-label" for="input-enabled">기본</label><UIInput id="input-enabled" placeholder="입력하세요" /></div>
      <div><label class="field-label ui-label" for="input-disabled">비활성</label><UIInput id="input-disabled" disabled model-value="수정할 수 없습니다" /></div>
      <div><label class="field-label ui-label" for="input-readonly">읽기 전용</label><UIInput id="input-readonly" readonly model-value="복사할 수 있는 값" /></div>
      <div><label class="field-label ui-label" for="input-error">이메일</label><UIInput id="input-error" type="email" invalid model-value="invalid-email" aria-describedby="input-error-message" /><p id="input-error-message" class="field-error ui-body">올바른 이메일 주소를 입력해 주세요.</p></div>
    </div>`,
  }),
}
export const Types: Story = {
  render: () => ({
    components: { UIInput },
    setup: () => ({ types: ['text', 'email', 'password', 'search', 'tel', 'url'] as const }),
    template: '<div class="input-demo story-grid"><div v-for="type in types" :key="type"><label class="field-label ui-label" :for="`type-${type}`">{{ type }}</label><UIInput :id="`type-${type}`" :type="type" :placeholder="type" /></div></div>',
  }),
}
export const Form: Story = {
  render: () => ({
    components: { UIInput, UIButton },
    setup() {
      const name = ref('')
      const email = ref('')
      const error = ref('')
      const submitted = ref('')
      function submit() {
        submitted.value = ''
        error.value = !name.value.trim() ? '이름을 입력해 주세요.' : ''
        if (!error.value) submitted.value = `${name.value}님의 정보를 저장했습니다.`
      }
      return { name, email, error, submitted, submit }
    },
    template: `<form class="input-demo story-grid" @submit.prevent="submit">
      <div><label class="field-label ui-label" for="form-name">이름 <span aria-hidden="true">*</span></label>
        <UIInput id="form-name" v-model="name" name="name" autocomplete="name" required placeholder="홍길동" :invalid="!!error" :aria-describedby="error ? 'form-name-error' : undefined" @input="error = ''; submitted = ''" />
        <p v-if="error" id="form-name-error" class="field-error ui-body" role="alert">{{ error }}</p>
      </div>
      <div><label class="field-label ui-label" for="form-email">이메일 <span aria-hidden="true">*</span></label>
        <UIInput id="form-email" v-model="email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" aria-describedby="form-email-help" @input="submitted = ''" />
        <p id="form-email-help" class="field-help ui-body ui-text-muted">연락받을 이메일 주소를 입력해 주세요.</p>
      </div>
      <UIButton type="submit">저장하기</UIButton>
      <p role="status" class="field-help ui-body ui-text-muted">{{ submitted }}</p>
    </form>`,
  }),
}

export const InlineForm: Story = {
  name: 'Inline Form',
  parameters: {
    docs: {
      description: {
        story: '입력과 버튼에 동일한 size를 적용한 검색 폼입니다. 두 요소 사이 간격은 8px이며, 입력이 남은 너비를 채웁니다. Enter 또는 검색 버튼으로 제출할 수 있습니다.',
      },
    },
  },
  render: () => ({
    components: { UIInput, UIButton },
    setup() {
      const sizes = ['sm', 'default', 'lg'] as const
      const queries = ref({ sm: '', default: '', lg: '' })
      const messages = ref({ sm: '', default: '', lg: '' })
      function search(size: typeof sizes[number]) {
        const query = queries.value[size].trim()
        messages.value[size] = query ? `“${query}” 검색을 요청했습니다.` : '검색어를 입력해 주세요.'
      }
      return { sizes, queries, messages, search }
    },
    template: `<div class="inline-form-demo story-grid">
      <form v-for="size in sizes" :key="size" :aria-label="size + ' 검색 폼'" @submit.prevent="search(size)">
        <label class="field-label ui-label" :for="'inline-query-' + size">검색 · {{ size }}</label>
        <div class="inline-form-row">
          <UIInput :id="'inline-query-' + size" v-model="queries[size]" :size="size" type="search" name="query" placeholder="검색어를 입력하세요" :aria-describedby="'inline-status-' + size" @input="messages[size] = ''">
            <template #prefix>${searchIcon}</template>
          </UIInput>
          <UIButton :size="size" type="submit">검색</UIButton>
        </div>
        <p :id="'inline-status-' + size" class="field-help ui-body ui-text-muted" role="status">{{ messages[size] }}</p>
      </form>
    </div>`,
  }),
}

const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>'
const mailIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>'
const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6" /></svg>'

export const WithIcons: Story = {
  name: 'Prefix / Suffix Icons',
  parameters: {
    controls: { include: ['size', 'disabled', 'readonly', 'invalid'] },
    docs: { description: { story: 'prefix와 suffix 슬롯에 장식용 SVG를 넣습니다. 아이콘은 16px이며 해당 방향에 입력 여백을 확보합니다. 아이콘 자체는 클릭하거나 포커스할 수 없습니다.' } },
  },
  render: (args) => ({
    components: { UIInput },
    setup: () => ({ args }),
    template: `<div class="input-demo story-grid">
      <div><label class="field-label ui-label" for="icon-prefix">앞 아이콘 · 검색</label>
        <UIInput id="icon-prefix" v-bind="args" type="search" placeholder="검색어를 입력하세요"><template #prefix>${searchIcon}</template></UIInput>
      </div>
      <div><label class="field-label ui-label" for="icon-suffix">뒤 아이콘 · 이메일</label>
        <UIInput id="icon-suffix" v-bind="args" type="email" placeholder="you@example.com"><template #suffix>${mailIcon}</template></UIInput>
      </div>
      <div><label class="field-label ui-label" for="icon-both">양쪽 아이콘 · 인증된 이메일</label>
        <UIInput id="icon-both" v-bind="args" type="email" model-value="you@example.com" readonly aria-describedby="icon-both-help"><template #prefix>${mailIcon}</template><template #suffix>${checkIcon}</template></UIInput>
        <p id="icon-both-help" class="field-help ui-body ui-text-muted">인증이 완료된 이메일입니다.</p>
      </div>
    </div>`,
  }),
}

export const IconSizes: Story = {
  render: () => ({
    components: { UIInput },
    setup: () => ({ sizes: ['sm', 'default', 'lg'] as const }),
    template: `<div class="input-demo story-grid">
      <div v-for="size in sizes" :key="size"><label class="field-label ui-label" :for="'icon-size-' + size">이메일 · {{ size }}</label>
        <UIInput :id="'icon-size-' + size" :size="size" type="email" placeholder="you@example.com"><template #prefix>${mailIcon}</template><template #suffix>${checkIcon}</template></UIInput>
      </div>
    </div>`,
  }),
}
