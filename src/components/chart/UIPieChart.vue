<script setup lang="ts">
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import UIChartPlot from './UIChartPlot.vue'
import type { UIPieChartOption } from './types'

use([PieChart])

defineProps<{
  label: string
  option: UIPieChartOption
}>()
</script>

<template>
  <UIChartPlot :label="label" :option="option" />
</template>
