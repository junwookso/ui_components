import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UICard from '../components/card/UICard.vue'
import UIInput from '../components/input/UIInput.vue'

const samples = [
  ['h1', '페이지 대표 제목', '24 / 32 · 600'],
  ['h2', '큰 섹션 제목', '20 / 28 · 600'],
  ['h3', '하위 구획 제목', '18 / 26 · 600'],
  ['h4', '작은 구획 제목', '16 / 24 · 600'],
  ['h5', '세부 그룹 제목', '14 / 20 · 600'],
  ['h6', '깊은 단계의 제목', '14 / 20 · 500'],
  ['title', '카드·다이얼로그 제목', '16 / 24 · 600'],
  ['subtitle', '제목을 보충하는 설명', '14 / 20 · 400'],
  ['body', '일반 본문', '14 / 22 · 400'],
  ['body-lg', '읽기 중심 콘텐츠', '16 / 26 · 400'],
  ['caption', '날짜·출처 등 보조 정보', '12 / 18 · 400'],
  ['label', '입력 필드 라벨', '14 / 20 · 500'],
]
const meta = {
  title: 'Foundations/Typography',
  parameters: { controls: { disable: true } },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {
  render: () => ({
    setup: () => ({ samples }),
    template: `<div class="typography-demo">
      <h1 class="ui-h1">타이포그래피 스케일</h1>
      <section v-for="[name, role, size] in samples" :key="name" class="typography-sample">
        <h2 class="ui-label">ui-{{ name }} · {{ role }} · {{ size }}</h2>
        <p :class="'ui-' + name" :data-sample="name">프로젝트 현황 Project status 0123456789</p>
      </section>
    </div>`,
  }),
}
export const Workplace: Story = {
  render: () => ({
    components: { UICard, UIInput },
    template: `<main class="typography-demo">
      <header class="typography-sample"><h1 class="ui-h1">프로젝트별 업무 진행 현황과 담당 부서의 승인 요청을 관리합니다</h1><p class="ui-subtitle ui-text-muted">Project overview · 부서별 진행 상황을 확인하고 정보를 수정합니다.</p></header>
      <UICard title="기본 정보" description="서비스에 표시할 프로젝트 이름을 입력해 주세요.">
        <div class="typography-content">
          <p class="ui-body">담당자는 프로젝트의 변경 사항을 확인합니다. 필수 안내와 오류 메시지는 작은 caption 대신 본문 크기를 유지합니다.</p>
          <div><label for="typography-name" class="ui-label field-label">프로젝트 이름</label><UIInput id="typography-name" model-value="업무 포털 Enterprise 2026" /></div>
          <p class="ui-caption ui-text-muted">최근 수정: 2026.11.14 · 담당: 서비스개발팀</p>
        </div>
      </UICard>
      <section class="typography-content"><h2 class="ui-h2">사용 안내</h2><p class="ui-body-lg">읽기 중심의 긴 안내문에는 여유 있는 본문 스타일을 사용합니다. 제목의 HTML 단계는 문서 구조에 따라 정하고, 화면에서의 크기는 클래스로 선택합니다.</p></section>
    </main>`,
  }),
}
