import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UIButton from './UIButton.vue'

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const sizes = ['default', 'sm', 'lg', 'icon'] as const
const meta = {
  title: 'Components/UIButton',
  component: UIButton,
  args: { variant: 'default', size: 'default', disabled: false, type: 'button', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    default: { control: 'text', description: '버튼 텍스트 또는 아이콘 슬롯' },
  },
  render: (args) => ({
    components: { UIButton },
    setup: () => ({ args }),
    template: '<UIButton v-bind="args">{{ args.default || "Button" }}</UIButton>',
  }),
} satisfies Meta<typeof UIButton>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { args: { default: '저장하기' } }
export const Variants: Story = {
  render: () => ({
    components: { UIButton },
    setup: () => ({ variants }),
    template: '<div class="story-row"><UIButton v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</UIButton></div>',
  }),
}
export const Sizes: Story = {
  render: () => ({
    components: { UIButton },
    template: `<div class="story-row">
      <UIButton size="sm">Small</UIButton><UIButton>Default</UIButton><UIButton size="lg">Large</UIButton>
      <UIButton size="icon" aria-label="추가"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></UIButton>
    </div>`,
  }),
}
export const Disabled: Story = {
  render: () => ({
    components: { UIButton },
    setup: () => ({ variants }),
    template: '<div class="story-row"><UIButton v-for="variant in variants" :key="variant" :variant="variant" disabled>{{ variant }}</UIButton></div>',
  }),
}
export const KeyboardFocus: Story = {
  parameters: { docs: { description: { story: 'Tab으로 이동하고 Enter 또는 Space로 활성화합니다. 비활성 버튼은 건너뜁니다.' } } },
  render: () => ({
    components: { UIButton },
    template: '<div class="story-row"><UIButton>첫 번째</UIButton><UIButton disabled>비활성</UIButton><UIButton variant="outline">두 번째</UIButton></div>',
  }),
}
export const ColorThemes: Story = {
  render: () => ({
    components: { UIButton },
    template: `<div class="story-grid">
      <div><p class="story-label">Default theme</p><UIButton>저장하기</UIButton></div>
      <div style="--ui-primary: #0369a1; --ui-primary-foreground: #fff; --ui-ring: #0284c7"><p class="story-label">Service color override</p><UIButton>저장하기</UIButton></div>
    </div>`,
  }),
}

// Inline SVG examples: no icon package or SVG loader is required.
const plusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>'
const downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg>'
const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>'
const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>'
const trashIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6" /></svg>'

export const WithIcon: Story = {
  name: 'Icon + Text',
  parameters: {
    controls: { include: ['variant', 'disabled'] },
    docs: { description: { story: 'SVG와 텍스트를 기본 슬롯에 함께 넣습니다. 아이콘은 16px, 텍스트와의 간격은 8px입니다. SVG는 currentColor로 버튼 색상을 따릅니다.' } },
  },
  render: (args) => ({
    components: { UIButton },
    setup: () => ({ args, textSizes: ['sm', 'default', 'lg'] as const }),
    template: `<div class="story-grid">
      <div v-for="size in textSizes" :key="size">
        <p class="story-label">{{ size }}</p>
        <div class="story-row">
          <UIButton :size="size" :variant="args.variant" :disabled="args.disabled" @click="args.onClick">${plusIcon}추가하기</UIButton>
          <UIButton :size="size" variant="outline" :disabled="args.disabled" @click="args.onClick">${downloadIcon}다운로드</UIButton>
          <UIButton :size="size" variant="ghost" :disabled="args.disabled" @click="args.onClick">다음으로${arrowIcon}</UIButton>
        </div>
      </div>
      <div><p class="story-label">disabled</p><UIButton disabled>${downloadIcon}다운로드</UIButton></div>
    </div>`,
  }),
}

export const IconButton: Story = {
  name: 'Icon Button',
  parameters: {
    controls: { include: ['disabled'] },
    docs: { description: { story: 'size="icon"은 40×40px 버튼입니다. 텍스트가 없으므로 버튼에 aria-label을 지정하고 SVG는 aria-hidden="true"로 숨깁니다. 툴팁은 이 예제에 포함하지 않습니다.' } },
  },
  render: (args) => ({
    components: { UIButton },
    setup: () => ({ args }),
    template: `<div class="story-grid">
      <div class="story-row">
        <div><p class="story-label">default · 추가</p><UIButton size="icon" aria-label="추가" :disabled="args.disabled" @click="args.onClick">${plusIcon}</UIButton></div>
        <div><p class="story-label">outline · 검색</p><UIButton size="icon" variant="outline" aria-label="검색" :disabled="args.disabled" @click="args.onClick">${searchIcon}</UIButton></div>
        <div><p class="story-label">ghost · 다운로드</p><UIButton size="icon" variant="ghost" aria-label="다운로드" :disabled="args.disabled" @click="args.onClick">${downloadIcon}</UIButton></div>
        <div><p class="story-label">destructive · 삭제</p><UIButton size="icon" variant="destructive" aria-label="삭제" :disabled="args.disabled" @click="args.onClick">${trashIcon}</UIButton></div>
      </div>
      <div><p class="story-label">disabled · 추가</p><UIButton size="icon" aria-label="추가 (비활성)" disabled>${plusIcon}</UIButton></div>
    </div>`,
  }),
}

export const Loading: Story = {
  args: { loading: true, default: '저장 중' },
  parameters: { docs: { description: { story: 'loading 상태는 진행 표시와 aria-busy를 제공하고 버튼을 비활성화해 중복 클릭을 막습니다. 비동기 작업 상태는 소비 화면에서 관리합니다.' } } },
}
