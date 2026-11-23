import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIBreadcrumb from './UIBreadcrumb.vue'
import type { UIBreadcrumbItem } from './types'

const requestList: UIBreadcrumbItem = {
  key: 'requests', label: '업무 요청 목록', href: './?path=/story/patterns-list-search--requests', target: '_top',
}
const request: UIBreadcrumbItem = {
  key: 'request', label: 'REQ-1048 상세', href: './?path=/story/patterns-request-detail--request', target: '_top',
}

const meta = {
  title: 'Layout/UIBreadcrumb',
  component: UIBreadcrumb,
  args: { items: [requestList, request, { key: 'history', label: '처리 이력' }] },
  render: args => ({
    components: { UIBreadcrumb },
    setup: () => ({ args }),
    template: '<div class="w-full max-w-2xl"><UIBreadcrumb v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UIBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const LongPath: Story = {
  args: {
    items: [
      requestList,
      { key: 'group', label: '운영지원팀 권한 검토' },
      request,
      { key: 'history', label: '2026년 하반기 업무 포털 권한 검토 이력 OPERATIONSACCESSREVIEW2026NOVEMBERREQ1048' },
    ],
  },
}

export const SinglePage: Story = {
  args: { items: [{ key: 'requests', label: '업무 요청 목록' }] },
}
