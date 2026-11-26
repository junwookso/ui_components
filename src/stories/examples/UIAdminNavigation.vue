<script setup lang="ts">
import { UINavigationMenu, type UINavigationMenuItem } from '../../index'

defineProps<{
  items: readonly UINavigationMenuItem[]
  currentRouteName: string
}>()
const emit = defineEmits<{ select: [item: UINavigationMenuItem, event: MouseEvent] }>()
</script>

<template>
  <UINavigationMenu :items="items" :current-route-name="currentRouteName" label="운영 관리 메뉴" @select="(item, event) => emit('select', item, event)">
    <template #icon="{ item }">
      <span class="admin-navigation-icon" :data-icon="item.key"></span>
    </template>
  </UINavigationMenu>
</template>

<style scoped>
.admin-navigation-icon {
  display: block;
  position: relative;
  width: 1rem;
  height: 1rem;
}
.admin-navigation-icon[data-icon="operations"] {
  background:
    linear-gradient(currentColor 0 0) left .0625rem top .0625rem / .375rem .375rem no-repeat,
    linear-gradient(currentColor 0 0) right .0625rem top .0625rem / .375rem .375rem no-repeat,
    linear-gradient(currentColor 0 0) left .0625rem bottom .0625rem / .375rem .375rem no-repeat,
    linear-gradient(currentColor 0 0) right .0625rem bottom .0625rem / .375rem .375rem no-repeat;
}
.admin-navigation-icon[data-icon="overview"] {
  border: 1.5px solid currentColor;
  border-radius: .1875rem;
  background: linear-gradient(currentColor 0 0) center top .25rem / 100% 1.5px no-repeat;
}
.admin-navigation-icon[data-icon="trend"] {
  border-bottom: 1.5px solid currentColor;
  background:
    linear-gradient(currentColor 0 0) left .0625rem bottom .125rem / .1875rem .3125rem no-repeat,
    linear-gradient(currentColor 0 0) center bottom .125rem / .1875rem .5rem no-repeat,
    linear-gradient(currentColor 0 0) right .0625rem bottom .125rem / .1875rem .6875rem no-repeat;
}
.admin-navigation-icon[data-icon="teams"]::before,
.admin-navigation-icon[data-icon="teams"]::after,
.admin-navigation-icon[data-icon="request-management"]::before {
  content: '';
  position: absolute;
  border: 1.5px solid currentColor;
}
.admin-navigation-icon[data-icon="teams"]::before {
  inset-block-start: .0625rem;
  inset-inline-start: .3125rem;
  width: .375rem;
  height: .375rem;
  border-radius: 50%;
}
.admin-navigation-icon[data-icon="teams"]::after {
  inset: .5rem .125rem .0625rem;
  border-radius: .5rem .5rem .125rem .125rem;
}
.admin-navigation-icon[data-icon="request-management"] {
  height: .6875rem;
  align-self: end;
  margin-bottom: .0625rem;
  border: 1.5px solid currentColor;
  border-radius: 0 .1875rem .1875rem .1875rem;
}
.admin-navigation-icon[data-icon="request-management"]::before {
  inset-block-end: 100%;
  inset-inline-start: -1.5px;
  width: .4375rem;
  height: .25rem;
  border-block-end: 0;
  border-radius: .125rem .125rem 0 0;
}
.admin-navigation-icon[data-icon="requests"] {
  width: .75rem;
  margin-inline: .125rem;
  border: 1.5px solid currentColor;
  border-radius: .125rem;
  background:
    linear-gradient(currentColor 0 0) center 40% / 55% 1.5px no-repeat,
    linear-gradient(currentColor 0 0) center 70% / 55% 1.5px no-repeat;
}
</style>
