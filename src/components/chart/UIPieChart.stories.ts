import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIPieChart from './UIPieChart.vue'
import { chartPalette } from './palette'
import type { UIPieChartOption } from './types'

const data = [
  { name: '기능 요청', value: 45 },
  { name: '오류 신고', value: 30 },
  { name: '사용 문의', value: 25 },
]

function option(radius: string | [string, string]): UIPieChartOption {
  return {
    series: [{
      type: 'pie',
      radius,
      data,
      label: { show: false },
      itemStyle: { borderColor: 'var(--ui-surface, var(--ui-background))', borderWidth: 2 },
      emphasis: { disabled: true },
    }],
  }
}

const meta = {
  title: 'Components/UIPieChart',
  component: UIPieChart,
  tags: ['autodocs'],
  argTypes: { option: { control: false }, label: { control: false } },
  args: {
    label: `업무 요청 유형별 비중. ${data.map(({ name, value }) => `${name} ${value}%`).join(', ')}.`,
    option: option('85%'),
  },
  render: args => ({
    components: { UIPieChart },
    setup: () => ({ args, data, chartPalette }),
    template: `
      <div class="chart-story-preview">
        <UIPieChart v-bind="args" />
        <ul class="flex list-none flex-wrap justify-center gap-x-4 gap-y-2 p-0 text-sm" aria-label="요청 유형 범례">
          <li v-for="(item, index) in data" :key="item.name" class="inline-flex items-center gap-1.5">
            <span class="size-3 rounded-sm" :style="{ backgroundColor: chartPalette[index] }" aria-hidden="true"></span>
            {{ item.name }} {{ item.value }}%
          </li>
        </ul>
      </div>
    `,
  }),
} satisfies Meta<typeof UIPieChart>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Donut: Story = { args: { option: option(['48%', '85%']) } }
