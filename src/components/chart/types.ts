import type { ComposeOption } from 'echarts/core'
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type { GridComponentOption } from 'echarts/components'

export type UIBarChartOption = ComposeOption<BarSeriesOption | GridComponentOption>
export type UILineChartOption = ComposeOption<LineSeriesOption | GridComponentOption>
export type UICartesianChartOption = ComposeOption<BarSeriesOption | LineSeriesOption | GridComponentOption>
export type UIPieChartOption = ComposeOption<PieSeriesOption>
