import { onUnmounted, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../components/button/UIButton.vue'
import UIInput from '../components/input/UIInput.vue'
import UICard from '../components/card/UICard.vue'
import UISwitch from '../components/switch/UISwitch.vue'

const meta = {
  title: 'Foundations/Design Guide',
  parameters: { controls: { disable: true } },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Workplace: Story = {
  render: () => ({
    components: { UIButton, UIInput, UICard, UISwitch },
    setup() {
      const name = ref('사내 업무 포털')
      const department = ref('서비스개발팀')
      const saved = ref({ name: name.value, department: department.value })
      const error = ref('')
      const message = ref('')
      const messageType = ref('info')
      const saving = ref(false)
      const notification = ref(true)
      const notificationMessage = ref('')
      let timer: ReturnType<typeof setTimeout> | undefined
      const validate = () => !name.value.trim() ? '프로젝트 이름을 입력해 주세요.' : ''
      function edit() {
        message.value = ''
        if (error.value) error.value = validate()
      }
      function cancel() {
        name.value = saved.value.name
        department.value = saved.value.department
        error.value = ''
        messageType.value = 'info'
        message.value = '저장된 내용으로 되돌렸습니다.'
      }
      function save() {
        if (saving.value) return
        error.value = validate()
        message.value = ''
        if (error.value) return
        saving.value = true
        timer = setTimeout(() => {
          saved.value = { name: name.value.trim(), department: department.value.trim() }
          name.value = saved.value.name
          department.value = saved.value.department
          saving.value = false
          messageType.value = 'success'
          message.value = '프로젝트 정보를 저장했습니다.'
        }, 800)
      }
      onUnmounted(() => clearTimeout(timer))
      return { name, department, error, message, messageType, saving, notification, notificationMessage, edit, cancel, save }
    },
    template: `<main class="design-guide-demo">
      <header class="design-guide-heading"><h1 class="ui-h1">서비스 설정</h1><p class="ui-subtitle ui-text-muted">업무 정보와 알림 수신 방식을 관리합니다.</p></header>
      <form @submit.prevent="save" novalidate>
        <UICard title="프로젝트 정보" description="변경한 내용은 저장 버튼을 누르면 반영됩니다.">
          <div class="story-grid">
            <div><label class="field-label ui-label" for="guide-name">프로젝트 이름 (필수)</label>
              <UIInput id="guide-name" v-model="name" name="projectName" required :disabled="saving" :invalid="!!error" :aria-describedby="error ? 'guide-name-error' : 'guide-name-help'" @input="edit" />
              <p v-if="error" id="guide-name-error" class="field-error ui-body" role="alert">{{ error }}</p>
              <p v-else id="guide-name-help" class="field-help ui-body ui-text-muted">목록과 알림에 표시할 이름입니다.</p>
            </div>
            <div><label class="field-label ui-label" for="guide-department">담당 부서</label><UIInput id="guide-department" v-model="department" name="department" :disabled="saving" @input="edit" /></div>
          </div>
          <template #actions>
            <UIButton variant="ghost" :disabled="saving" @click="cancel">취소</UIButton>
            <UIButton variant="outline" :disabled="saving" @click="messageType = 'info'; message = '프로젝트: ' + name + ' / 담당 부서: ' + department">미리보기</UIButton>
            <UIButton type="submit" :loading="saving">{{ saving ? '저장 중' : '저장하기' }}</UIButton>
          </template>
        </UICard>
        <p v-if="message" :class="['design-feedback', 'design-feedback-' + messageType]" role="status">{{ message }}</p>
      </form>
      <UICard title="알림 설정" description="알림 수신 여부는 변경 즉시 반영됩니다.">
        <div class="switch-demo-setting"><div><label class="ui-label" for="guide-notification">이메일 알림</label><p class="field-help ui-body ui-text-muted" id="guide-notification-help">담당 업무의 변경 사항을 이메일로 받습니다.</p></div>
          <UISwitch id="guide-notification" v-model="notification" aria-describedby="guide-notification-help" @update:model-value="notificationMessage = $event ? '이메일 알림을 켰습니다.' : '이메일 알림을 껐습니다.'" />
        </div>
        <p v-if="notificationMessage" role="status" class="field-help ui-body ui-text-muted">{{ notificationMessage }}</p>
      </UICard>
      <UICard title="상태별 표현" description="색상과 텍스트를 함께 사용해 상태를 구분합니다.">
        <div class="story-grid">
          <div class="design-feedback design-feedback-success">완료 · 변경 사항이 저장되었습니다.</div>
          <div class="design-feedback design-feedback-warning">주의 · 저장하지 않은 변경 사항이 있습니다.</div>
          <div class="design-feedback design-feedback-info">안내 · 변경 이력은 관리자에게 문의하세요.</div>
          <div class="design-selected">선택됨 · 현재 프로젝트</div>
          <div><label class="field-label ui-label" for="guide-readonly">프로젝트 코드 (읽기 전용)</label><UIInput id="guide-readonly" model-value="PRJ-001" readonly /></div>
          <div><label class="field-label ui-label" for="guide-disabled">외부 공유 (권한 없음)</label><UIInput id="guide-disabled" model-value="관리자만 변경할 수 있습니다" disabled /></div>
        </div>
      </UICard>
    </main>`,
  }),
}
