<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { init, use, type EChartsType } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { chartPalette } from './palette'
import type { UICartesianChartOption, UIPieChartOption } from './types'

use([SVGRenderer])

const props = defineProps<{
  label: string
  option: UICartesianChartOption | UIPieChartOption
  defaults?: UICartesianChartOption
}>()

const plot = useTemplateRef<HTMLDivElement>('plot')
let chart: EChartsType | undefined
let observer: ResizeObserver | undefined

function render() {
  chart?.setOption({
    animation: false,
    color: chartPalette,
    textStyle: { fontFamily: 'var(--ui-font-family)', color: 'var(--ui-foreground)' },
    ...props.defaults,
  }, { notMerge: true })
  chart?.setOption(props.option)
}

onMounted(() => {
  const element = plot.value!
  observer = new ResizeObserver(() => {
    if (!element.clientWidth || !element.clientHeight) return
    if (chart) {
      chart.resize()
    } else {
      chart = init(element, undefined, { renderer: 'svg' })
      render()
    }
  })
  observer.observe(element)
})

watch(() => props.option, render, { deep: true })

onUnmounted(() => {
  observer?.disconnect()
  chart?.dispose()
})
</script>

<template>
  <div role="img" :aria-label="label" style="min-width: 0; height: 12rem">
    <div ref="plot" aria-hidden="true" style="width: 100%; height: 100%" />
  </div>
</template>
