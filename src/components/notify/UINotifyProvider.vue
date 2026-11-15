<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useId } from 'vue'
import { notifyServiceKey } from './context'
import type { UINotifyProviderProps, UINotifyService, UINotifyType } from './types'

withDefaults(defineProps<UINotifyProviderProps>(), { position: 'top' })

interface Notice { id: string; message: string; title?: string; type: UINotifyType; trigger: HTMLElement | null }
interface Clock { remaining: number; started: number; timer?: ReturnType<typeof setTimeout> }
const labels: Record<UINotifyType, string> = { info: '안내', success: '성공', warning: '주의', error: '오류' }
const baseId = useId()
let sequence = 0
let alive = true
let mounted = false
let hovered = false
let focused = false
let hidden = false
const entries = shallowRef<Notice[]>([])
const visible = computed(() => entries.value.slice(0, 3))
const region = ref<HTMLElement>()
const cards = new Map<string, HTMLElement>()
const clocks = new Map<string, Clock>()
const polite = ref('')
const urgent = ref('')
let announcementPending = false
const pending = new Set<string>()

function stop(clock: Clock) {
  if (clock.timer !== undefined) {
    clearTimeout(clock.timer)
    clock.timer = undefined
    clock.remaining = Math.max(0, clock.remaining - (Date.now() - clock.started))
  }
}
function syncTimers() {
  const ids = new Set(visible.value.map(item => item.id))
  for (const [id, clock] of clocks) {
    if (!mounted || hovered || focused || hidden || !ids.has(id)) stop(clock)
    else if (clock.timer === undefined) {
      clock.started = Date.now()
      clock.timer = setTimeout(() => dismiss(id), clock.remaining)
    }
  }
}
function announceVisible() {
  for (const entry of visible.value) {
    if (!announced.has(entry.id)) pending.add(entry.id)
  }
  if (announcementPending || !pending.size || !mounted) return
  announcementPending = true
  polite.value = ''
  urgent.value = ''
  void nextTick(() => {
    announcementPending = false
    if (!alive) return
    const current = visible.value.filter(entry => pending.has(entry.id))
    pending.clear()
    for (const entry of current) announced.add(entry.id)
    const text = (entry: Notice) => `${labels[entry.type]}: ${entry.title ? entry.title + '. ' : ''}${entry.message}`
    polite.value = current.filter(entry => entry.type !== 'error').map(text).join('\n')
    urgent.value = current.filter(entry => entry.type === 'error').map(text).join('\n')
  })
}
const announced = new Set<string>()
function register(id: string, element: unknown) {
  if (element instanceof HTMLElement) cards.set(id, element)
  else cards.delete(id)
}
function restoreFocus(index: number, trigger: HTMLElement | null) {
  void nextTick(() => {
    if (!alive) return
    const candidate = visible.value[Math.min(index, visible.value.length - 1)]
    const button = candidate && cards.get(candidate.id)?.querySelector<HTMLButtonElement>('button')
    if (button) button.focus()
    else if (trigger?.isConnected) trigger.focus()
    focused = !!region.value?.contains(document.activeElement)
    syncTimers()
  })
}
function dismiss(id: string) {
  const entry = entries.value.find(item => item.id === id)
  if (!entry) return
  const index = visible.value.findIndex(item => item.id === id)
  const hadFocus = typeof document !== 'undefined' && !!cards.get(id)?.contains(document.activeElement)
  const clock = clocks.get(id)
  if (clock) stop(clock)
  clocks.delete(id)
  announced.delete(id)
  pending.delete(id)
  entries.value = entries.value.filter(item => item.id !== id)
  if (!entries.value.length) { hovered = false; focused = false }
  syncTimers()
  announceVisible()
  if (hadFocus) restoreFocus(Math.max(0, index), entry.trigger)
}
const service: UINotifyService = {
  notify(options) {
    if (!alive || !options.message.trim()) return null
    const type = options.type ?? 'info'
    const fallback = type === 'error' || type === 'warning' ? 0 : 5000
    const requested = options.duration ?? fallback
    const duration = Number.isFinite(requested) && requested >= 0 ? Math.min(requested, 2147483647) : fallback
    const id = `${baseId}-notify-${++sequence}`
    const active = typeof document !== 'undefined' ? document.activeElement : null
    // Keep a useful return target if notify is called from inside an existing notice.
    const trigger = typeof HTMLElement !== 'undefined' && active instanceof HTMLElement && !region.value?.contains(active) ? active : entries.value.find(item => cards.get(item.id)?.contains(active))?.trigger ?? null
    entries.value = [...entries.value, { id, message: options.message, title: options.title, type, trigger }]
    if (duration > 0) clocks.set(id, { remaining: duration, started: 0 })
    syncTimers()
    announceVisible()
    return id
  },
  dismiss,
  clear() {
    const active = typeof document !== 'undefined' ? document.activeElement : null
    const focusedEntry = entries.value.find(item => cards.get(item.id)?.contains(active))
    for (const clock of clocks.values()) stop(clock)
    clocks.clear()
    entries.value = []
    hovered = false
    focused = false
    polite.value = ''
    urgent.value = ''
    pending.clear()
    announced.clear()
    if (focusedEntry) restoreFocus(0, focusedEntry.trigger)
  },
}
provide(notifyServiceKey, service)
function pointer(inside: boolean) { hovered = inside; syncTimers() }
function focusin() { focused = true; syncTimers() }
function focusout(event: FocusEvent) {
  focused = !!region.value?.contains(event.relatedTarget as Node | null)
  syncTimers()
}
function visibility() { hidden = document.hidden; syncTimers() }
onMounted(() => {
  mounted = true
  hidden = document.hidden
  document.addEventListener('visibilitychange', visibility)
  syncTimers()
  announceVisible()
})
onBeforeUnmount(() => {
  alive = false
  for (const clock of clocks.values()) stop(clock)
  clocks.clear()
  pending.clear()
  announced.clear()
  if (mounted) document.removeEventListener('visibilitychange', visibility)
})
</script>

<template>
  <slot />
  <div class="ui-notify-announcer" role="status" aria-atomic="true">{{ polite }}</div>
  <div class="ui-notify-announcer" role="alert" aria-atomic="true">{{ urgent }}</div>
  <section v-show="visible.length" ref="region" class="ui-notify-region" :data-position="position" aria-label="알림" @pointerenter="pointer(true)" @pointerleave="pointer(false)" @focusin="focusin" @focusout="focusout">
    <ol class="ui-notify-list grid gap-3">
      <li v-for="entry in visible" :key="entry.id" :ref="element => register(entry.id, element)" class="ui-notify-card" :data-type="entry.type">
        <div class="ui-notify-content">
          <p class="ui-notify-kind">{{ labels[entry.type] }}</p>
          <p v-if="entry.title" class="ui-notify-title">{{ entry.title }}</p>
          <p class="ui-notify-message">{{ entry.message }}</p>
        </div>
        <button type="button" class="ui-notify-close" :aria-label="`${entry.title || entry.message} 알림 닫기`" @click="dismiss(entry.id)">닫기</button>
      </li>
    </ol>
    <p v-if="entries.length > visible.length" class="ui-notify-pending">대기 중인 알림 {{ entries.length - visible.length }}개</p>
  </section>
</template>
