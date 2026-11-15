<script setup lang="ts">
import type { WorkspacePage } from './types'
defineProps<{ current: string; pages: readonly WorkspacePage[] }>()
const emit = defineEmits<{ navigate: [page: WorkspacePage] }>()
</script>
<template>
  <nav aria-label="업무 메뉴" class="flex flex-col gap-1">
    <a v-for="page in pages" :key="page.key" :href="`#${page.key}`" :aria-current="current === page.key ? 'page' : undefined"
      class="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      :class="current === page.key ? 'bg-selected text-selected-foreground font-semibold underline underline-offset-4' : 'no-underline'"
      @click.prevent="emit('navigate', page)">{{ page.label }}</a>
  </nav>
</template>
