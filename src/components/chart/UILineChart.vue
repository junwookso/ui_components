<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import UICartesianChart from './UICartesianChart.vue'
import type { UILineChartOption } from './types'

use([LineChart])

defineProps<{
  label: string
  option: UILineChartOption
}>()
</script>

<template>
  <UICartesianChart :label="label" :option="option" />
</template>
