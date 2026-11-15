import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UISwitch from './UISwitch.vue'
import UICard from '../card/UICard.vue'

const meta = {
  title: 'Components/UISwitch',
  component: UISwitch,
  args: { disabled: false, falseLabel: 'False', trueLabel: 'True', 'onUpdate:modelValue': fn() },
  argTypes: { modelValue: { control: 'boolean' } },
  render: (args) => ({
    components: { UISwitch },
    setup: () => {
      const enabled = ref(args.modelValue ?? false)
      watch(() => args.modelValue, value => { enabled.value = value ?? false })
      return { args, enabled }
    },
    template: '<div class="switch-demo-row"><UISwitch id="switch-playground" v-bind="args" v-model="enabled" /><label class="switch-demo-label" for="switch-playground">이메일 알림</label></div>',
  }),
} satisfies Meta<typeof UISwitch>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const States: Story = {
  render: () => ({
    components: { UISwitch },
    setup: () => ({ off: ref(false), on: ref(true) }),
    template: `<div class="story-grid">
      <div class="switch-demo-row"><UISwitch id="switch-off" v-model="off" /><label class="switch-demo-label" for="switch-off">이메일 알림</label><span class="field-help ui-body ui-text-muted">{{ off ? '켜짐' : '꺼짐' }}</span></div>
      <div class="switch-demo-row"><UISwitch id="switch-on" v-model="on" /><label class="switch-demo-label" for="switch-on">업무 알림</label><span class="field-help ui-body ui-text-muted">{{ on ? '켜짐' : '꺼짐' }}</span></div>
      <div class="switch-demo-row"><UISwitch id="switch-disabled-off" disabled /><label for="switch-disabled-off">비활성 · 꺼짐</label></div>
      <div class="switch-demo-row"><UISwitch id="switch-disabled-on" :model-value="true" disabled /><label for="switch-disabled-on">비활성 · 켜짐</label></div>
    </div>`,
  }),
}
export const WithDescription: Story = {
  render: () => ({
    components: { UISwitch },
    setup: () => ({ enabled: ref(false) }),
    template: `<div class="input-demo switch-demo-setting">
      <div><label for="switch-summary">일일 업무 요약</label><p id="switch-summary-help" class="field-help ui-body ui-text-muted">매일 오전 9시에 업무 요약을 받습니다.</p></div>
      <UISwitch id="switch-summary" v-model="enabled" aria-describedby="switch-summary-help" />
    </div>`,
  }),
}
export const NotificationSettings: Story = {
  parameters: { docs: { description: { story: '설정을 켜거나 끄면 로컬 상태에 즉시 반영합니다. 라벨은 상태에 따라 변경하지 않습니다. 실제 서버 요청은 수행하지 않습니다.' } } },
  render: () => ({
    components: { UISwitch, UICard },
    setup: () => ({ email: ref(true), summary: ref(false), message: ref('') }),
    template: `<div class="card-demo">
      <UICard title="알림 설정" description="업무에 필요한 알림을 선택하세요. 변경 사항은 즉시 반영됩니다.">
        <div class="story-grid">
          <div class="switch-demo-setting"><div><label for="notification-email">이메일 알림</label><p class="field-help ui-body ui-text-muted" id="notification-email-help">담당 업무가 변경되면 이메일로 알려드립니다.</p></div><UISwitch id="notification-email" v-model="email" name="emailNotifications" aria-describedby="notification-email-help" @update:model-value="message = $event ? '이메일 알림을 켰습니다.' : '이메일 알림을 껐습니다.'" /></div>
          <div class="switch-demo-setting"><div><label for="notification-summary">일일 업무 요약</label><p class="field-help ui-body ui-text-muted" id="notification-summary-help">매일 오전 9시에 업무 요약을 받습니다.</p></div><UISwitch id="notification-summary" v-model="summary" name="dailySummary" aria-describedby="notification-summary-help" @update:model-value="message = $event ? '일일 업무 요약을 켰습니다.' : '일일 업무 요약을 껐습니다.'" /></div>
          <div class="switch-demo-setting"><div><label for="notification-security">보안 알림</label><p class="field-help ui-body ui-text-muted" id="notification-security-help">관리자 정책에 따라 항상 수신합니다.</p></div><UISwitch id="notification-security" :model-value="true" disabled aria-describedby="notification-security-help" /></div>
        </div>
      </UICard>
      <p class="field-help card-demo-status" role="status">{{ message }}</p>
    </div>`,
  }),
}

export const CustomLabels: Story = {
  args: { falseLabel: '꺼짐', trueLabel: '켜짐' },
}
