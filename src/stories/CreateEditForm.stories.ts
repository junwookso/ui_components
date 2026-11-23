import { computed, defineComponent, nextTick, onUnmounted, ref, useId, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIAlert from '../components/alert/UIAlert.vue'
import UIButton from '../components/button/UIButton.vue'
import { useConfirm } from '../components/confirm/context'
import UIDialogProvider from '../components/dialog/UIDialogProvider.vue'
import UIFormField from '../components/form-field/UIFormField.vue'
import UIInput from '../components/input/UIInput.vue'
import UISelect from '../components/select/UISelect.vue'
import UITextarea from '../components/textarea/UITextarea.vue'

const teams = [
  { value: 'operations', label: '운영지원팀' },
  { value: 'platform', label: '플랫폼팀' },
  { value: 'finance', label: '재무팀' },
]
const emptyDraft = { title: '', team: '', details: '' }
const exampleRequest = {
  title: '업무 포털 접근 권한 추가',
  team: 'platform',
  details: '운영지원팀에 업무 포털 열람 권한을 추가해 주세요.',
}

type FormStoryArgs = {
  mode: 'create' | 'edit'
  response: 'success' | 'field-error' | 'service-error'
}

const meta = {
  title: 'Patterns/Create and Edit Form',
  args: { mode: 'create', response: 'success' },
  parameters: {
    layout: 'fullscreen',
    fullBleed: true,
    controls: { disable: true },
    docs: { description: { component: '업무 요청을 등록하고 수정하는 폼에서 반응형 배치와 취소·저장 흐름을 보여줍니다.' } },
  },
  render: args => {
    const RequestForm = defineComponent({
      components: { UIAlert, UIButton, UIFormField, UIInput, UISelect, UITextarea },
      setup: () => {
        const { confirm } = useConfirm()
        const id = useId()
        const titleId = `${id}-title`
        const teamId = `${id}-team`
        const saveErrorId = `${id}-save-error`
        const form = ref<HTMLFormElement>()
        const saveError = ref<HTMLElement>()
        const saved = ref(args.mode === 'edit' ? { ...exampleRequest } : null)
        const draft = ref({ ...(saved.value ?? emptyDraft) })
        const editing = computed(() => saved.value !== null)
        const dirty = computed(() => {
          const baseline = saved.value ?? emptyDraft
          return draft.value.title !== baseline.title || draft.value.team !== baseline.team || draft.value.details !== baseline.details
        })
        const submitted = ref(false)
        const saving = ref(false)
        const feedback = ref('')
        const serverTitleError = ref('')
        const serviceError = ref('')
        const titleError = computed(() => submitted.value && !draft.value.title.trim()
          ? '요청 제목을 입력해 주세요.'
          : serverTitleError.value)
        const teamError = computed(() => submitted.value && !draft.value.team ? '담당 팀을 선택해 주세요.' : '')
        const fieldErrors = computed(() => [
          { id: titleId, message: titleError.value },
          { id: teamId, message: teamError.value },
        ].filter(error => error.message))
        const showRecovery = args.response !== 'success'
        let response = args.response
        let timer: ReturnType<typeof setTimeout> | undefined

        watch(() => draft.value.title, () => {
          serverTitleError.value = ''
        })

        function focusField(fieldId: string) {
          form.value?.querySelector<HTMLElement>(`#${fieldId}`)?.focus()
        }

        async function focusFirstError() {
          await nextTick()
          const firstError = fieldErrors.value[0]
          if (firstError) focusField(firstError.id)
        }

        async function save() {
          if (saving.value) return
          submitted.value = true
          feedback.value = ''
          serviceError.value = ''
          if (fieldErrors.value.length) {
            await focusFirstError()
            return
          }

          const next = { ...draft.value, title: draft.value.title.trim() }
          const wasEditing = editing.value
          saving.value = true
          feedback.value = '저장 중입니다.'
          timer = setTimeout(async () => {
            const result = response
            response = 'success'
            saving.value = false
            if (result === 'field-error') {
              feedback.value = ''
              serverTitleError.value = '이미 같은 제목의 요청이 있습니다. 제목을 바꿔 주세요.'
              await focusFirstError()
              return
            }
            if (result === 'service-error') {
              feedback.value = ''
              serviceError.value = '저장 서비스에 연결하지 못했습니다. 입력한 내용은 유지됩니다. 다시 저장해 주세요.'
              await nextTick()
              saveError.value?.focus()
              return
            }
            saved.value = next
            draft.value = { ...next }
            submitted.value = false
            feedback.value = wasEditing ? '변경사항을 저장했습니다.' : '업무 요청을 등록했습니다.'
          }, 800)
        }

        function cancel() {
          if (saving.value) return
          draft.value = { ...(saved.value ?? emptyDraft) }
          submitted.value = false
          serverTitleError.value = ''
          serviceError.value = ''
          feedback.value = '변경사항을 취소했습니다.'
        }

        async function leave() {
          if (saving.value) return
          if (dirty.value) {
            const discard = await confirm({
              title: '저장하지 않은 변경사항을 버릴까요?',
              message: '목록으로 돌아가면 입력한 변경사항이 사라집니다.',
              cancelLabel: '계속 편집',
              confirmLabel: '변경사항 버리기',
            })
            if (!discard) return
          }
          const destination = new URL('./?path=/story/patterns-list-search--requests', window.location.href)
          const storybook = window.top ?? window
          storybook.location.assign(destination)
        }

        onUnmounted(() => clearTimeout(timer))
        return {
          teams, draft, editing, saving, feedback, titleError, teamError, fieldErrors, serviceError,
          form, saveError, titleId, teamId, saveErrorId, showRecovery, save, cancel, leave, focusField,
        }
      },
      template: `
        <main class="@container mx-auto flex min-h-dvh w-full max-w-3xl min-w-0 flex-col gap-6 px-4 py-6 sm:px-6">
          <header class="grid gap-1">
            <h1 class="ui-h1">업무 요청 {{ editing ? '수정' : '등록' }}</h1>
            <p class="ui-subtitle ui-text-muted">{{ editing ? '저장된 요청의 제목, 담당 팀, 상세 내용을 수정합니다.' : '제목과 담당 팀을 지정해 업무 요청을 등록합니다.' }}</p>
            <div v-if="showRecovery" class="mt-2 flex">
              <UIButton variant="outline" :disabled="saving" @click="leave">업무 요청 목록으로</UIButton>
            </div>
          </header>

          <form ref="form" class="grid min-w-0 gap-6" novalidate @submit.prevent="save" @reset.prevent="cancel" @input="feedback = ''">
            <UIAlert v-if="fieldErrors.length" type="error" title="입력 내용을 확인해 주세요.">
              <ul class="grid gap-1">
                <li v-for="error in fieldErrors" :key="error.id">
                  <a :href="'#' + error.id" class="underline underline-offset-2" @click.prevent="focusField(error.id)">{{ error.message }}</a>
                </li>
              </ul>
            </UIAlert>

            <div v-if="serviceError" ref="saveError" role="group" aria-label="저장 오류" :aria-describedby="saveErrorId" tabindex="-1">
              <UIAlert type="error" title="저장하지 못했습니다.">
                <p :id="saveErrorId">{{ serviceError }}</p>
              </UIAlert>
            </div>

            <section class="grid min-w-0 gap-4 rounded-md border border-border bg-surface p-4">
              <h2 class="ui-h2">기본 정보</h2>
              <div class="grid gap-4 @min-[36rem]:grid-cols-2">
                <UIFormField :id="titleId" v-slot="{ controlAttrs }" label="요청 제목" required :error="titleError">
                  <UIInput v-bind="controlAttrs" v-model="draft.title" name="title" :disabled="saving" />
                </UIFormField>
                <UIFormField :id="teamId" v-slot="{ controlAttrs }" label="담당 팀" required :error="teamError">
                  <UISelect v-bind="controlAttrs" v-model="draft.team" name="team" :options="teams" :disabled="saving" />
                </UIFormField>
              </div>
            </section>

            <section class="grid min-w-0 gap-4 rounded-md border border-border bg-surface p-4">
              <h2 class="ui-h2">상세 정보</h2>
              <UIFormField v-slot="{ controlAttrs }" label="요청 내용" description="담당 팀이 처리에 필요한 배경과 요청 사항을 입력해 주세요.">
                <UITextarea v-bind="controlAttrs" v-model="draft.details" name="details" :rows="4" :disabled="saving" />
              </UIFormField>
            </section>

            <div class="grid gap-2">
              <div class="flex flex-wrap justify-end gap-2">
                <UIButton type="reset" variant="ghost" :disabled="saving">취소</UIButton>
                <UIButton type="submit" :loading="saving">{{ saving ? '저장 중' : '저장' }}</UIButton>
              </div>
              <p role="status" class="ui-body ui-text-muted text-right">{{ feedback }}</p>
            </div>
          </form>
        </main>
      `,
    })
    return {
      components: { UIDialogProvider, RequestForm },
      template: '<UIDialogProvider><RequestForm /></UIDialogProvider>',
    }
  },
} satisfies Meta<FormStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const CreateRequest: Story = {}

export const EditRequest: Story = {
  args: { mode: 'edit' },
}

export const FieldError: Story = {
  args: { mode: 'edit', response: 'field-error' },
}

export const SaveFailure: Story = {
  args: { mode: 'edit', response: 'service-error' },
}
