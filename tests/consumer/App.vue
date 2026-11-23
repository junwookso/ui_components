<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { UIButton, UIInput, UICard, UITree, UIDataTable, UIChip, UIProgress, UICircleProgress, UIDescriptions, UINotifyProvider, useNotify, UIDialogProvider, useConfirm, UIList, UITopbar, UIDrawer, UIFooter, UINavigationMenu, UIDatePicker, UITimePicker, UISelect } from '@ui-components/vue'
import { UIAlert, UIBreadcrumb, UICheckbox, UICombobox, UIDropdownMenu, UIFileUpload, UIFormField, UINumberInput, UIRadioGroup, UITextarea } from '@ui-components/vue'
import { UIAccordion, UIPagination, UISkeleton, UITooltip } from '@ui-components/vue'
const NotifyExample = defineComponent({ setup() { const { notify } = useNotify(); return () => h(UIButton, { onClick: () => notify({ message: '배포 알림', duration: 0 }) }, () => '알림 표시') } })
const ConfirmExample = defineComponent({ setup() { const { confirm } = useConfirm(); const result = ref(''); return () => h('div', [h(UIButton, { onClick: async () => { result.value = await confirm({ title: '배포 확인', message: '변경 내용을 적용할까요?' }) ? '적용 완료' : '취소됨' } }, () => '확인 표시'), h('p', { 'data-testid': 'confirm-result' }, result.value)]) } })
const drawerOpen = ref(false)
const name = ref('프로젝트')
</script>
<template>
  <UITopbar title="배포 포털"><template #navigation><a href="#consumer-content" aria-current="page">컴포넌트</a></template></UITopbar>
  <main id="consumer-content" class="p-6">
    <UIBreadcrumb label="배포 위치" :items="[{ key: 'home', label: '배포 포털', href: '#consumer-content' }, { key: 'components', label: '컴포넌트' }]" />
    <UINavigationMenu label="배포 메뉴" current-route-name="tasks" :items="[{ key: 'work', label: '업무', children: [{ key: 'tasks', label: '내 업무', routeName: 'tasks', href: '#tasks' }] }]" />
    <h1 class="ui-h1 mb-4">서비스 Tailwind 연동</h1>
    <UIAlert type="warning" title="배포 전 검토" message="배포 기록을 확인해 주세요." />
    <div data-testid="grid" class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6"><UICard title="기본 정보"><label for="name" class="ui-label">이름</label><UIInput id="name" v-model="name" /></UICard></div>
      <div class="col-span-12 md:col-span-6"><UICard title="액션"><UIButton>저장</UIButton><UIButton variant="outline" size="sm">미리보기</UIButton></UICard></div>
    </div>
    <label for="consumer-date" class="ui-label">배포 날짜</label><UIDatePicker id="consumer-date" model-value="2026-11-16" />
    <label for="consumer-month" class="ui-label">배포 월</label><UIDatePicker id="consumer-month" level="month" model-value="2026-11" />
    <label for="consumer-time" class="ui-label">배포 시간</label><UITimePicker id="consumer-time" model-value="14:30" />
    <label for="consumer-select" class="ui-label">배포 선택</label><UISelect id="consumer-select" :options="[{ value: 'pending', label: '검토 대기' }]" model-value="pending" />
    <label class="ui-label"><UICheckbox :model-value="true" /> 배포 확인</label>
    <UIRadioGroup name="consumer-scope" label="배포 범위" :options="[{ value: 'team', label: '담당 팀' }, { value: 'all', label: '전사' }]" model-value="team" />
    <UIFormField id="consumer-note" v-slot="{ controlAttrs }" label="배포 메모" description="배포 작업 기록을 남깁니다.">
      <UITextarea v-bind="controlAttrs" model-value="검토 완료" />
    </UIFormField>
    <label for="consumer-assignee" class="ui-label">배포 담당자</label>
    <UICombobox id="consumer-assignee" :options="[{ value: '101', label: '운영지원팀' }]" />
    <UIDropdownMenu label="배포 작업" :items="[{ id: 'edit', label: '편집' }]" />
    <label for="consumer-quantity" class="ui-label">배포 수량</label><UINumberInput id="consumer-quantity" :model-value="0" />
    <UIFileUpload label="배포 첨부" accept=".pdf" />
    <section aria-label="배포 문서 구성" class="grid gap-3">
      <div><UITooltip text="배포 관련 안내입니다."><UIButton variant="outline">배포 도움말</UIButton></UITooltip></div>
      <UIAccordion :items="[{ value: 'rules', label: '배포 규칙', content: '팀 승인이 필요합니다.' }]" :default-value="['rules']" />
      <UISkeleton shape="block" />
      <UIPagination label="배포 문서 페이지 이동" :page-count="3" />
    </section>
    <UIDataTable mode="server" label="서버 페이지" :total-rows="22"
      :data="[{ id: '21', name: '서버 행 21' }, { id: '22', name: '서버 행 22' }]"
      :columns="[{ accessorKey: 'name', header: '이름' }]"
      :pagination="{ pageIndex: 2, pageSize: 10 }" :get-row-id="row => row.id" />
    <UITree label="소비 앱 조직" :items="[{ value: 'team', label: '개발팀' }]" />
    <UIDataTable label="배포 테이블" :data="[{ id: 'one', name: '개발팀', count: 12 }]" :columns="[{ accessorKey: 'name', header: '팀' }, { accessorKey: 'count', header: '인원', meta: { align: 'end' } }]" :get-row-id="row => row.id" :paginated="false" selectable />
    <UIChip label="배포 Chip" variant="success" removable />
    <UIProgress label="배포 진행률" :value="40" />
    <UICircleProgress label="배포 불러오는 중" size="sm" />
    <UIDescriptions label="배포 상세 정보" :items="[{ key: 'team', label: '부서', value: '개발팀' }]" />
    <UINotifyProvider><NotifyExample /></UINotifyProvider>
    <UIDialogProvider><ConfirmExample /></UIDialogProvider>
    <UIList label="배포 목록" :items="[{ key: 'one', title: '배포 검토', description: '담당자 확인' }]" />
    <UIButton @click="drawerOpen = true">배포 Drawer 열기</UIButton>
    <UIDrawer v-model:open="drawerOpen" title="배포 패널"><p>배포 상세 내용</p></UIDrawer>
  </main>
  <UIFooter text="배포 서비스 정보"><template #navigation><a href="#consumer-content">본문으로</a></template></UIFooter>
</template>
