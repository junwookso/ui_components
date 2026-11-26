import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { UINotifyProvider } from '../index'
import UIAdminDashboard from './examples/UIAdminDashboard.vue'

const meta = {
  title: 'Patterns/Admin Dashboard',
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    controls: { disable: true },
    docs: { description: { component: '운영 현황, 기간별 차트와 업무 요청 관리 흐름을 한 화면에 배치한 관리자 샘플입니다.' } },
  },
} satisfies Meta

export default meta

export const Dashboard: StoryObj<typeof meta> = {
  render: () => ({
    components: { UIAdminDashboard, UINotifyProvider },
    setup() {
      const storageKey = 'ui-admin-dashboard-color-mode'
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
      const systemDark = ref(systemPreference.matches)
      const preferredDark = ref<boolean>()
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored === 'dark' || stored === 'light') preferredDark.value = stored === 'dark'
      } catch {
        // The system preference still applies when storage is unavailable.
      }
      const dark = computed({
        get: () => preferredDark.value ?? systemDark.value,
        set: (value: boolean) => {
          preferredDark.value = value
          try {
            localStorage.setItem(storageKey, value ? 'dark' : 'light')
          } catch {
            // Keep the in-memory choice when storage is unavailable.
          }
        },
      })
      function syncSystemMode(event: MediaQueryListEvent) {
        systemDark.value = event.matches
      }
      onMounted(() => systemPreference.addEventListener('change', syncSystemMode))
      onUnmounted(() => systemPreference.removeEventListener('change', syncSystemMode))
      return { dark }
    },
    template: `
      <div :data-ui-color-mode="dark ? 'dark' : undefined" class="admin-dashboard-theme min-h-dvh bg-page text-foreground">
        <UINotifyProvider position="bottom-right"><UIAdminDashboard v-model:dark="dark" /></UINotifyProvider>
      </div>
    `,
  }),
}
