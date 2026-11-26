import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UILineChart from './UILineChart.vue'
import { chartPalette } from './palette'

const days = ['월', '화', '수', '목', '금']
const received = [12, 18, 15, 22, 16]
const completed = [8, 14, 13, 17, 18]
const axes = {
  xAxis: { type: 'category', data: days },
  yAxis: { type: 'value', minInterval: 1 },
} as const

const meta = {
  title: 'Components/UILineChart',
  component: UILineChart,
  tags: ['autodocs'],
  args: {
    label: `요일별 업무 접수. ${days.map((day, index) => `${day}요일 ${received[index]}건`).join(', ')}.`,
    option: {
      ...axes,
      series: [{ type: 'line', name: '접수', data: received, symbol: 'circle' }],
    },
  },
  render: args => ({
    components: { UILineChart },
    setup: () => ({ args }),
    template: '<div class="chart-story-preview"><UILineChart v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UILineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const MultipleSeries: Story = {
  argTypes: { option: { control: false }, label: { control: false } },
  args: {
    label: `요일별 업무 처리 추이. ${days.map((day, index) =>
      `${day}요일 접수 ${received[index]}건, 완료 ${completed[index]}건`).join('. ')}.`,
    option: {
      ...axes,
      series: [
        { type: 'line', name: '접수', data: received, symbol: 'circle' },
        { type: 'line', name: '완료', data: completed, symbol: 'diamond', lineStyle: { type: 'dashed' } },
      ],
    },
  },
  render: args => ({
    components: { UILineChart },
    setup: () => ({ args, chartPalette }),
    template: `
      <div class="chart-story-preview">
        <ul class="flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-sm" aria-label="업무 처리 범례">
          <li class="inline-flex items-center gap-1.5">
            <span class="w-5 border-t-2" :style="{ borderColor: chartPalette[0] }" aria-hidden="true"></span>접수
          </li>
          <li class="inline-flex items-center gap-1.5">
            <span class="w-5 border-t-2 border-dashed" :style="{ borderColor: chartPalette[1] }" aria-hidden="true"></span>완료
          </li>
        </ul>
        <UILineChart v-bind="args" />
      </div>
    `,
  }),
}
