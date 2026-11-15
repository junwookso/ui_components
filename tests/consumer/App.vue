<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { UIButton, UIInput, UICard, UITree, UIDataTable, UIChip, UIProgress, UICircleProgress, UIDescriptions, UINotifyProvider, useNotify, UIDialogProvider, useConfirm, UIList, UITopbar, UIDrawer, UIFooter } from '@ui-components/vue'
const NotifyExample = defineComponent({ setup() { const { notify } = useNotify(); return () => h(UIButton, { onClick: () => notify({ message: '배포 알림', duration: 0 }) }, () => '알림 표시') } })
const ConfirmExample = defineComponent({ setup() { const { confirm } = useConfirm(); const result = ref(''); return () => h('div', [h(UIButton, { onClick: async () => { result.value = await confirm({ title: '배포 확인', message: '변경 내용을 적용할까요?' }) ? '적용 완료' : '취소됨' } }, () => '확인 표시'), h('p', { 'data-testid': 'confirm-result' }, result.value)]) } })
const drawerOpen = ref(false)
const name = ref('프로젝트')
</script>
<template>
  <UITopbar title="배포 포털"><template #navigation><a href="#consumer-content" aria-current="page">컴포넌트</a></template></UITopbar>
  <main id="consumer-content" class="p-6">
    <h1 class="ui-h1 mb-4">서비스 Tailwind 연동</h1>
    <div data-testid="grid" class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6"><UICard title="기본 정보"><label for="name" class="ui-label">이름</label><UIInput id="name" v-model="name" /></UICard></div>
      <div class="col-span-12 md:col-span-6"><UICard title="액션"><UIButton>저장</UIButton><UIButton variant="outline" size="sm">미리보기</UIButton></UICard></div>
    </div>
    <UITree label="소비 앱 조직" :items="[{ value: 'team', label: '개발팀' }]" />
    <UIDataTable label="배포 테이블" :data="[{ id: 'one', name: '개발팀', count: 12 }]" :columns="[{ accessorKey: 'name', header: '팀' }, { accessorKey: 'count', header: '인원', meta: { align: 'end' } }]" :get-row-id="row => row.id" :paginated="false" />
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
