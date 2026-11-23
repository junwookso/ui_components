<script setup lang="ts">
import { computed } from 'vue'
import UINavigationMenu from '../../navigation-menu/UINavigationMenu.vue'
import type { UINavigationMenuItem } from '../../navigation-menu/types'
import type { WorkspacePage } from './types'
const props = defineProps<{ current: string; pages: readonly WorkspacePage[] }>()
const emit = defineEmits<{ navigate: [page: WorkspacePage] }>()
const items = computed(() => props.pages.map(page => ({ key: page.key, label: page.label, routeName: page.key, href: `#${page.key}` })))
function select(item: UINavigationMenuItem, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  const page = props.pages.find(page => page.key === item.key)
  if (page) emit('navigate', page)
}
</script>
<template>
  <UINavigationMenu label="업무 메뉴" :items="items" :current-route-name="current" @select="select" />
</template>
