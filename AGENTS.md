# UI 패키지 유지보수 지침

사내 업무 서비스에서 공유하는 Vue UI 패키지다. 명확한 라벨, 키보드 접근성, 상태 피드백과 일관된 배치를 우선한다. 스타일 작업 전 [스타일 가이드](./style-guide.md)를 읽는다. 기본 구현과 예제는 Storybook에서 확인한다.

## 구현과 배포

- Vue 3 Composition API, `<script setup lang="ts">`, TypeScript strict, pnpm을 사용한다. 의존성 버전과 lockfile을 함께 관리한다.
- 컴포넌트와 공개 export에 `UI` 접두사를 쓴다. 구현은 `src/components`, 공통 스타일은 `src/styles`, 공개 API는 `src/index.ts`에 둔다.
- Vite library mode로 ESM·타입 선언·Tailwind 입력 CSS를 제공한다. Vue와 Tailwind는 peer dependency다. Storybook·테스트·개발 예제는 배포물에서 제외한다.
- 서비스는 화면 배치·Tailwind 빌드·`--ui-*` 테마를 관리한다. 패키지는 컴포넌트 스타일과 상태를 관리한다. Tailwind 클래스는 완전한 문자열로 쓰고 개발 소스와 배포 CSS의 `@source` 경로를 유지한다.
- 시맨틱 HTML, 접근 가능한 이름, 키보드 포커스, disabled 동작을 확인한다. 아이콘은 슬롯으로 제공한다. 네이티브 HTML로 구현하기 어려운 상호작용에 primitive가 필요하면 이유를 기록한다. shadcn-vue 파생 코드의 고지는 [라이선스 문서](./THIRD_PARTY_NOTICES.md)에 보존한다.
- 공통 디자인 결정은 컴포넌트, 토큰, Storybook, 스타일 가이드에 반영한다. 공개 API·토큰·명령이 바뀌면 [README](./README.md)도 갱신한다. 현재 사용 가능한 동작을 문서화한다.
- 제목·본문·조작 레이블에는 기본 텍스트 토큰을 쓰고, 보조 텍스트 토큰은 우선순위가 낮은 설명과 메타데이터에 쓴다. [기본·보조 텍스트 기준](./style-guide.md#기본보조-텍스트)을 따른다.
- 컴포넌트의 기본 테두리에는 공용 `--ui-border`를 쓴다. [테두리 기준](./style-guide.md#테두리)을 따른다.

## 검증

로컬 개발에는 Node.js 22.12 이상과 pnpm 10.32.1을 사용한다. `pnpm install` 후 `pnpm storybook`을 실행한다.

- 필수 검증은 `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build:consumer`, `pnpm build-storybook`이다. 소비 앱은 패키지 빌드 후 실행한다.
- 브라우저는 `pnpm test:browser`로 검증한다. 처음에는 `pnpm exec playwright install chromium`이 필요하다. 이 명령은 라이브러리·소비 앱·Storybook을 빌드하고 로컬 미리보기에서 테스트한다.
- 공개 API의 상태·이벤트·경계값은 단위 테스트에서 확인한다. 실제 키보드·포커스·네이티브 폼·서버 연동·배포 CSS는 브라우저 테스트로 검증한다. Preflight를 제외한 구성도 포함한다. 같은 동작을 이미 검증한다면 기존 테스트를 활용하고 시각 예제는 Storybook에서 검토한다.
