<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import UICartesianChart from './UICartesianChart.vue'
import type { UIBarChartOption } from './types'

use([BarChart])

defineProps<{
  label: string
  option: UIBarChartOption
}>()
</script>

<template>
  <UICartesianChart :label="label" :option="option" />
</template>
