import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIBarChart from './UIBarChart.vue'
import { chartPalette } from './palette'

const meta = {
  title: 'Components/UIBarChart',
  component: UIBarChart,
  tags: ['autodocs'],
  args: {
    label: '요일별 업무 요청. 월요일 12건, 화요일 18건, 수요일 15건, 목요일 22건, 금요일 16건.',
    option: {
      xAxis: { type: 'category', data: ['월', '화', '수', '목', '금'] },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ type: 'bar', name: '업무 요청', data: [12, 18, 15, 22, 16], barMaxWidth: 32 }],
    },
  },
  render: args => ({
    components: { UIBarChart },
    setup: () => ({ args }),
    template: '<div class="chart-story-preview"><UIBarChart v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UIBarChart>

export default meta
export const Playground: StoryObj<typeof meta> = {}

const paletteLabels = ['기획', '개발', '디자인', '운영', '지원', '검토', '인사', '재무', '영업', '구매', '보안', '홍보', '품질', '교육']
const paletteValues = [12, 18, 15, 22, 16, 14, 11, 19, 13, 17, 20, 10, 14, 18]

const fixedDataControls = { option: { control: false }, label: { control: false } } as const

export const Palette: StoryObj<typeof meta> = {
  argTypes: fixedDataControls,
  args: {
    label: `팀별 업무 요청. ${paletteLabels.map((name, i) => `${name} ${paletteValues[i]}건`).join(', ')}.`,
    option: {
      xAxis: { type: 'category', data: paletteLabels, axisLabel: { hideOverlap: true } },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'bar',
        colorBy: 'data',
        data: paletteValues,
        barMaxWidth: 32,
        emphasis: { disabled: true },
      }],
    },
  },
}

type Story = StoryObj<typeof meta>

const months = ['8월', '9월', '10월', '11월']
const requestTypes = [
  { name: '기능 요청', data: [12, 16, 14, 19] },
  { name: '오류 신고', data: [8, 11, 9, 12] },
  { name: '사용 문의', data: [15, 13, 17, 16] },
]

const monthlySummary = months.map((month, index) => {
  const counts = requestTypes.map(({ name, data }) => `${name} ${data[index]}건`)
  const total = requestTypes.reduce((sum, { data }) => sum + data[index]!, 0)
  return `${month} ${counts.join(', ')} (합계 ${total}건)`
}).join('. ')

const renderMonthlyRequests: Story['render'] = args => ({
  components: { UIBarChart },
  setup: () => ({ args, requestTypes, chartPalette }),
  template: `
    <div class="chart-story-preview">
      <ul class="flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-sm" aria-label="요청 유형 범례">
        <li v-for="(series, index) in requestTypes" :key="series.name" class="inline-flex items-center gap-1.5">
          <span class="size-3 rounded-sm" :style="{ backgroundColor: chartPalette[index] }" aria-hidden="true"></span>
          {{ series.name }}
        </li>
      </ul>
      <UIBarChart v-bind="args" />
    </div>
  `,
})

const monthlyAxes = {
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', minInterval: 1 },
} as const

export const Grouped: Story = {
  argTypes: fixedDataControls,
  args: {
    label: `월별 업무 요청 유형 비교. ${monthlySummary}.`,
    option: {
      ...monthlyAxes,
      series: requestTypes.map(series => ({ ...series, type: 'bar', barMaxWidth: 24 })),
    },
  },
  render: renderMonthlyRequests,
}

export const Stacked: Story = {
  argTypes: fixedDataControls,
  args: {
    label: `월별 업무 요청 합계와 유형별 구성. ${monthlySummary}.`,
    option: {
      ...monthlyAxes,
      series: requestTypes.map(series => ({ ...series, type: 'bar', stack: 'requests', barMaxWidth: 40 })),
    },
  },
  render: renderMonthlyRequests,
}
