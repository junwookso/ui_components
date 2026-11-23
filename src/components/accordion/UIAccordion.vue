<script setup lang="ts">
import { AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { computed, useId } from 'vue'
import { cn } from '../../lib/cn'
import type { UIAccordionItem, UIAccordionProps } from './types'

const props = withDefaults(defineProps<UIAccordionProps>(), { headingLevel: 3 })
const model = defineModel<string[]>()
const id = useId()
const initialValues = [...(props.defaultValue ?? [])]
defineSlots<{ content?: (props: { item: UIAccordionItem }) => unknown }>()

const openValues = computed(() => {
  const values = model.value ?? initialValues
  const available = new Set(props.items.map(item => item.value))
  const valid = [...new Set(values)].filter(value => available.has(value))
  return props.multiple ? valid : (valid[0] ?? '')
})

function updateOpen(value: unknown) {
  const values = Array.isArray(value) ? value : [value]
  model.value = values.filter((item): item is string => typeof item === 'string' && item !== '')
}

function moveFocus(event: KeyboardEvent) {
  const trigger = event.currentTarget as HTMLButtonElement
  const accordion = trigger.closest('.ui-accordion')
  if (!accordion) return

  const enabled = Array.from(accordion.querySelectorAll<HTMLButtonElement>('.ui-accordion-trigger:enabled'))
    .filter(button => button.closest('.ui-accordion') === accordion)
  const index = enabled.indexOf(trigger)
  if (index < 0) return
  const next = {
    ArrowDown: enabled[(index + 1) % enabled.length],
    ArrowUp: enabled[(index - 1 + enabled.length) % enabled.length],
    Home: enabled.at(0),
    End: enabled.at(-1),
  }[event.key]
  event.preventDefault()
  event.stopPropagation()
  next?.focus()
}
</script>

<template>
  <AccordionRoot
    :class="cn('ui-accordion', $props.class)"
    :type="multiple ? 'multiple' : 'single'"
    :model-value="openValues"
    :disabled="disabled"
    collapsible
    @update:model-value="updateOpen"
  >
    <AccordionItem v-for="(item, index) in items" :key="item.value" v-slot="{ open }" :value="item.value" :disabled="item.disabled" class="ui-accordion-item">
      <AccordionHeader :as="`h${headingLevel}`" class="ui-accordion-heading">
        <AccordionTrigger
          :id="`${id}-trigger-${index}`"
          :aria-controls="`${id}-panel-${index}`"
          class="ui-accordion-trigger"
          @keydown.up.down.home.end="moveFocus"
        >
          <span>{{ item.label }}</span>
          <span class="ui-accordion-chevron" aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <div
        :id="`${id}-panel-${index}`"
        role="region"
        :aria-labelledby="`${id}-trigger-${index}`"
        :data-open="open"
        :inert="!open"
        class="ui-accordion-panel"
      >
        <div class="ui-accordion-clip">
          <div class="ui-accordion-body"><slot name="content" :item="item">{{ item.content }}</slot></div>
        </div>
      </div>
    </AccordionItem>
  </AccordionRoot>
</template>
