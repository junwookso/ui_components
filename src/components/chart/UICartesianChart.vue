<script setup lang="ts">
import { use } from 'echarts/core'
import { GridComponent } from 'echarts/components'
import UIChartPlot from './UIChartPlot.vue'
import type { UICartesianChartOption } from './types'

use([GridComponent])

defineProps<{
  label: string
  option: UICartesianChartOption
}>()

const defaults: UICartesianChartOption = {
  grid: { top: 12, bottom: 28, left: 36, right: 8 },
  xAxis: { type: 'category', axisLabel: { color: 'var(--ui-foreground)' },
    axisLine: { lineStyle: { color: 'var(--ui-border)' } }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { color: 'var(--ui-foreground)' },
    splitLine: { lineStyle: { color: 'var(--ui-border)' } } },
}
</script>

<template>
  <UIChartPlot :label="label" :option="option" :defaults="defaults" />
</template>
