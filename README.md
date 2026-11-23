# @ui-components/vue

사내 업무 서비스용 Vue 3 UI 패키지입니다. 공개 진입점은 `@ui-components/vue`와 `@ui-components/vue/style.css`입니다. 패키지 빌드는 ESM, 타입 선언, Tailwind 입력 CSS를 `dist/`에 생성합니다.

## 서비스에 연결하기

서비스에서 Vue 3.5 이상과 Tailwind CSS 4.3.5 이상(4.x)을 제공합니다. 현재 패키지는 비공개 워크스페이스용입니다. 같은 pnpm 워크스페이스에서 사용할 때 서비스의 `dependencies`에 `"@ui-components/vue": "workspace:*"`를 추가하고, 패키지에서 `pnpm build`를 실행한 뒤 서비스 빌드를 실행합니다.

서비스의 Tailwind CSS 진입점에 아래 순서로 가져오고, 앱 진입점에서 그 CSS를 한 번 가져옵니다. Vite 서비스는 `@tailwindcss/vite`를 개발 의존성에 추가하고 Vite 설정에 등록합니다.

```css
@import "tailwindcss";
@import "@ui-components/vue/style.css";
```

패키지 스타일은 서비스의 Tailwind 빌드에서 처리합니다. 패키지 내부 클래스는 배포 CSS의 `@source`로 탐색합니다. Preflight를 제외하는 서비스는 다음처럼 구성합니다.

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@import "@ui-components/vue/style.css";
```

화면의 Grid·Flex·간격과 반응형 배치는 서비스에서 작성합니다. 패키지 스타일을 가져온 뒤 `:root` 또는 테마 컨테이너에 `--ui-*` 색상 변수를 지정합니다. 컴포넌트 크기, 타이포그래피와 전체 토큰은 [스타일 가이드](./style-guide.md)에서 확인할 수 있습니다.

## 빠른 예제

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIButton, UIFormField, UIInput } from '@ui-components/vue'

const email = ref('')
</script>

<template>
  <form class="grid gap-4" @submit.prevent>
    <UIFormField v-slot="{ controlAttrs }" label="이메일" required>
      <UIInput v-bind="controlAttrs" v-model="email" name="email" type="email" autocomplete="email" />
    </UIFormField>
    <div class="flex justify-end">
      <UIButton type="submit">저장</UIButton>
    </div>
  </form>
</template>
```

`UIFormField`의 `controlAttrs`를 실제 입력에 전달하면 라벨·도움말·오류가 연결됩니다. 폼 검증과 저장은 서비스에서 처리합니다.

## 공개 컴포넌트

| 용도 | 공개 API |
| --- | --- |
| 기본 입력과 액션 | `UIButton`, `UIInput`, `UITextarea`, `UINumberInput`, `UIFormField`, `UIFileUpload` |
| 선택과 설정 | `UISwitch`, `UICheckbox`, `UIRadioGroup`, `UISelect`, `UICombobox`, `UIDatePicker`, `UITimePicker` |
| 데이터와 콘텐츠 | `UIDataTable`, `UIList`, `UIDescriptions`, `UITree`, `UIPagination`, `UICard`, `UIAccordion` |
| 페이지 이동과 레이아웃 | `UITopbar`, `UIFooter`, `UINavigationMenu`, `UIBreadcrumb`, `UITabs`, `UIDropdownMenu` |
| 상태와 도움말 | `UIAlert`, `UIChip`, `UIProgress`, `UICircleProgress`, `UISkeleton`, `UITooltip`, `UINotifyProvider`, `useNotify` |
| 모달과 확인 | `UIDrawer`, `UIDialogProvider`, `UIDialog`, `useDialog`, `useDialogContext`, `useConfirm` |

상세 props·슬롯·이벤트는 컴포넌트별 Storybook `Docs`와 [공개 타입](./src/index.ts)에서 확인합니다. 패키지 디렉터리에서 `pnpm storybook`을 실행하면 [로컬 Storybook](http://localhost:6006)이 열립니다. 여러 컴포넌트를 조합한 화면은 `Patterns`에서 확인할 수 있습니다.

### 연동 시 확인할 계약

- `UIDatePicker`의 날짜·연월은 `YYYY-MM-DD` / `YYYY-MM`, `UITimePicker`는 `HH:mm` 문자열입니다. 미입력은 빈 문자열이며 날짜와 시각의 시간대 해석은 서비스가 담당합니다. `UINumberInput`은 미입력 `null`과 숫자 `0`을 구분합니다.
- `UICombobox`의 모델은 확정된 선택값입니다. 원격 검색은 `@search`로 받아 서비스가 실행하고 결과·로딩·오류를 전달합니다. `UIFileUpload`는 파일 선택과 목록을 관리하고 전송·서버 검증은 서비스에서 처리합니다.
- `UIDrawer`는 `v-model:open`으로 제어합니다. `useDialog`·`useConfirm`은 `UIDialogProvider` 하위에서, `useNotify`는 `UINotifyProvider` 하위에서 호출합니다. 확인 결과는 명시적으로 승인했을 때만 `true`입니다. 네이티브 모달에서 표시할 팝업·알림은 해당 모달 내부에 둡니다.

### 데이터 테이블

`UIDataTable`에는 `data`, `columns`, `label`, `getRowId`를 전달합니다. 행 ID는 정렬·검색·페이지에 관계없이 고정된 업무 ID를 사용합니다.

- `client` 모드(기본)는 전체 데이터에서 표의 검색·정렬·페이지를 계산합니다. `server` 모드는 현재 페이지의 행과 동일한 조건으로 집계한 전체 건수(`totalRows`)를 받습니다. `paginated=false`인 경우 조회 조건에 맞는 전체 행을 전달합니다.
- 서버 조회에는 `v-model:pagination`, `v-model:sorting`, `v-model:global-filter`를 사용합니다. `pageIndex`는 0부터 시작합니다. 검색·정렬·페이지 크기가 바뀌면 첫 페이지로 이동합니다. 서비스에서 이전 응답을 무시하고 최신 요청의 행과 전체 건수를 함께 반영하며, `loading`, `error`, `@retry`를 연결합니다.
- 여러 페이지의 선택 상태는 `v-model:row-selection`에 ID로 저장합니다. 헤더 체크박스는 현재 페이지에서 선택 가능한 행을 대상으로 합니다. 서버 모드에서 툴바의 `selectedRows`는 현재 응답의 행을 제공합니다. `UIPagination`은 별도의 목록·카드에 쓰며 페이지 번호는 1부터 시작합니다.

실행 예제는 Storybook `Components/UIDataTable → Server`에서 확인합니다.

## 유지보수

개발·검증 명령은 [AGENTS.md](./AGENTS.md), 이식 시 실제 환경에서 확인할 항목은 [TODO.md](./TODO.md)에 있습니다. 배포물에 포함되는 의존성 고지는 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)에 있습니다.
