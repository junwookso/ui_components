# Vue UI Components

Vue 3 + TypeScript + Tailwind CSS 기반 UI 패키지입니다. shadcn-vue의 Button을 출발점으로 디자인을 직접 관리하며, Storybook에서 컴포넌트를 만들고 다듬습니다.

## 시작하기

Node.js 22.12 이상과 pnpm 10.32.1을 사용합니다.

```sh
corepack enable
pnpm install
pnpm storybook
```

Storybook: http://localhost:6006

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
pnpm exec playwright install chromium
pnpm test:browser
```

브라우저 테스트는 정적 Storybook을 빌드하고 로컬 서버를 자동 실행합니다. 정적 Storybook은 `storybook-static/`, 라이브러리 ESM·타입 선언·Tailwind 입력 CSS는 `dist/`에 생성됩니다.

## 사용하기

```vue
<script setup lang="ts">
import { UIButton, type UIButtonProps } from '@ui-components/vue'

const variant: UIButtonProps['variant'] = 'default'
</script>

<template>
  <UIButton :variant="variant" @click="console.log('save')">저장</UIButton>
  <UIButton variant="outline" disabled>비활성</UIButton>
  <UIButton type="submit">제출</UIButton>
</template>
```

패키지 이름은 현재 작업용 `@ui-components/vue`이며 아직 registry에 배포하지 않습니다. 소비 앱은 Vue 3.5 이상과 Tailwind CSS 4.3.5 이상(4.x)을 제공하고 최종 CSS를 빌드합니다. Vue와 Tailwind는 peer dependency입니다.

`variant`: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`.
`size`: `default`, `sm`, `lg`, `icon`. 기본 슬롯, 네이티브 속성/이벤트, `disabled`, `type`, `class`를 지원합니다. 기본 `type`은 `button`입니다. `asChild`나 링크 렌더링은 제공하지 않습니다.

### 서비스의 Tailwind 설정

Vite 서비스에서는 `tailwindcss`와 `@tailwindcss/vite`를 개발 의존성으로 설치하고 Vite 플러그인을 등록합니다. UI 패키지의 `@tailwindcss/vite`는 로컬 개발 도구이며 서비스가 자신의 빌드 도구에 맞춰 설정합니다.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [vue(), tailwindcss()] })
```

서비스 CSS 진입점에서 순서대로 import한 뒤 앱의 main.ts에서 그 CSS를 한 번 가져옵니다.

```css
/* src/style.css */
@import "tailwindcss";
@import "@ui-components/vue/style.css";
```

```ts
// src/main.ts
import './style.css'
```

패키지 `style.css`는 **Tailwind 입력 CSS**입니다. 브라우저에 직접 링크하는 완성된 CSS가 아닙니다. 패키지 내부 클래스 탐색은 함께 제공하는 상대 경로 `@source`가 처리하므로 서비스에서 별도로 등록할 필요가 없습니다. 서비스 소스에 쓰는 클래스는 서비스의 Tailwind가 탐색합니다. `col-span-${size}` 같은 문자열 조합 대신 완전한 클래스 문자열을 사용하세요.

기존 `@ui-components/vue/reset.css` 진입점은 제거했습니다. 기본 reset(Preflight)은 서비스의 Tailwind import에 포함되므로 중복 적용하지 않습니다. Preflight를 제외하려면 서비스 CSS에서 다음처럼 구성합니다.

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@import "@ui-components/vue/style.css";
```

### 화면 레이아웃

Grid·Flex·간격·반응형 배치는 서비스가 Tailwind로 작성합니다. 별도 `ui-grid`·`ui-col` 클래스는 제공하지 않습니다.

```html
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-12 md:col-span-6">프로젝트 이름</div>
  <div class="col-span-12 md:col-span-6">담당 부서</div>
</div>
```

컴포넌트의 크기·상태·외형과 `ui-title`·`ui-body` 같은 역할 클래스는 패키지가 관리합니다. 서비스는 Tailwind의 기본 크기·간격 스케일을 유지하고, 컬러는 `--ui-*`로 지정하는 것을 기본으로 합니다.

`pnpm build:consumer`는 패키지의 공개 export를 사용하는 작은 Vue 서비스를 빌드합니다. 패키지 빌드(`pnpm build`) 후 실행하며, `pnpm test:browser`에는 이 과정이 포함됩니다.

## 서비스 컬러 테마

패키지 CSS 다음에 서비스 CSS를 로드합니다. 컨테이너에서 변수를 재정의하면 해당 영역만 테마가 바뀝니다.

```css
:root {
  --ui-primary: #0369a1;
  --ui-primary-foreground: #ffffff;
  --ui-ring: #0284c7;
}
```

Storybook의 테마 툴바와 `Components/UIButton`에서 컬러·크기·variant·disabled·키보드 포커스를 확인합니다. Playground의 Controls에서 텍스트와 속성을 바꿀 수 있습니다.

## 개발 문서

- [AGENTS.md](./AGENTS.md): 개발 목적, 구조, 작업 규칙과 검증 방법
- [style-guide.md](./style-guide.md): 디자인 시스템 레퍼런스, 공통 UX·정보 밀도, 시각적 기초·테마 설계 지침, 구현된 토큰과 컴포넌트 명세
- [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md): shadcn-vue 라이선스

가이드에서는 현재 구현과 후속 적용 방향을 구분합니다. Carbon·Fiori·Fluent·Atlassian의 원칙을 참고하되 우리 프로젝트의 규칙을 우선하며, 테마 구현은 shadcn-vue의 CSS 변수 방식을 참고합니다.

현재는 단일 패키지입니다. 모노레포 이식과 배포 자동화는 이후에 다룹니다. shadcn-vue CLI로 덮어쓰지 않고 소스를 검토하여 UI 접두사·토큰·접근성 규칙에 맞게 반영합니다.


## 텍스트 입력과 폼

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInput, UIButton } from '@ui-components/vue'

const email = ref('')
</script>

<template>
  <form @submit.prevent="console.log(email)">
    <label for="email">이메일</label>
    <UIInput
      id="email"
      v-model="email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
      aria-describedby="email-help"
      required
    />
    <p id="email-help">연락받을 이메일 주소를 입력해 주세요.</p>
    <UIButton type="submit">저장하기</UIButton>
  </form>
</template>
```

`UIInput`과 `UIInputProps`를 공개합니다. 문자열 `v-model`, `size`(`sm`/`default`/`lg`), `disabled`, `readonly`, `invalid`, `class`를 지원합니다. `type`은 `text`/`email`/`password`/`search`/`tel`/`url`입니다. `id`, `name`, `required`, `autocomplete`, `maxlength`, `aria-*` 등 네이티브 속성과 이벤트는 input으로 전달됩니다.

오류 상태는 `:invalid="true"`로 지정하고 오류 메시지를 `aria-describedby`로 연결합니다. 검증과 메시지 내용은 소비 폼에서 관리합니다. 폼 초기화는 부모의 모델 값을 직접 초기화하세요.

Storybook `Components/UIInput`의 Playground, Sizes, States, Types, Form에서 입력 상태와 `UIButton`을 조합한 폼을 확인할 수 있습니다. 새 컬러 토큰 `--ui-muted-foreground`는 placeholder와 도움말 색상을 제어합니다.

입력과 버튼을 나란히 사용하는 예제는 `Components/UIInput → Inline Form`에 있습니다. `sm`, `default`, `lg`의 높이와 8px 간격을 비교하고, Enter 또는 검색 버튼으로 제출할 수 있습니다.

## SVG 아이콘 버튼

기본 슬롯에 SVG와 텍스트를 넣습니다. SVG는 버튼에서 16px로 표시되고 `currentColor`로 텍스트 색상을 따릅니다.

```vue
<UIButton>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
  추가하기
</UIButton>

<UIButton size="icon" variant="outline" aria-label="추가">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
</UIButton>
```

Storybook `Components/UIButton → Icon + Text`, `Icon Button`에서 확인할 수 있습니다.

## 입력 필드 앞·뒤 아이콘

`prefix`, `suffix` 슬롯에 SVG를 넣으면 해당 방향의 입력 여백을 자동으로 확보합니다. 둘을 동시에 사용할 수 있습니다.

```vue
<label for="icon-email">이메일</label>
<UIInput id="icon-email" v-model="email" type="email" placeholder="you@example.com">
  <template #prefix>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  </template>
</UIInput>
```

뒤쪽에 표시하려면 `#prefix`를 `#suffix`로 바꿉니다. 슬롯은 장식용이며 클릭 가능한 버튼이나 링크는 넣지 않습니다. 아이콘은 16px, 아이콘이 있는 쪽의 입력 패딩은 40px입니다.

`UIInput`은 위치 기준용 래퍼를 가지며 `id`, `class`, `style`과 네이티브 속성/이벤트는 내부 input에 전달합니다. 가로 폼의 flex 스타일은 `.ui-input-wrapper`에 적용합니다. Storybook의 `Prefix / Suffix Icons`, `Icon Sizes`에서 확인할 수 있습니다.

## 카드

`UICard`는 제목·본문·액션 영역을 제공합니다. `title`, `description`, `headingLevel`(기본 2), `class`를 지원하고 `UICardProps` 타입을 공개합니다. `#title`과 `#description` 슬롯으로 제목과 설명을 꾸밀 수 있습니다.

```vue
<UICard title="프로젝트 설정" description="프로젝트의 기본 정보를 관리합니다.">
  <p>프로젝트의 설정 내용을 확인하세요.</p>
  <template #actions>
    <UIButton variant="ghost">취소</UIButton>
    <UIButton variant="outline">미리보기</UIButton>
    <UIButton>저장하기</UIButton>
  </template>
</UICard>
```

`UICard`, `UIButton`은 `@ui-components/vue`에서 import합니다. 액션은 우측 정렬이며 주요 버튼 하나만 filled(`default`), 보조 버튼은 `outline`, 취소는 `ghost`를 사용합니다. 버튼 스타일과 동작은 슬롯을 제공하는 쪽에서 지정합니다. 좁은 화면에서는 버튼이 순서대로 줄바꿈됩니다.

실제 입력 폼은 `<form @submit.prevent="save">`로 카드를 감싸고 저장 버튼에 `type="submit"`을 지정하세요. Storybook `Components/UICard → Action Hierarchy`, `With Form`에서 확인할 수 있습니다.

## 스위치

`UISwitch`, `UISwitchProps`를 공개합니다. boolean `v-model`과 `disabled`를 지원하고 기본 상태는 꺼짐입니다. UIButton Docs처럼 회색 pill 안에 선택된 영역을 밝게 표시합니다. `falseLabel`(기본 `False`)·`trueLabel`(기본 `True`)로 상태 문구를 변경할 수 있습니다. 문구와 별개로 외부 label 또는 aria-label로 기능의 이름을 제공하세요.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISwitch } from '@ui-components/vue'
const enabled = ref(false)
</script>

<template>
  <label for="email-notifications">이메일 알림</label>
  <UISwitch id="email-notifications" v-model="enabled" name="emailNotifications" aria-describedby="notifications-help" />
  <p id="notifications-help">담당 업무가 변경되면 이메일로 알려드립니다.</p>
</template>
```

클릭·라벨 클릭·Space로 전환하고 Tab으로 이동합니다. 라벨은 상태와 관계없이 같은 이름을 유지하세요. `id`, `name`, `value`, `required`, `form`, `aria-*`, 네이티브 이벤트는 내부 checkbox로 전달되고 `class`는 바깥 래퍼에 적용됩니다. 폼 전송에는 켜진 항목만 포함되며 기본 값은 `on`입니다. 부모 모델을 초기화해 폼 상태를 초기화하세요.

Storybook `Components/UISwitch`의 Playground, States, With Description, Notification Settings에서 확인할 수 있습니다. 알림 설정 예제는 서버 호출 없이 로컬 상태만 변경합니다.

## 디자인 가이드 적용

`Foundations/Design Guide → Workplace`에서 컴포넌트를 조합한 업무 설정 화면을 확인하세요. 툴바의 neutral/ocean 테마로 같은 화면을 비교할 수 있습니다.

- 페이지는 `--ui-page-background`, 카드·입력·outline 버튼은 `--ui-surface`(미지정 시 기존 `--ui-background`)를 사용합니다. 페이지 배경은 소비 앱에서 명시적으로 적용하며 패키지가 body를 변경하지 않습니다.
- 입력·outline 버튼의 경계는 `--ui-control-border`, 카드 외곽은 `--ui-border`를 사용합니다.
- 버튼 hover·pressed는 불투명 색상입니다. `--ui-primary-hover`, `--ui-primary-pressed`를 지정하거나 현재 primary에서 자동 계산하도록 둘 수 있습니다.
- `--ui-disabled-background` / `--ui-disabled-foreground`로 비활성 상태를 표현하며 opacity를 줄이지 않습니다.
- 성공·주의·정보와 선택의 배경/글자색은 별도 토큰으로 제공됩니다. 전체 목록과 계산 규칙은 [스타일 가이드](./style-guide.md)를 참고하세요.

```vue
<UIButton :loading="saving" type="submit">
  {{ saving ? '저장 중' : '저장하기' }}
</UIButton>
```

`loading`은 진행 표시, `aria-busy`, disabled를 적용합니다. 실제 비동기 작업과 재진입 방지 로직은 소비 화면에서 관리합니다. 통합 예제는 800ms 로컬 저장 시뮬레이션이며 외부 서비스에 연결하지 않습니다.

## 탭

`UITabs`, `UITabsProps`, `UITabItem`을 공개합니다. `orientation`은 `horizontal`(기본) 또는 `vertical`입니다. `items`의 value는 탭 그룹 안에서 고유해야 하며, `label`은 탭 목록의 접근 가능한 이름입니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITabs, type UITabItem } from '@ui-components/vue'

const selected = ref('general')
const items: UITabItem[] = [
  { value: 'general', label: '기본 정보' },
  { value: 'notifications', label: '알림 설정' },
  { value: 'permissions', label: '접근 권한', disabled: true },
]
</script>

<template>
  <UITabs v-model="selected" :items="items" label="프로젝트 설정" orientation="horizontal">
    <template #icon="{ item }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path v-if="item.value === 'general'" d="M4 4h16v16H4zM8 9h8M8 15h5" />
        <path v-else d="M12 3a6 6 0 0 0-6 6v5l-2 3h16l-2-3V9a6 6 0 0 0-6-6M10 21h4" />
      </svg>
    </template>
    <template #panel="{ item }">
      <p v-if="item.value === 'general'">프로젝트 기본 정보</p>
      <p v-else-if="item.value === 'notifications'">알림 수신 설정</p>
      <p v-else>관리자 권한이 필요합니다.</p>
    </template>
  </UITabs>
</template>
```

세로 배치는 `orientation="vertical"`로 변경합니다. 아이콘 슬롯을 생략하면 텍스트만 표시합니다. 두 슬롯은 `{ item, active }`를 받습니다. 패널은 숨겨져도 마운트 상태를 유지합니다.

방향키로 포커스를 이동하고 Enter/Space로 전환합니다. disabled 항목은 건너뜁니다. 미지정·유효하지 않은 모델은 첫 활성 탭을 표시하며 부모 모델을 자동 수정하지 않습니다. Storybook `Components/UITabs`에서 가로·세로·아이콘·가로 스크롤 예제를 확인하세요.

탭은 폴더 라벨처럼 본문과 이어지는 형태입니다. 선택 탭은 본문과 같은 표면색, 미선택 탭은 옅은 회색이며 가로·세로 모두 연결부 구분선이 사라집니다. 미선택 탭은 계속 클릭 가능하고 `disabled` 항목만 조작할 수 없습니다.

## UIDialog

앱 루트에서 `<UIDialogProvider><AppContent /></UIDialogProvider>`로 호출 화면을 감쌉니다. Provider는 앱당 한 번, 서비스의 테마 영역 안에 배치합니다. `useDialog()`는 Provider의 자손 컴포넌트에서 호출합니다.

```ts
import { useDialog } from '@ui-components/vue'
import ProjectDialog from './ProjectDialog.vue'

interface ProjectPayload { name: string }
interface ProjectResult { name: string }

const { openDialog } = useDialog()
openDialog<ProjectPayload, ProjectResult>(ProjectDialog, {
  payload: { name: '신규 프로젝트' },
  closeOnBackdrop: true, // 기본값. false이면 배경 클릭 무시
  onResult: result => { console.log(result.name) },
  onCancel: reason => { console.log(reason) }, // 선택: cancel | escape | backdrop
})
```

업무별 다이얼로그는 독립된 Vue 컴포넌트입니다. `UIDialog`를 외형으로 사용하고 입력·검증·액션을 직접 구성합니다.

```vue
<script setup lang="ts">
import { ref, useId } from 'vue'
import { UIDialog, UIButton, UIInput, useDialogContext } from '@ui-components/vue'

const { payload, complete, cancel } = useDialogContext<{ name: string }, { name: string }>()
const name = ref(payload.name)
const id = useId()
const submit = () => {
  if (name.value.trim()) complete({ name: name.value.trim() })
}
</script>

<template>
  <UIDialog title="프로젝트 편집" description="프로젝트 이름을 입력해 주세요.">
    <form :id="id + '-form'" @submit.prevent="submit">
      <label :for="id + '-name'">프로젝트 이름</label>
      <UIInput :id="id + '-name'" v-model="name" autofocus required />
    </form>
    <template #actions>
      <UIButton variant="ghost" @click="cancel()">취소</UIButton>
      <UIButton type="submit" :form="id + '-form'">완료</UIButton>
    </template>
  </UIDialog>
</template>
```

- `UIDialog`는 필수 `title`, 선택적 `description`, `class`와 본문·`actions` 슬롯을 제공합니다. 자동 생성 버튼은 없습니다.
- `complete(result)`는 즉시 닫기를 시작하고 컴포넌트 해제·포커스 복귀 후 `onResult`를 한 번 호출합니다. 저장 등 후속 작업은 콜백에서 처리합니다.
- 취소 버튼·Escape·허용된 배경 클릭은 `onCancel`만 호출합니다. 입력 폼을 초기화한 새 인스턴스로 다시 엽니다.
- payload는 자동 복제하지 않습니다. 다이얼로그가 수정할 데이터는 로컬 상태로 복사해야 하며 중첩 객체도 직접 변경하지 않습니다. 호출과 내부 context의 제네릭 타입은 동일한 타입을 공유하세요. 임의 Vue 컴포넌트와 제네릭의 일치는 자동 추론되지 않습니다.
- 이미 열려 있거나 종료 중이면 `openDialog`는 `false`, 호출을 수락하면 `true`를 반환합니다. 중첩·대기열·Promise 결과 반환은 지원하지 않습니다.
- Provider 해제 시 콜백 없이 정리합니다. Provider 바깥의 `useDialog`, 열린 다이얼로그 바깥의 `useDialogContext` 사용은 오류입니다.
- 네이티브 `HTMLDialogElement.showModal()`을 지원하는 브라우저가 필요합니다. 모달은 Provider 위치의 테마를 상속합니다. 모달 내부에 띄우는 팝업 역시 해당 dialog 내부에 렌더링해야 합니다.

Storybook `Components/UIDialog`의 Project Form, Backdrop Locked, Long Content에서 확인합니다.

## 타이포그래피

`style.css`에 포함된 명시적인 클래스로 표현합니다. 전역 heading·문단 스타일은 변경하지 않으며 별도 Vue 컴포넌트는 필요하지 않으며 서비스의 Tailwind 빌드에 포함됩니다.

```html
<h1 class="ui-h1">프로젝트 관리</h1>
<p class="ui-subtitle ui-text-muted">프로젝트와 담당자를 관리합니다.</p>
<h2 class="ui-title">기본 정보</h2>
<p class="ui-body">프로젝트에 필요한 기본 정보를 입력해 주세요.</p>
<p class="ui-caption ui-text-muted">최근 수정: 2026.11.14</p>
```

`ui-h1`~`ui-h6`는 제목 스케일, `ui-title`은 카드·다이얼로그 제목, `ui-subtitle`은 제목 설명, `ui-body`·`ui-body-lg`는 본문, `ui-caption`은 보조 정보, `ui-label`은 폼 라벨입니다. heading 태그는 문서 계층에 따라 선택하며 스타일 클래스와 독립적입니다.

클래스는 글꼴·크기·줄 높이·굵기·기본 자간을 지정하고 margin을 0으로 초기화합니다. 요소 사이 여백은 레이아웃에서 정합니다. 색상은 상속하며 보조 설명에 `ui-text-muted`를 조합합니다. 필수 안내와 오류는 caption 대신 14px 이상의 본문을 사용합니다.

정확한 수치와 역할은 [스타일 가이드](./style-guide.md#타이포그래피와-형태), 시각적 예제는 Storybook `Foundations/Typography`의 Scale·Workplace를 참고하세요.

## 트리

`UITree`, `UITreeProps`, `UITreeItem`을 공개합니다. 조직·폴더처럼 계층이 있는 데이터의 단일 선택에 사용합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITree, type UITreeItem } from '@ui-components/vue'

const selected = ref<string>()
const expanded = ref(['engineering'])
const items: UITreeItem[] = [
  { value: 'engineering', label: '개발본부', children: [
    { value: 'platform', label: '플랫폼팀' },
    { value: 'service', label: '서비스개발팀' },
  ] },
  { value: 'hr', label: '인사팀 (접근 권한 없음)', disabled: true },
]
</script>

<template>
  <UITree v-model="selected" v-model:expanded="expanded" :items="items" label="조직 선택" />
</template>
```

- 필수 `items`, `label`과 선택적 `emptyText`, `class`를 받습니다. `value`는 전체 트리에서 고유하고 안정적인 문자열이어야 합니다. `children: []`는 말단 항목입니다.
- `v-model`은 선택된 value, `v-model:expanded`는 펼친 value 배열입니다. 생략하면 내부 상태로 동작하며 최초에는 선택 없음·모두 접힘입니다. 초기 펼침은 expanded 모델로 지정합니다.
- 행 클릭·Enter·Space로 선택하고 펼침 표시 클릭으로 접거나 펼칩니다. 방향키는 선택값을 바꾸지 않습니다. 위/아래는 보이는 활성 항목, 오른쪽은 펼치기·자식 이동, 왼쪽은 접기·부모 이동, Home/End는 처음/마지막으로 이동합니다. RTL에서는 좌우 키가 반대입니다. 문자 입력은 보이는 항목의 라벨 접두어를 찾습니다(700ms 내 연속 입력, 조합 중인 IME 키 제외).
- disabled는 하위 전체에 적용되어 선택·펼침·포커스 탐색에서 제외됩니다. 외부 expanded에 포함된 비활성 하위 항목도 비활성 상태로 표시합니다.
- 접혀서 숨겨진 선택값은 유지합니다. 삭제·비활성화된 선택은 표시하지 않으며 부모 모델을 자동으로 변경하지 않습니다. 숨겨진 선택 항목을 자동으로 펼치지 않습니다.
- `#icon="{ item, expanded, selected }"`은 장식용 SVG 슬롯입니다. `currentColor`, `focusable="false"`를 사용하고 버튼·링크는 넣지 않습니다. 텍스트 라벨은 항상 유지합니다.
- 데이터가 비어 있으면 `emptyText`(기본 `표시할 항목이 없습니다.`)를 표시합니다. 체크박스 다중 선택, 비동기 로딩, 드래그 정렬, 가상 스크롤은 제공하지 않습니다.

Storybook `Components/UITree`의 Organization, With Icons, Empty, Long Labels, Disabled에서 확인합니다.

## 데이터 테이블

`UIDataTable`은 **TanStack Table v8 (`@tanstack/vue-table` 8.21.3)** 기반의 headless 데이터 계산과 프로젝트 테마를 결합합니다. 정렬·검색·페이지 계산·행 선택을 위해 런타임 의존성을 추가했으며, 아이콘이나 별도 UI 프레임워크는 필요하지 않습니다. 현재는 **전체 데이터를 전달하는 클라이언트 방식**입니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UIDataTable, UIButton, type UIDataTableColumn,
  type UIDataTableRowSelection, type UIDataTablePagination,
} from '@ui-components/vue'

interface Employee { id: string; name: string; team: string; projects: number }
const employees = ref<Employee[]>([
  { id: 'employee-1', name: '김민수', team: '플랫폼팀', projects: 3 },
  { id: 'employee-2', name: '이서연', team: '디자인팀', projects: 5 },
])
const columns: UIDataTableColumn<Employee>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'team', header: '소속' },
  { accessorKey: 'projects', header: '프로젝트 수', meta: { align: 'end' } },
  { id: 'actions', header: '작업', enableSorting: false },
]
const selected = ref<UIDataTableRowSelection>({})
const pagination = ref<UIDataTablePagination>({ pageIndex: 0, pageSize: 10 })
const selectedEmployee = ref<Employee>()
</script>

<template>
  <UIDataTable
    :data="employees" :columns="columns" label="직원 목록"
    :get-row-id="row => row.id" :get-row-label="row => row.name"
    searchable selectable
    v-model:row-selection="selected" v-model:pagination="pagination"
  >
    <template #toolbar="{ selectedRows, clearSelection }">
      <UIButton variant="ghost" size="sm" :disabled="!selectedRows.length" @click="clearSelection">선택 해제</UIButton>
    </template>
    <template #cell-actions="{ row }">
      <UIButton variant="outline" size="sm" @click="selectedEmployee = row">상세 보기</UIButton>
    </template>
  </UIDataTable>
  <p v-if="selectedEmployee">선택한 직원: {{ selectedEmployee.name }}</p>
</template>
```

| API | 설명 |
| --- | --- |
| `data`, `columns`, `label`, `getRowId` | 필수. 전체 데이터, TanStack ColumnDef 배열, 보이는 표 제목, 고유하고 안정적인 행 ID 함수 |
| `getRowLabel` | 선택 checkbox 이름에 사용할 행 설명. 생략하면 ID 사용 |
| `searchable` | 검색 입력 표시, 기본 false. accessor 문자열·숫자 값의 부분 일치 검색 |
| `selectable`, `canSelectRow` | checkbox 표시(기본 false), 선택 가능 여부 함수 |
| `paginated` | 기본 true. false이면 전체 결과 표시 |
| `v-model:sorting` | `UIDataTableSorting`, 기본 `[]`. 정렬 버튼은 단일 컬럼 정렬 |
| `v-model:pagination` | `UIDataTablePagination`, 기본 `{ pageIndex: 0, pageSize: 10 }` |
| `v-model:row-selection` | `UIDataTableRowSelection`, 기본 `{}`. `{ [rowId]: true }` |
| `v-model:global-filter` | 검색어 문자열, 기본 `''`. 검색 입력을 숨겨도 외부에서 제어 가능 |
| `loading`, `error`, `emptyText` | 로딩·오류·데이터 없음 표시. 기본 빈 문구는 `등록된 데이터가 없습니다.` |
| `@retry` | 오류 상태의 다시 시도 요청. 서버 호출은 소비 화면이 담당 |
| `#toolbar` | `{ selectedRows, clearSelection }`. 선택된 유효 원본 행 전체와 선택 초기화 함수 |
| `#cell-컬럼ID`, `#cell` | `{ row, cell, value }`. 특정 컬럼 슬롯이 공통 cell 슬롯보다 우선. 둘 다 없으면 ColumnDef.cell 사용 |

컬럼에는 `accessorKey` 또는 `accessorFn`+`id`, `header`, `cell`, `enableSorting`, `enableGlobalFilter`, `meta.align`(`start`/`center`/`end`)을 지정할 수 있습니다. display 컬럼은 고유 id를 지정하세요. 정렬 가능한 header의 커스텀 렌더러에는 버튼·링크를 넣지 않습니다. TanStack의 header/cell 렌더러는 Vue `h()`도 사용할 수 있습니다.

모델을 생략하면 내부 상태로 동작합니다. 검색·정렬 변경은 첫 페이지로 이동하며 데이터 감소·유효하지 않은 페이지 값은 보정해 `update:pagination`으로 알립니다. 외부 모델은 emit된 값을 반영하세요. 데이터를 변경할 때는 배열을 새로 할당하세요.

헤더 checkbox는 **현재 페이지의 선택 가능한 행만** 선택합니다. 페이지·검색 이동 후에도 선택을 보존하며 선택 개수와 toolbar의 selectedRows는 검색과 무관하게 현재 data 전체 중 유효하고 선택 가능한 행을 기준으로 합니다. 삭제된 행의 ID는 rowSelection 모델에서 자동 제거하지 않으므로 데이터 범위 변경이나 작업 완료 후 모델을 초기화하세요. `getRowId`에 배열 index를 사용하지 마세요.

로딩·오류 중에는 기존 행과 내장 조작을 차단합니다(오류 시 검색어 수정은 가능). toolbar 슬롯의 버튼은 소비 화면에서 loading/error/권한에 맞게 비활성화하세요. 네이티브 table·caption·th와 정렬 버튼, checkbox, select를 사용하며 좁은 화면에서는 표 영역만 가로 스크롤합니다.

서버 정렬·검색·페이지네이션, 가상 스크롤, 셀 편집, 컬럼 리사이즈·이동·숨김 UI는 제공하지 않습니다. 부분 페이지만 받아오는 서버 API에는 현재 클라이언트 모드를 적용하지 마세요. [TanStack Vue Table 공식 문서](https://tanstack.com/table/v8/docs/framework/vue/vue-table)와 [스타일 가이드](./style-guide.md#uidatatable)를 참고하세요.

Storybook `Components/UIDataTable`에서 직원 목록, 기본 표, 로딩·오류·빈 상태, 커스텀 셀 예제를 확인할 수 있습니다.

## Chip

`UIChip`, `UIChipProps`를 공개합니다. 상태·분류·적용된 조건을 표시하며 기본은 읽기 전용입니다. 기본 variant는 filled 배경(`--ui-secondary`)과 1px 테두리(`--ui-border`)를 함께 표시합니다.

```vue
<UIChip label="승인 완료" variant="success" />
<UIChip label="검토 필요" variant="warning" size="sm" />
<UIChip label="플랫폼팀" removable @remove="removeTeamFilter" />
<UIChip label="고정 조건" removable disabled />
```

`UIChip`은 `@ui-components/vue`에서 import합니다.

| prop | 기본값 / 설명 |
| --- | --- |
| `label` | 필수 표시 텍스트 |
| `variant` | `default`, `outline`, `primary`, `success`, `warning`, `info`, `destructive` |
| `size` | `default`(최소 32px), `sm`(최소 28px). 글자는 둘 다 14px |
| `removable` | false. true이면 제거 버튼 표시 |
| `disabled` | false. 비활성 외형과 제거 버튼 비활성화 |
| `removeLabel` | 제거 버튼의 접근 가능한 이름. 기본 `${label} 제거` |
| `class` | 루트 span에 적용 |

`#icon` 슬롯은 앞쪽 장식용 16px SVG를 받습니다. `currentColor`, `focusable="false"`를 사용하고 버튼·링크는 넣지 않습니다. 긴 label은 잘리지 않고 줄바꿈하며, 여러 Chip의 배치는 소비 화면이 `flex flex-wrap gap-2` 등으로 정합니다.

제거 버튼은 클릭·Enter·Space로 `remove(MouseEvent)`를 전달합니다. 라벨 클릭은 제거를 실행하지 않으며, 제거 버튼의 클릭은 부모로 전파하지 않고 폼을 제출하지 않습니다. 컴포넌트가 스스로 사라지지 않으므로 부모에서 배열을 갱신하세요. 키보드 포커스가 있는 Chip을 제거할 때는 `nextTick()` 후 다음/이전 제거 버튼 또는 입력·초기화 버튼으로 포커스를 복구하고, 필요한 경우 상태 메시지를 안내하세요.

선택 토글이나 링크로 사용하는 API는 없습니다. Storybook **Components/UIChip → Removable**에서 목록 갱신과 포커스 복구를 포함한 예제를 확인할 수 있습니다. **Variants**, **Sizes And Icons**, **Long Label**과 데이터 테이블의 상태 셀에서도 사용 예를 볼 수 있습니다.

## Progress bar

`UIProgress`, `UIProgressProps`를 공개합니다. 실제 처리량을 전달하면 진행률을 표시하고, value를 생략하거나 null로 지정하면 진행률을 알 수 없는 상태를 표시합니다.

```vue
<script setup lang="ts">
import { UIProgress } from '@ui-components/vue'
</script>

<template>
  <UIProgress label="파일 업로드" :value="45" />
  <UIProgress label="문서 처리" :value="3" :max="10" value-text="3 / 10건" />
  <UIProgress label="보고서 생성" :value="null" description="전체 처리량을 확인하고 있습니다." />
  <UIProgress label="업로드 완료" :value="100" variant="success" />
  <UIProgress label="업로드 중단" :value="45" variant="destructive" description="연결을 확인한 뒤 다시 시도해 주세요." />
</template>
```

| prop | 기본값 / 설명 |
| --- | --- |
| `label` | 필수. 보이는 작업 이름이자 접근 가능한 이름 |
| `value` | 처리량. 미지정·null·NaN·Infinity는 불확정 상태, 0은 0% |
| `max` | 100. 전체 처리량. 양의 유한 숫자가 아니면 100으로 보정 |
| `valueText` | 기본 퍼센트 또는 ‘진행 중’을 대체하는 표시·접근성 문구 |
| `description` | 막대 아래 보충 설명. 네이티브 progress에 연결 |
| `showValue` | true. false이면 시각적 값 문구만 숨김 |
| `size` | `sm`(4px), `default`(8px), `lg`(12px) |
| `variant` | `default`, `success`, `destructive`. 색상만 변경 |
| `class` | 전체 래퍼에 적용. id·style 등 일반 속성도 래퍼로 전달 |

value는 0~max로 제한하며 부모 데이터는 수정하지 않습니다. 퍼센트는 소수점을 버리고 막대 너비는 실제 비율을 사용합니다. valueText를 지정하면 실제 값에 맞게 갱신하세요. 색상 변경은 완료나 실패를 자동으로 선언하지 않으므로 라벨·설명도 함께 제공하세요.

네이티브 progress의 접근성 의미를 유지하며 Tab 순서에 넣지 않습니다. 불확정 애니메이션은 모션 줄이기 설정에서 정지합니다. 작업 영역의 `aria-busy`와 완료·실패 시 `role="status"` 안내는 소비 화면이 관리하세요. 진행률 변경마다 실시간 낭독을 강제하지 않습니다.

Storybook **Components/UIProgress**에서 크기·상태·사용자 지정 값·버튼으로 진행량을 갱신하는 로컬 예제를 확인할 수 있습니다.

## Circle progress

`UICircleProgress`, `UICircleProgressProps`를 공개합니다. 완료량을 알 수 없는 요청·저장·생성 중 상태를 표시합니다.

```vue
<UICircleProgress label="보고서 생성" size="default" />
<UICircleProgress label="첨부 파일 업로드" size="sm" description="업로드가 끝나면 결과를 안내합니다." />
<UICircleProgress label="대량 데이터 내보내기" size="lg" />
```

`label`은 진행 중인 작업 이름으로 필수입니다. `description`은 선택 보충 설명이며, 크기는 `sm` 16px, `default` 32px, `lg` 48px입니다. 회전 애니메이션은 모션 줄이기 설정에서 정지합니다. native `role="status"`로 로딩과 작업 설명을 안내하며 포커스 가능한 컨트롤은 아닙니다.

완료 비율을 알고 있다면 원형 로딩 표시 대신 `UIProgress`를 사용하세요. 실제 비동기 처리와 완료·오류 안내는 사용하는 화면이 관리합니다. Storybook **Components/UICircleProgress**의 Sizes와 In Context에서 확인할 수 있습니다.

## 상세 정보 (Descriptions)

`UIDescriptions`, `UIDescriptionsProps`, `UIDescriptionItem`을 공개합니다. 한 건의 상세 정보를 `dl/dt/dd`로 표현하며 기본은 **라벨 배경과 테두리가 있는 가로 배치**입니다.

```vue
<script setup lang="ts">
import { UIDescriptions, UIChip, type UIDescriptionItem } from '@ui-components/vue'
const items: UIDescriptionItem[] = [
  { key: 'name', label: '이름', value: '김민수' },
  { key: 'team', label: '부서', value: '플랫폼팀' },
  { key: 'status', label: '재직 상태', value: '재직' },
  { key: 'projects', label: '프로젝트 수', value: 0 },
  { key: 'phone', label: '내선', value: null },
]
</script>

<template>
  <UIDescriptions label="직원 기본 정보" :items="items">
    <template #value-status="{ value }">
      <UIChip :label="String(value)" variant="success" size="sm" />
    </template>
  </UIDescriptions>
</template>
```

- 필수 `label`은 보이는 제목이고 `headingLevel`(기본 2)은 2~6을 지원합니다. `items`의 key는 목록에서 고유해야 하며 label은 필수, value는 문자열·숫자·boolean·null입니다.
- `bordered`는 기본 true입니다. false이면 배경과 구분선을 제거합니다.
- `layout`은 기본 horizontal입니다. **컴포넌트 너비 480px 이하**에서 자동으로 라벨 위·값 아래로 전환합니다. vertical이면 항상 세로 배치합니다.
- `emptyValue`(기본 `미등록`)는 null·undefined·공백/빈 문자열을 대체합니다. 0과 false는 각각 `0`, `아니요`로 보존하며 true는 `예`로 표시합니다.
- `emptyText`(기본 `표시할 정보가 없습니다.`)는 items가 비었을 때 표시합니다.
- `#value-키`와 공통 `#value` 슬롯은 `{ item, value }`를 받습니다. 특정 키 슬롯이 우선하며 링크·Chip·작업 버튼을 넣을 수 있습니다. 날짜·통화 형식은 소비 화면에서 지정하세요.
- `class`, `style`, `id` 등은 전체 section에 전달합니다. 긴 라벨·값은 줄바꿈하며 값의 개행을 유지합니다. 여러 상세 정보 영역의 페이지 배치는 서비스에서 Tailwind로 작성합니다.

행별 비교·검색·정렬은 `UIDataTable`, 한 건의 읽기 전용 상세 정보는 `UIDescriptions`를 사용하세요. Storybook **Components/UIDescriptions**에 가로·세로·테두리 없음·슬롯·긴 내용·좁은 컨테이너·빈 상태 예제가 있습니다.

## Notify action

앱 루트에 `UINotifyProvider`를 두고 **하위 컴포넌트의 setup**에서 `useNotify()`를 호출한다. 반환된 함수는 이벤트·비동기 작업 완료 콜백에서도 사용할 수 있다. 별도 의존성은 없다.

```vue
<!-- App.vue -->
<template>
  <UINotifyProvider position="top"><RouterView /></UINotifyProvider>
</template>
<script setup lang="ts">
import { UINotifyProvider } from '@ui-components/vue'
</script>
```

```ts
import { useNotify } from '@ui-components/vue'
const { notify, dismiss, clear } = useNotify()
const id = notify({ type: 'success', message: '변경사항을 저장했습니다.' })
notify({ type: 'error', title: '저장 실패', message: '연결을 확인하고 다시 시도해 주세요.' })
if (id) dismiss(id) // 특정 알림 닫기
clear() // 대기열까지 모두 닫기
```

- `message`: 필수 문자열. `title`: 선택 제목. HTML은 실행하지 않는다.
- `type`: `info`(기본), `success`, `warning`, `error`.
- `duration`: 밀리초. 안내·성공 기본 5000, 주의·오류 기본 0(직접 닫기). 0으로 자동 닫기를 끈다. 음수·비유한 값은 유형별 기본값, 최대값은 2147483647이다.
- `notify()`는 고유 ID를 반환한다. 공백 메시지나 provider 해제 후 호출은 `null`이다. `dismiss(id)`는 없는 ID를 무시한다. 타입은 `UINotifyOptions`, `UINotifyType`, `UINotifyService`, `UINotifyPosition`, `UINotifyProviderProps`로 export한다.
- `UINotifyProvider`의 `position`은 `top`(기본, 위 중앙), `top-left`, `top-right`, `bottom`(아래 중앙), `bottom-left`, `bottom-right`이다. 좌우는 RTL에서도 물리적인 좌우를 유지한다. 기존 오른쪽 아래 배치는 `position="bottom-right"`로 지정한다. provider의 모든 알림에 적용되며 표시 중 변경해도 대기열·타이머를 초기화하지 않는다. 최대 3개를 표시한다. 나머지는 입력 순서대로 대기하며 표시된 뒤 타이머를 시작한다. 알림 영역 hover·내부 키보드 포커스·백그라운드 탭에서는 남은 시간을 멈춘다.
- 새 알림은 포커스를 옮기지 않는다. 닫기 버튼을 조작하면 다음 알림의 닫기 버튼, 마지막이면 알림을 호출했던 요소로 포커스를 돌린다. 오류는 `alert`, 나머지는 `status`로 안내한다.
- provider별 상태는 독립적이다. 같은 setup에서 provider를 렌더링하고 `useNotify()`를 호출할 수는 없다. 반드시 자손에서 호출한다.
- 테마 상속을 위해 provider 위치에 렌더링한다. 화면 전체 알림용 provider는 테마 루트 안, transform·overflow 등으로 제한되는 컨테이너 밖에 둔다. 네이티브 모달 dialog 안에서 즉시 표시할 알림은 dialog 안의 provider를 사용한다. 바깥 provider의 알림은 모달 top layer 위에 표시되지 않는다.
- 재확인이 필요한 업무 정보는 본문에도 남기거나 `duration: 0`으로 제공한다. Storybook `Actions/Notify`에서 유형·대기열·수동 닫기·긴 메시지를 확인한다.

## Confirm action

기존 `UIDialogProvider` 아래의 컴포넌트에서 `useConfirm()`을 호출한다. 별도 provider나 의존성 없이 UIDialog와 동일한 모달·테마·버튼 스타일을 사용한다.

```ts
import { useConfirm } from '@ui-components/vue'
const { confirm } = useConfirm()

async function removeProject() {
  const confirmed = await confirm({
    title: '프로젝트를 삭제할까요?',
    message: '프로젝트와 연결된 설정이 삭제됩니다.\n삭제한 내용은 복구할 수 없습니다.',
    confirmLabel: '프로젝트 삭제',
    destructive: true,
  })
  if (!confirmed) return
  // 여기에서 삭제 요청을 실행한다.
}
```

- `title`, `message`: 필수 문자열. 본문은 줄바꿈을 유지하고 HTML을 실행하지 않는다.
- `confirmLabel` / `cancelLabel`: 기본 ‘확인’ / ‘취소’. 빈 라벨도 기본값을 사용한다.
- `destructive`: 기본 false. true이면 확인 버튼만 기존 destructive 스타일로 표시한다.
- `closeOnBackdrop`: 기본 false. true이면 배경 클릭으로 취소한다. 취소 버튼과 Escape는 항상 취소한다.
- `confirm()`은 `Promise<boolean>`을 반환한다. 명시적 확인만 true, 취소·Escape·배경 닫기는 false이다. 정상 종료 시 모달 제거와 호출 요소로 포커스 복귀 후 결과를 전달한다.
- 초기 포커스는 취소 버튼이다. 같은 provider에서 일반 dialog 또는 confirm이 열려 있거나 닫히는 중이면 새 요청은 즉시 false이다. 대기열이나 중첩 모달은 만들지 않는다. 열린 일반 dialog 내부에서 같은 provider의 confirm을 호출해도 false이다.
- provider가 해제되면 대기 중인 Promise를 false로 완료한다. 해제 후 호출도 false이다. provider별 상태는 독립적이다.
- 서버 요청·로딩·오류 처리는 호출 화면이 담당한다. 확인창 안에서 입력이나 비동기 처리가 필요하면 기존 `useDialog().openDialog()`를 사용한다.
- 공개 타입: `UIConfirmOptions`, `UIConfirmService`. Storybook `Actions/Confirm`에서 기본·삭제·배경 닫기·긴 본문 예제를 제공한다.

## UIList

제목·설명 중심의 업무 목록이다. `label`은 보이는 섹션 제목, `items`는 고유 `key`·`title`·선택 `description`을 가진 배열이다.

```vue
<script setup lang="ts">
import { UIList, UIButton, type UIListItem } from '@ui-components/vue'
const items: UIListItem[] = [
  { key: 'review', title: '접근 권한 검토', description: '플랫폼개발팀 · 김민수' },
]
function openDetail(key: string) { /* 상세 화면으로 이동 */ }
</script>
<template>
  <UIList label="검토할 업무" :items="items">
    <template #actions="{ item }">
      <UIButton variant="outline" size="sm" :aria-label="item.title + ' 상세 보기'" @click="openDetail(item.key)">상세 보기</UIButton>
    </template>
  </UIList>
</template>
```

- `headingLevel`: 2(기본)~6. `bordered`: 기본 true, false이면 외곽 경계·표면을 제거하고 행 구분선은 유지한다.
- `size`: `default`(행 패딩 16px), `sm`(12px). 글자 크기는 동일하다. 슬롯 컨트롤 크기는 직접 지정한다.
- `leading`, `title`, `description`, `meta`, `actions` 슬롯은 `{ item, index }`를 받는다. 제목·설명 슬롯은 기본 텍스트를 대체한다. leading에는 아이콘·아바타, meta에는 상태·날짜, actions에는 버튼을 배치한다.
- 빈 items에는 `emptyText`(기본 ‘표시할 항목이 없습니다.’) 또는 `empty` 슬롯을 표시한다.
- 네이티브 ul/li 기반이며 행 자체의 선택·클릭 이벤트는 없다. 이동은 title 슬롯의 링크, 작업은 actions 슬롯의 버튼을 사용한다. 반복되는 버튼은 항목 제목을 포함한 접근 가능한 이름을 지정한다. 장식용 아이콘에는 aria-hidden을 지정한다.
- 컨테이너가 480px 이하이면 상태·액션을 다음 줄에 배치한다. 긴 제목·설명은 줄바꿈하며 설명의 개행을 유지한다. class·id 등은 루트 section에 적용된다.
- 정렬·검색·페이지 이동·가상 스크롤은 제공하지 않는다. 표 형태의 컬럼 비교와 데이터 조작에는 UIDataTable을 사용한다.
- 공개 타입은 `UIListItem`, `UIListProps`. Storybook `Components/UIList`에 기본·작은 크기·테두리 없음·액션·링크·긴 본문·빈 상태 예제가 있다.

## UITopbar

서비스 공통 상단 바이다. 페이지 루트에서 main과 형제로 배치한다. 라우터·아이콘 라이브러리에 의존하지 않는다.

```vue
<script setup lang="ts">
import { UITopbar, UIButton } from '@ui-components/vue'
</script>
<template>
  <UITopbar title="업무 포털" sticky>
    <template #navigation>
      <a href="/tasks" aria-current="page">내 업무</a>
      <a href="/projects">프로젝트</a>
    </template>
    <template #actions><UIButton variant="outline" size="sm">로그아웃</UIButton></template>
  </UITopbar>
  <main><!-- 화면 콘텐츠 --></main>
</template>
```

- `title`: 필수 서비스 이름. `brand` 슬롯이 있으면 기본 문자열을 대체한다. 페이지 h1은 본문에서 제공한다.
- `label`: header 이름(기본 ‘상단 바’). `navigationLabel`: navigation 슬롯의 nav 이름(기본 ‘주요 메뉴’).
- 슬롯 순서: `leading`(메뉴 버튼·아이콘), `brand`(로고·홈 링크), `navigation`(링크), `search`(검색 폼), `actions`(계정·공통 액션).
- navigation 슬롯에는 링크를 직접 넣는다. RouterLink도 최종 a 요소로 렌더링하면 같은 스타일이 적용된다. 현재 위치는 소비 화면이 `aria-current="page"`로 지정한다. nav를 중첩하지 않는다.
- 검색 슬롯에는 label/aria-label을 가진 입력을 넣는다. 검색 landmark가 필요하면 이름 있는 form role=search를 사용한다. 메뉴 버튼의 aria-expanded·aria-controls와 실제 메뉴 열기·닫기는 소비 화면에서 구현한다.
- `sticky`: 기본 false. true이면 가장 가까운 스크롤 조상 상단(0)에 고정한다. 스크롤 컨테이너·상위 overflow·다른 고정 헤더와의 간격은 서비스 레이아웃에서 관리한다. 루트 class·style로 필요한 top 값을 지정할 수 있다.
- 기본 최소 높이 64px이며 내용에 따라 늘어난다. 컨테이너 너비 768px 이하에서 내비게이션은 별도 줄로 내려가고 검색·액션은 공간에 맞춰 줄바꿈한다. DOM/Tab 순서를 바꾸거나 조작 요소를 자동으로 숨기지 않는다.
- 페이지의 main/article 안에 넣으면 네이티브 header는 banner landmark가 되지 않는다. 앱 공통 바는 main 밖에 둔다. 별도 드로어·계정 메뉴·검색 동작은 제공하지 않는다.
- 공개 타입 `UITopbarProps`. Storybook `Layout/UITopbar`에 Playground, Workspace, Sticky, Long Title 예제가 있다.

## UIDrawer

필터·보조 상세 정보·서비스 메뉴를 표시하는 모달 측면 패널이다. 별도 provider 없이 `v-model:open`으로 제어한다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIDrawer, UIButton } from '@ui-components/vue'
const open = ref(false)
</script>
<template>
  <UIButton @click="open = true">필터 열기</UIButton>
  <UIDrawer v-model:open="open" title="업무 필터" description="조건을 선택해 주세요.">
    <!-- 필터 입력 -->
    <template #actions="{ close }">
      <UIButton variant="ghost" @click="close">취소</UIButton>
      <UIButton @click="close">적용</UIButton>
    </template>
  </UIDrawer>
</template>
```

- `title` 필수, `description` 선택. `side`: `right`(기본) / `left`이며 RTL에서도 물리적인 좌우를 유지한다.
- `size`: `sm` 320px / `default` 400px / `lg` 576px. 화면보다 넓어지지 않으며 높이는 100dvh이다.
- `closeOnBackdrop`: 기본 true. false이어도 닫기 버튼·Escape는 동작한다. `closeLabel`로 닫기 버튼의 접근 가능한 이름을 지정할 수 있다(기본 ‘제목 닫기’).
- default·actions 슬롯은 `{ close }`를 받는다. actions는 취소 ghost → 보조 outline → 주요 default 순서로 작성한다. 검색·필터 적용·폼 상태는 호출 화면이 관리한다.
- `dismiss(reason)`은 사용자 닫기 요청을 알린다. reason은 `close-button`, `escape`, `backdrop`, 슬롯 close의 `action`, 네이티브 close의 `native`이다. 부모가 open=false로 바꾸는 경우는 dismiss를 발생시키지 않는다. 공개 타입은 `UIDrawerProps`, `UIDrawerDismissReason`이다.
- 네이티브 dialog의 모달 포커스 제한을 사용하며 기본 초기 포커스는 닫기 버튼이다. 본문 입력의 autofocus로 바꿀 수 있다. 닫기·해제 시 호출 요소가 존재하면 포커스를 돌린다. 닫힌 상태에서는 슬롯 콘텐츠가 해제되므로 유지할 입력값은 부모에 보관한다.
- 본문만 스크롤하고 제목·하단 액션을 유지한다. 배경 body 스크롤을 잠그며 기존 dialog/confirm과 잠금을 공유한다. 내부 팝업은 Drawer 내부에 렌더링하고 body로 Teleport하지 않는다. 같은 테마 영역에 배치한다.
- 이 컴포넌트는 모달이다. 상시 표시되는 비모달 Sidebar·스와이프·드래그 크기 조절은 제공하지 않는다. Storybook `Layout/UIDrawer`에서 좌우·너비·메뉴·긴 본문·배경 닫기 차단을 확인한다.

## UIFooter

페이지 공통 하단 정보를 표시한다. main과 형제로 배치하면 네이티브 contentinfo landmark가 된다.

```vue
<UIFooter text="© 사내 업무 포털 · 플랫폼운영팀">
  <template #navigation>
    <a href="/privacy">개인정보 처리방침</a>
    <a href="mailto:support@company.example">문의하기</a>
  </template>
</UIFooter>
```

- `text`: 서비스·저작권·운영 정보 문자열(선택). 연도는 자동 생성하지 않는다. 기본 슬롯이 있으면 text를 대체한다.
- `label`: footer 이름(기본 ‘하단 정보’), `navigationLabel`: navigation 슬롯의 nav 이름(기본 ‘관련 링크’).
- 기본 슬롯 → `navigation` → `actions` 순서이다. navigation에는 링크를 직접 넣고 nav를 중첩하지 않는다. actions는 끝 정렬이며 보조 동작에 outline·ghost 버튼을 사용한다. 이벤트·라우팅은 소비 화면이 관리한다.
- Topbar와 같은 표면·14px 본문·24px 가로 패딩을 사용하며 상단 1px 경계로 구분한다. 768px 이하의 컨테이너에서는 본문이 별도 줄을 사용하고 가로 패딩은 16px이다. 긴 텍스트·링크는 줄바꿈한다.
- 페이지 배치는 서비스가 담당한다. 짧은 페이지에서도 아래에 두려면 상위에 `flex min-h-dvh flex-col`, main에 `flex-1`을 사용한다. Footer 자체는 fixed/sticky가 아니므로 본문을 덮지 않는다.
- main/article/section 내부에 넣으면 contentinfo landmark가 되지 않는다. 페이지 공통 footer는 main 밖에 둔다. class·id 등은 루트 footer에 전달된다.
- 공개 타입 `UIFooterProps`. Storybook `Layout/UIFooter`에 기본·링크·액션·커스텀 내용·페이지 레이아웃·긴 문구 예제가 있다.

## 기본 반응형 레이아웃 샘플

Storybook **Layout / Basic Layout / Responsive**에서 Topbar + 왼쪽 메뉴 + 본문 + Footer를 한 화면으로 확인한다.

- 1024px 이상(`matchMedia('(min-width: 64rem)')`): 왼쪽 256px 메뉴를 항상 표시한다. Topbar·메뉴·Footer는 유지하고 본문만 스크롤한다.
- 1024px 미만: Topbar의 ‘메뉴 열기’로 왼쪽 `UIDrawer`를 연다. 메뉴 선택 시 닫고 본문으로 포커스를 옮긴다. Escape·배경 클릭으로 취소하면 메뉴 버튼으로 돌아간다.
- 화면이 넓어지면 열린 Drawer를 닫고 스크롤 잠금을 해제한다. 현재 페이지 선택을 유지하며 사라지는 메뉴에 있던 포커스를 보이는 메뉴·버튼으로 옮긴다.
- 페이지 골격은 `h-dvh`와 Tailwind Grid/Flex로 구성한다. 프로젝트에서 breakpoint를 바꾸면 matchMedia 기준도 함께 맞춘다. 본문·메뉴 각각의 스크롤 영역에 `min-h-0`을 유지한다.
- 구현: [UIWorkspaceLayout.vue](src/components/layout/examples/UIWorkspaceLayout.vue), 공통 메뉴: [UIWorkspaceNavigation.vue](src/components/layout/examples/UIWorkspaceNavigation.vue). 소비 화면으로 복사할 때 UI 컴포넌트 import를 `@ui-components/vue`로 바꾼다.
- 샘플의 메뉴 선택은 로컬 상태이다. 실제 서비스에서는 Vue Router의 현재 경로와 연결한다. 이 샘플은 새로운 공개 레이아웃 API가 아니며 라이브러리 배포물에서 제외된다. 데스크톱 메뉴는 비모달 aside이고, 작은 화면에서만 모달 UIDrawer를 사용한다.
