# UI 스타일 가이드

이 문서는 사내 서비스의 공통 디자인 지침과 실제 구현된 컴포넌트 명세를 함께 관리한다. 현재 기준 컴포넌트는 `UIButton`, `UIInput`, `UICard`, `UISwitch`, `UITabs`, `UIDialog`, `UITree`, `UIDataTable`, `UIChip`, `UIProgress`, `UICircleProgress`, `UIDescriptions`, `UINotifyProvider`, `UIList`, `UITopbar`, `UIDrawer`, `UIFooter`이다.

공통 지침은 앞으로의 디자인 판단 기준이다. 「현재 구현」은 사용 가능한 동작과 토큰을 의미하고, 「후속 적용」은 코드에 아직 반영하지 않은 방향이다. 이 문서의 갱신만으로 컴포넌트나 테마가 변경되는 것은 아니다.

## 레퍼런스와 적용 원칙

| 참고 자료 | 참고 범위 | 우리 프로젝트에 적용할 관점 |
| --- | --- | --- |
| [Carbon — Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines), [Forms](https://www.carbondesignsystem.com/building-blocks/core/patterns/forms) | 업무 화면, 데이터 조작, 폼 | 테이블·검색·필터·선택·일괄 작업과 입력 흐름을 설계할 때 기본 참고서로 사용 |
| [SAP Fiori — Content density](https://help.sap.com/docs/SAPUI5/b2f662dd9d7a4ec680056733050b4d34/13e6f3bfc54c4bd7952403e20ff447e7.html) | 데스크톱과 터치 환경의 정보 밀도 | 화면의 작업량과 입력 방식에 맞춰 크기와 간격 선택 |
| [Fluent 2 — Color](https://fluent2.microsoft.design/color), [Button](https://fluent2.microsoft.design/components/web/react/core/button/usage) | 중립색·브랜드색의 역할, 액션 중요도 | 차분한 표면 계층과 제한적인 강조색 사용 |
| [Atlassian — Spacing](https://atlassian.design/foundations/spacing), [Form](https://atlassian.design/components/form/usage) | 간격 스케일, 도움말과 오류 피드백 | 제한된 간격 값과 일관된 입력 안내 |
| [Carbon — Color](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview) | 색상 토큰, 테마와 상호작용 상태 | 기본·hover·선택·비활성 상태의 체계화 |
| [shadcn-vue — Theming](https://www.shadcn-vue.com/docs/theming) | CSS 변수와 의미 기반 컬러 | 현재 `--ui-*` 테마 구조의 구현 참고 |

- 업무 UX는 Carbon을 기본 참고서로, 시각적 색상 계층은 Fluent 2를 우선 참고한다. 기술 구현은 현재 Vue·Tailwind·shadcn-vue 구성을 유지한다.
- 아래 수치와 사용 규칙은 우리 프로젝트의 기준이다. 외부 시스템을 그대로 준수한다는 의미가 아니다.
- 외부 가이드와 충돌하면 프로젝트에서 정한 규칙을 우선한다. 예를 들어 카드 액션의 우측 정렬·주요 버튼의 마지막 배치·내부 구분선 생략은 유지한다.
- 여러 시스템의 외형을 컴포넌트마다 섞지 않는다. 가져올 원칙을 먼저 문서화하고 같은 역할의 컴포넌트에 일관되게 적용한다.

## 공통 UX 지침

### 업무 효율과 정보 밀도

- 반복 업무에서 정보 탐색, 입력, 검토, 실행이 명확해야 한다. 장식보다 가독성·일관성·키보드 접근성을 우선한다.
- 정보 밀도는 글자를 작게 만드는 방식보다 컨트롤 높이·패딩·행 간격으로 조절한다.
- 같은 작업 행에서는 입력과 버튼의 size를 통일한다. 기능의 중요도는 크기보다 variant와 배치로 표현한다.

| 크기 | 기존 버튼·입력 높이 | 선택 기준 |
| --- | --- | --- |
| `sm` | 32px | 데스크톱의 밀도 높은 테이블·툴바·반복 작업 |
| `default` | 40px | 일반 폼과 카드 액션의 기본값 |
| `lg` | 48px | 터치 중심 화면이나 넓은 조작 영역이 필요한 상황 |

현재 구현: 버튼과 입력의 size 속성이 있다. 위 사용처는 선택 지침이며 전역 compact/cozy 모드는 아직 없다. 스위치처럼 별도 규격을 가진 컴포넌트에 이 높이를 강제하지 않는다. 터치 사용성은 실제 클릭 영역과 주변 간격까지 확인한다.

### 폼과 액션

- 라벨은 필드 위에 두고 placeholder로 대체하지 않는다. 필수 여부와 입력 형식은 입력 전에 알 수 있게 한다.
- 오류는 문제 필드 가까이에 원인과 수정 방법을 함께 표시한다. 초기 진입부터 오류를 표시하지 않고, 제출 시 검증을 기본으로 하며 이미 표시된 오류는 수정 과정에서 재검증한다.
- 취소는 변경 내용을 되돌리고, 저장은 완료·실패를 명확히 알려야 한다. 저장 중에는 같은 요청이 중복 실행되지 않게 한다.
- 같은 액션 그룹에서 가장 중요한 동작 하나만 filled를 사용한다. 보조는 outline, 취소는 ghost이며 위험 동작은 의미와 결과를 분명히 표시한다.
- 스위치처럼 즉시 반영되는 설정과 저장 버튼으로 확정하는 폼을 구분해 안내한다. 저장되지 않은 변경사항을 잃을 수 있는 화면은 이탈 처리를 설계한다.
- 긴 폼은 관련 필드를 묶고 단계 분리나 필요한 항목의 점진적 표시를 검토한다. 단순히 필드 수를 줄이려고 업무에 필요한 정보를 숨기지 않는다.

현재 구현: 기본 입력·버튼·스위치와 로컬 폼 예제가 있다. UIButton은 loading 표시와 비활성화를 제공한다. 공통 검증 엔진, 서버 저장, 비동기 작업 상태 관리, 이탈 경고는 소비 화면에서 구현해야 한다.

### 데이터 화면과 피드백

- 테이블의 검색·필터·정렬·페이지 이동 상태를 알 수 있게 하고, 행 단위 액션과 선택 항목 전체에 대한 액션을 구분한다.
- 로딩, 데이터 없음, 검색 결과 없음, 권한 없음, 실패 상태를 구분하고 다음에 할 수 있는 행동을 안내한다.
- 상태를 색상 하나로만 전달하지 않는다. 텍스트·아이콘·위치 또는 형태를 함께 사용한다.
- 현재 UIDataTable에서 검색·정렬·페이지 이동·선택·로딩·오류·빈 상태를 제공한다. UIProgress는 독립적인 작업 진행률 표시를 제공한다. Notify action은 작업 결과 알림을 제공한다. 컬럼별 필터, 서버 데이터 요청은 후속 적용 대상이다.

## 시각적 기초 지침

| 항목 | 기준 | 구현 상태 |
| --- | --- | --- |
| 표면 | 페이지는 옅은 중립 회색, 카드·입력은 흰색으로 구분 | page-background와 선택적 surface 토큰 적용. surface 미지정 시 기존 background 사용 |
| 본문·컨트롤 | 기본 14px, 명확한 대비와 읽기 쉬운 줄 높이 | 현재 컴포넌트에 적용 |
| 섹션 제목 | 16px, 굵기 600 | 카드 제목에 적용 |
| 페이지 제목 | 24px를 출발점으로 사용 | `ui-h1`로 제공. 명시적인 역할 클래스 사용 |
| 간격 | 4·8·12·16·24·32px의 제한된 스케일 | 기존 간격과 호환되는 사용 지침. 별도 공개 spacing 토큰 없음 |
| 모서리 | 일반 컨트롤·카드 6px | 적용됨. 원형 아이콘이나 스위치 트랙은 역할에 맞는 예외 |
| 테두리 | 영역을 구분하는 얇은 테두리 중심 | 카드 바깥 1px, 내부 구분선 없음 |
| 그림자 | 팝오버·다이얼로그 등 겹치는 표면의 계층 표현에 제한 | 스위치의 선택 영역에만 작은 경계 그림자 적용. 다이얼로그 배경 차폐는 overlay 토큰 사용 |
| 모션 | 상태 이해에 필요한 짧은 전환, reduced motion 지원 | 버튼·입력·스위치에 적용 |

간격은 관계에 따라 선택한다. 제목과 설명 4px, 같은 행의 컨트롤 8px, 스위치와 라벨 12px, 카드 내부 패딩 16px, 폼 그룹 24px, 큰 섹션 구분 32px를 기본 출발점으로 삼는다. 컴포넌트별 기존 명세가 있으면 해당 명세를 따른다. px 표기는 루트 폰트 16px 기준이며 구현은 rem을 사용한다.

## 테마 설계 지침

### 색상의 역할

- 흰색·회색·검정 같은 중립색으로 표면과 텍스트의 기반을 만든다. primary는 주요 액션과 선택 강조에 제한해 사용한다.
- 성공·주의·오류 같은 의미색은 서비스 브랜드색과 분리한다. 서비스마다 동일한 의미가 다른 색으로 해석되지 않게 한다.
- 토큰은 색상 이름보다 역할로 정의한다. 개별 컴포넌트에 색상 값을 직접 넣는 대신 역할 기반 CSS 변수를 참조한다.
- 배경과 그 위의 글자·아이콘 색상은 한 쌍으로 검토한다. hover·선택 배경·포커스까지 함께 설계하며 primary 하나를 바꾼 것만으로 완성된 테마로 간주하지 않는다.
- 선택과 hover는 다른 상태이다. 같은 색상을 재사용하더라도 사용자에게 현재 선택이 유지되는지 구별되어야 한다.

### 현재 테마 계약과 후속 적용

| 역할 | 현재 구현 | 후속 적용 방향 |
| --- | --- | --- |
| 기본 표면·텍스트 | page-background, surface(선택), background / foreground | 추가 표면은 실제 컴포넌트 필요에 따라 설계 |
| 주요 액션 | primary / primary-foreground, primary-hover / primary-pressed(선택) | 서비스 테마별 상태색 검토 |
| 보조·hover 표면 | secondary, accent, selected-background / selected-foreground | 선택 상태 표현용. UITabs는 폴더형 연결을 위해 surface 사용 |
| 오류·위험 | destructive / destructive-foreground, success / warning / info의 background·foreground | Chip·Progress·Notify에 적용. 통합 예제에서도 확인 |
| 경계·보조 글자·포커스 | border, control-border / control-border-hover, muted-foreground / ring | 비상호작용 경계와 조작 가능한 경계 구분 |
| 비활성 | disabled-background / disabled-foreground | opacity 대신 전용 중립색으로 식별성 유지 |

사용 가능한 변수와 기본값은 아래 「컬러 토큰」 표를 기준으로 한다. hover·pressed는 불투명도를 바꾸지 않는 불투명 색상이다. 선택적 상태 토큰을 생략하면 사용하는 컴포넌트에서 현재 컬러를 기준으로 계산한다. 따라서 중첩 테마에서 primary만 재정의해도 상태색이 해당 primary를 따른다.

### 적용과 검토 절차

1. 패키지 기본 테마를 기준으로 서비스의 컬러 변수만 재정의한다. 컴포넌트의 크기·간격·모서리·타이포그래피는 패키지에서 관리한다.
2. 같은 폼·버튼·카드·스위치 조합으로 기본/hover/focus/disabled/error/on-off 상태를 비교한다. 테이블과 선택 상태는 해당 컴포넌트가 구현되면 검토 범위에 포함한다.
3. 일반 텍스트 대비 4.5:1, 포커스 표시 대비 3:1을 프로젝트 검토 기준으로 삼고 실제 인접 배경에서 확인한다. muted 글자, 아이콘과 컨트롤 경계도 식별 가능한지 확인한다.
4. 키보드 조작, 고대비 모드, reduced motion, 좁은 화면을 함께 확인한다. 한글 라벨과 실제 업무 데이터 길이로 검토한다.
5. 새 토큰 도입 시 CSS 기본값·Tailwind 매핑·사용 컴포넌트·Storybook·문서를 함께 갱신한다. 기존 토큰의 의미를 예고 없이 바꾸지 않는다.

현재 구현: neutral은 패키지 기본값, ocean은 Storybook의 컬러 재정의 예제이다. 두 테마를 통합 업무 화면에서 비교하고 텍스트·입력 경계·주요 동작의 대비를 브라우저 테스트로 확인한다. ocean은 배포용 테마 프리셋이 아니며 다크 테마는 아직 제공하지 않는다.

## 스타일 소유권

UI 패키지는 디자인 규칙과 컴포넌트 스타일을 소유하고, 서비스는 화면 레이아웃과 최종 CSS 빌드를 담당한다. Tailwind CSS는 필수 peer dependency이다.

- 패키지 `style.css`는 Tailwind가 처리할 입력 CSS이며 완성된 독립 스타일시트가 아니다. 컬러 토큰·테마 매핑·타이포그래피·컴포넌트 스타일과 패키지 JS를 탐색하는 @source를 제공한다.
- 서비스 CSS에서 `@import "tailwindcss";` 다음 `@import "@ui-components/vue/style.css";`를 사용한다. 패키지는 Tailwind import와 별도 reset을 포함하지 않는다. Preflight는 서비스에서 한 번 적용한다.
- Preflight가 필요 없는 서비스는 Tailwind theme·utilities만 import할 수 있다. 이 구성도 소비 앱 빌드로 검증한다.
- 화면 Grid·Flex·간격·반응형은 서비스가 Tailwind 클래스로 작성한다. 별도 ui-grid·ui-col 시스템은 만들지 않는다.
- 컴포넌트의 크기·상태·외형·타이포그래피는 패키지에서 일관되게 관리한다. 서비스 컬러 테마는 기존 --ui-* 변수를 재정의한다.
- 서비스가 Tailwind 테마의 기본 글자 크기·간격·breakpoint를 재정의하면 패키지 내부 유틸리티에도 영향을 줄 수 있다. 공통 기본 스케일은 유지하고 변경이 필요하면 패키지와 함께 검토한다.
- Storybook도 하나의 소비 앱처럼 Tailwind와 패키지 스타일을 통합해 빌드한다. 실제 배포 진입점을 사용하는 tests/consumer에서 별도로 검증한다.

## 컬러 토큰

토큰은 완전한 CSS 색상 값(`#hex`, `rgb()`, `oklch()` 등)을 사용한다. background와 foreground는 한 쌍으로 조정한다.

| 변수 | 기본값 | 역할 |
| --- | --- | --- |
| `--ui-background` | `#ffffff` | 기본 표면 |
| `--ui-foreground` | `#18181b` | 기본 텍스트 |
| `--ui-primary` | `#18181b` | 주요 액션 |
| `--ui-primary-foreground` | `#ffffff` | 주요 액션 텍스트 |
| `--ui-secondary` | `#f4f4f5` | 보조 액션 |
| `--ui-secondary-foreground` | `#18181b` | 보조 액션 텍스트 |
| `--ui-accent` | `#f4f4f5` | outline·ghost hover 표면 |
| `--ui-accent-foreground` | `#18181b` | accent 위 텍스트 |
| `--ui-destructive` | `#b91c1c` | 삭제 등 위험 액션 |
| `--ui-destructive-foreground` | `#ffffff` | 위험 액션 텍스트 |
| `--ui-overlay` | `rgb(0 0 0 / 40%)` | 모달 배경 차폐 |
| `--ui-border` | `#d4d4d8` | 카드 등 비상호작용 영역의 경계 |
| `--ui-muted-foreground` | `#52525b` | placeholder와 도움말 텍스트 |
| `--ui-ring` | `#71717a` | 키보드 포커스 |

### 추가된 역할별 컬러

| 변수 | 기본값 | 용도 |
| --- | --- | --- |
| `--ui-page-background` | `#f4f4f5` | 페이지 표면 (소비 페이지가 명시적으로 적용) |
| `--ui-surface` | 미지정 시 `--ui-background` | 카드·입력·outline 버튼 표면 |
| `--ui-control-border` | `#71717a` | 입력·outline 버튼 경계 |
| `--ui-control-border-hover` | `#52525b` | 입력·꺼진 스위치 hover |
| `--ui-disabled-background` / `--ui-disabled-foreground` | `#e4e4e7` / `#71717a` | 비활성 표면·텍스트·아이콘 |
| `--ui-selected-background` / `--ui-selected-foreground` | `#e4e4e7` / `#18181b` | 지속적인 선택 강조 |
| `--ui-success-background` / `--ui-success-foreground` | `#f0fdf4` / `#166534` | 성공 안내 |
| `--ui-warning-background` / `--ui-warning-foreground` | `#fffbeb` / `#92400e` | 주의 안내 |
| `--ui-info-background` / `--ui-info-foreground` | `#eff6ff` / `#1e40af` | 정보 안내 |

### 선택적 상태 토큰

아래 변수는 `:root`에 고정하지 않는다. 사용하는 위치에서 fallback을 계산해 서비스나 컨테이너가 지정한 컬러를 따른다. 모든 혼합은 `color-mix(in srgb, …)`이며 투명도를 사용하지 않는다.

| 변수 | 미지정 시 계산 |
| --- | --- |
| `--ui-primary-hover` / `--ui-primary-pressed` | primary 85% + 검정 15% / primary 70% + 검정 30% |
| `--ui-destructive-hover` / `--ui-destructive-pressed` | destructive 85% + 검정 15% / destructive 70% + 검정 30% |
| `--ui-secondary-hover` | secondary 94% + foreground 6% |
| `--ui-accent-pressed` | accent 90% + foreground 10% |

브랜드색이 바뀔 때 기본·hover·pressed와 글자색의 대비를 함께 확인한다. ocean 예제는 primary-hover `#075985`, primary-pressed `#0c4a6e`를 명시하고, 입력 테두리·의미색·비활성색은 중립 테마와 공유한다.

서비스 스타일은 패키지 CSS 뒤에서 로드하고 `:root` 또는 테마 컨테이너에 변수를 선언한다.
Storybook의 neutral/ocean 툴바와 ColorThemes 스토리에서 재정의 결과를 확인할 수 있다.
새 테마는 일반 텍스트 대비 4.5:1, 포커스 표시 대비 3:1을 기준으로 확인한다.
다크 테마는 아직 정의하지 않았다.

## 타이포그래피와 형태

현재 구현: 아래 클래스를 패키지 `style.css`에서 제공한다. HTML 태그는 문서 계층, 클래스는 시각적 표현을 담당한다. 전역 h1~h6·p 선택자는 변경하지 않는다. 예를 들어 카드 제목은 `<h2 class="ui-title">`로 사용한다.

| 클래스 | 크기 / 줄 높이 | 굵기 | 역할 |
| --- | --- | --- | --- |
| `ui-h1` | 24 / 32px | 600 | 페이지 대표 제목 |
| `ui-h2` | 20 / 28px | 600 | 큰 섹션 제목 |
| `ui-h3` | 18 / 26px | 600 | 하위 구획 제목 |
| `ui-h4` | 16 / 24px | 600 | 작은 구획 제목 |
| `ui-h5` | 14 / 20px | 600 | 세부 그룹 제목 |
| `ui-h6` | 14 / 20px | 500 | 가장 깊은 단계 제목 |
| `ui-title` | 16 / 24px | 600 | 카드·다이얼로그·패널 제목 |
| `ui-subtitle` | 14 / 20px | 400 | 제목 아래 보충 설명 |
| `ui-body` | 14 / 22px | 400 | 일반 본문 |
| `ui-body-lg` | 16 / 26px | 400 | 긴 안내문·읽기 중심 콘텐츠 |
| `ui-caption` | 12 / 18px | 400 | 날짜·출처 등 보조 정보 |
| `ui-label` | 14 / 20px | 500 | 입력 필드 라벨 |

- 루트 글꼴 16px 기준이며 크기·줄 높이는 rem으로 구현한다. 시스템 sans-serif를 사용하고 자간은 normal이다. 웹폰트 의존성은 없다.
- 위 클래스는 margin을 0으로 초기화한다. 제목·문단 사이 여백은 레이아웃이 정한다. 말줄임·줄 수 제한·대문자 변환은 적용하지 않는다.
- 색상은 상속한다. `ui-text-muted`는 기존 muted-foreground 토큰만 적용하며 설명·보조 정보에 조합한다. 글자 크기와 색상의 역할은 분리한다.
- heading 단계는 문서 구조에 따라 선택하고 크기를 위해 단계를 건너뛰지 않는다. h5·h6도 본문보다 작게 만들지 않는다. `ui-title`과 `ui-h4`는 같은 수치지만 사용 역할을 구분한다.
- subtitle은 제목 아래 설명문이며 하위 제목을 뜻하지 않는다. 하위 제목에는 의미에 맞는 h2~h6를 사용한다.
- caption은 보조 정보 전용이다. 필수 안내·오류는 최소 14px을 유지한다. 입력 라벨에는 실제 label과 for/id 연결을 사용한다.
- 카드·다이얼로그 제목은 title, 설명은 subtitle + muted, 본문과 탭 패널은 body를 사용한다. 버튼·입력·탭 트리거·스위치는 컨트롤 전용 크기와 줄 높이를 유지한다.
- 버튼 텍스트는 14px/20px·500이다. 간격 기준은 4px, 아이콘과 텍스트 사이는 8px이다. 일반 컴포넌트 모서리는 6px이다.
- 별도 Typography Vue 컴포넌트나 서비스용 크기 조절 API는 제공하지 않는다. 서비스는 기존 컬러 토큰만 지정한다.
- Storybook `Foundations/Typography`의 Scale과 Workplace에서 한글·영문·숫자, 긴 제목과 실제 폼 조합을 비교한다.

참고: [Carbon의 업무용 타이포그래피](https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets), [Fluent 2의 역할별 스케일](https://fluent2.microsoft.design/typography/). 위 수치는 기존 컴포넌트와 한글 가독성에 맞춰 정한 프로젝트 기준이다.

## UIButton

| size | 높이 | 좌우 패딩 | 상하 패딩 |
| --- | --- | --- | --- |
| `default` | 40px | 16px | 8px |
| `sm` | 32px | 12px | 4px |
| `lg` | 48px | 24px | 12px |
| `icon` | 40px (너비도 40px) | 0 | 0 |

| variant | 용도와 표현 |
| --- | --- |
| `default` | primary 배경과 foreground, hover·pressed는 명시적 상태색 또는 자동 계산색 |
| `secondary` | secondary 배경과 foreground, hover는 secondary-hover, pressed는 accent-pressed |
| `outline` | 1px control-border와 surface, hover는 accent, pressed는 accent-pressed |
| `ghost` | 투명 배경, hover는 accent, pressed는 accent-pressed |
| `destructive` | destructive 배경과 foreground, hover·pressed는 별도 상태색 |
| `link` | primary 텍스트, hover 시 밑줄. 동작은 여전히 button |

- `variant`, `size` 기본값은 `default`, HTML `type` 기본값은 `button`이다.
- `type="submit"`과 `type="reset"`은 명시적으로 지정한다.
- `focus-visible`: 2px outline, 2px offset, ring 컬러를 사용한다.
- `disabled`: 네이티브 disabled 속성과 전용 비활성 배경·글자색을 사용한다. 클릭과 키보드 포커스에서 제외하고 hover·pressed 색상은 적용하지 않는다.
- `loading`: 진행 아이콘과 `aria-busy`를 표시하고 disabled로 중복 클릭을 막는다. 슬롯에는 작업을 설명하는 텍스트를 유지한다. 비동기 상태는 부모에서 관리한다.
- 색상 전환은 Tailwind 기본 150ms를 사용하고 reduced motion에서는 전환을 제거한다.
- 새 상태나 variant를 추가하면 이 문서와 Storybook을 함께 수정한다.


## UIInput

텍스트 입력용 네이티브 `<input>`을 사용한다. `type`은 `text`(기본), `email`, `password`, `search`, `tel`, `url`을 지원한다. 체크박스·파일·숫자·날짜 입력은 별도 컴포넌트의 범위이다.

- `v-model` 값은 문자열이다. 외부 값 갱신, 입력, 비우기를 지원하고 한국어 IME 조합 중에는 모델 갱신을 보류한다.
- 너비는 컨테이너의 100%, 모서리는 버튼과 동일한 `0.375rem`이다.
- 텍스트는 시스템 sans-serif, `0.875rem`, 굵기 400, 줄 높이 `1.25rem`이다.
- 기본 표면은 surface(미지정 시 background), 텍스트는 foreground, 1px 테두리는 control-border, placeholder는 muted-foreground 토큰을 사용한다. hover 시 control-border-hover로 구분한다.
- `size`는 시각적 크기이며 네이티브 input의 글자 수 기반 size 속성이 아니다.

| size | 높이 | 좌우 패딩 | 상하 패딩 |
| --- | --- | --- | --- |
| `sm` | 32px | 12px | 4px |
| `default` | 40px | 12px | 8px |
| `lg` | 48px | 16px | 12px |

- 클릭·키보드 포커스: 외부 outline 없이 기존 테두리를 2px info-foreground로 변경한다. 기본 테두리는 1px이며 포커스 시 패딩을 1px 줄여 입력창 크기와 텍스트 위치를 유지한다. hover보다 포커스가 우선하며 readonly에도 적용한다. 오류 상태는 destructive 테두리를 유지한다. 고대비 모드에서는 시스템 Highlight 테두리를 사용한다.
- `invalid`: `aria-invalid="true"`를 적용하고 테두리와 포커스를 destructive 컬러로 표시한다. 검증 로직은 소비 폼이 관리한다.
- `disabled`: 네이티브 비활성 상태와 전용 비활성 배경·글자색을 사용한다. 포커스와 폼 제출 값에서 제외한다.
- `readonly`: secondary 표면으로 구분한다. 포커스·선택·복사와 폼 제출은 가능하다.
- 라벨은 `label[for]`와 input의 `id`를 연결한다. placeholder로 라벨을 대체하지 않는다.
- 도움말과 오류 메시지는 `aria-describedby`로 연결한다. 메시지는 입력 아래 8px 간격, 14px 텍스트로 표시한다.
- Form 스토리는 네이티브 필수값·이메일 검증, 공백 이름 검증과 저장 완료 알림의 조합 예제이다. 실제 서버 저장은 수행하지 않는다.
- 폼 초기화 시에는 부모의 `v-model` 값을 명시적으로 초기화한다. 네이티브 reset 이벤트만으로 Vue 상태가 초기화되지는 않는다.

## 입력과 버튼의 가로 배치

- 같은 행의 `UIInput`과 `UIButton`에는 동일한 `size`를 적용한다. 높이는 `sm` 32px, `default` 40px, `lg` 48px로 맞춘다.
- 두 컨트롤의 간격은 `0.5rem`(8px), 세로 정렬은 중앙으로 한다.
- 입력 필드는 `flex: 1; min-width: 0`, 버튼은 `flex-shrink: 0`으로 구성한다. 좁은 화면에서는 입력 너비가 줄어든다.
- 라벨은 컨트롤 행 위에, 도움말·결과 메시지는 행 아래에 둔다. 메시지 유무가 버튼의 세로 정렬에 영향을 주지 않게 한다.
- Storybook `Components/UIInput → Inline Form`에서 세 크기의 검색 폼을 비교한다. Enter와 검색 버튼 모두 제출하며, 실제 검색 서버는 호출하지 않는다.

## 버튼의 SVG 아이콘

- SVG는 `UIButton`의 기본 슬롯에 직접 넣는다. 아이콘 패키지나 SVG 로더는 필요하지 않다.
- 선형 아이콘 예제는 `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`와 둥근 선 끝/연결을 사용한다.
- SVG 크기는 모든 버튼 크기에서 `1rem`(16px)이다. 아이콘과 텍스트 간격은 `0.5rem`(8px)이며 슬롯 순서로 앞/뒤 위치를 정한다.
- 아이콘과 텍스트 조합은 `sm`, `default`, `lg`를 사용한다. 아이콘 전용은 `size="icon"`으로 40×40px를 사용한다.
- SVG에는 `aria-hidden="true"`, `focusable="false"`를 지정한다. 텍스트가 없으면 버튼에 동작을 설명하는 `aria-label`을 반드시 지정한다.
- 아이콘 색상을 고정하지 않고 `currentColor`를 사용해 variant·테마·disabled 상태를 따른다.
- Storybook `Components/UIButton → Icon + Text`, `Icon Button`에서 앞/뒤 아이콘, 크기, variant, disabled 예제를 확인한다.

## 입력 필드의 SVG 아이콘

- `UIInput`의 `prefix` 슬롯은 앞쪽, `suffix` 슬롯은 뒤쪽 장식용 SVG를 받는다. 둘을 함께 사용할 수 있다.
- 아이콘은 16×16px, 가장자리에서 12px 떨어진 위치에 세로 중앙 정렬한다. 아이콘이 있는 쪽의 입력 패딩은 40px로 확보한다. 아이콘 없는 쪽은 기존 size별 패딩을 유지한다.
- 아이콘은 muted-foreground 색상을 사용한다. invalid 상태에서는 destructive, disabled 상태에서는 disabled-foreground를 사용한다. SVG는 `currentColor`를 사용한다.
- 슬롯 컨테이너는 `aria-hidden="true"`, `pointer-events: none`이다. SVG에는 `focusable="false"`를 지정한다. 클릭 동작이 필요한 버튼·링크를 넣지 않는다.
- 입력을 감싸는 `ui-input-wrapper`가 위치 기준과 너비를 담당한다. 가로 flex 배치에서는 이 래퍼에 `flex: 1; min-width: 0`을 적용한다.
- `id`, `name`, `aria-*`, `class`, `style`, 네이티브 이벤트는 내부 input으로 전달한다. 라벨 연결, v-model, 폼 제출 동작을 유지한다.
- 아이콘은 라벨과 상태 설명을 대신하지 않는다. 인증 완료 등의 의미는 도움말로 제공하고 `aria-describedby`로 연결한다.
- Storybook `Components/UIInput → Prefix / Suffix Icons`, `Icon Sizes`, `Inline Form`에서 앞/뒤/양쪽 아이콘과 크기별 가로 배치를 확인한다.


## UICard

업무 정보를 제목·본문·액션 영역으로 구분한다. 강조 효과보다 정보 구조와 조작의 명확성을 우선한다.

- `title`, `description`으로 제목과 설명을 지정한다. `#title`, `#description` 슬롯을 제공하면 해당 prop 대신 렌더링한다.
- 기본 슬롯은 본문, `#actions`는 액션 영역이다. 제공하지 않은 영역은 렌더링하지 않는다.
- 제목은 기본 h2이며 `headingLevel`(2~6)로 문서 계층에 맞춘다. 카드는 제목의 고유 ID를 `aria-labelledby`로 연결한다. 제목 없는 카드에 이름이 필요하면 `aria-label`을 지정한다.
- 너비는 부모의 100%, 테두리는 border 토큰의 1px 실선, 모서리는 `0.375rem`, 배경은 surface(미지정 시 background), 글자는 foreground 토큰을 사용한다. 그림자와 hover 효과는 없다.
- 각 영역 패딩은 `1rem`(16px)이다. 영역 사이에는 구분선을 두지 않고 여백으로 구분한다. 카드 바깥 테두리만 유지한다.
- 제목은 16px·굵기 600, 설명은 14px/20px, 본문은 14px/22px이다. 설명은 muted-foreground 색상을 사용하고 제목 아래 4px 간격을 둔다.
- 액션은 기본 **우측 정렬**, 버튼 간격은 8px이다. 공간이 부족하면 버튼을 원래 순서대로 다음 줄로 넘기며 각 줄의 우측 정렬을 유지한다.
- 액션 버튼의 크기는 한 카드 안에서 통일하고 기본 `default`를 사용한다.
- **주요 동작 하나만 filled(`UIButton variant="default"`)**를 사용한다. 보조 동작은 `outline`, 취소는 `ghost`를 사용한다.
- 기본 순서는 **취소 → 보조 동작 → 주요 동작**이다. 주요 동작을 가장 오른쪽에 배치한다. 이 규칙은 사용하는 쪽에서 지정하며 카드가 버튼의 variant나 순서를 변경하지 않는다.
- 폼으로 사용할 때는 카드 바깥을 `<form>`으로 감싸고 저장 버튼에 `type="submit"`을 지정한다. 취소/보조 버튼은 기본 `type="button"`을 사용한다.
- Storybook `Components/UICard`의 Playground, Action Hierarchy, With Form, Without Actions, Custom Title에서 확인한다. 예제의 저장/미리보기는 로컬 피드백이며 서버 요청은 하지 않는다.


## UISwitch

켜짐/꺼짐의 두 상태를 표현하는 설정 컨트롤이다. 부분 선택 상태는 제공하지 않는다.

- `v-model`은 boolean이며 기본 상태는 꺼짐이다. 부모 모델은 `ref(false)` 등으로 초기화한다.
- 네이티브 checkbox에 `role="switch"`를 적용한다. 클릭·라벨 클릭·Space로 전환하고 Tab으로 이동한다. 상태는 네이티브 checked로 전달한다.
- 라벨은 `label[for]`와 input의 `id`로 연결하거나 `aria-label`을 지정한다. 켜짐/꺼짐에 따라 라벨을 바꾸지 않는다. 설명은 `aria-describedby`로 연결한다.
- UIButton Docs의 Boolean 컨트롤을 참고한 False / True 선택형 pill이다. 기본 높이는 30px이며 너비는 상태 문구에 맞춰 늘어난다. 상태 문구는 12px/600, 각 영역 패딩은 상하 7px·좌우 15px이다. 라벨과 가로로 배치할 때 12px 간격을 기본으로 한다.
- 바탕은 secondary, 선택 영역은 surface/foreground, 미선택 문구는 muted-foreground를 사용한다. 선택 영역에 작은 경계 그림자를 둔다. falseLabel과 trueLabel로 기본 False / True 문구를 바꿀 수 있다. 두 문구는 aria-hidden으로 처리하며 외부 라벨은 상태와 관계없이 유지한다.
- 포커스는 ring 컬러의 2px outline과 2px offset을 사용한다. disabled 상태는 전용 비활성 바탕·글자 색상을 사용하며 포커스·조작·폼 제출에서 제외한다. 켜짐·꺼짐 위치는 유지한다.
- hover 시 기존 테두리를 info-foreground로 강조한다. disabled에는 hover 강조를 적용하지 않는다.
- 상태 전환은 150ms이며 reduced motion에서는 제거한다. 고대비 모드에서는 시스템 색상과 트랙 테두리를 사용한다.
- `id`, `name`, `value`, `required`, `form`, `aria-*`, 네이티브 이벤트는 내부 input으로 전달한다. `class`는 바깥 래퍼에 적용한다.
- 폼에서는 켜진 스위치만 `name=value`로 제출하며 기본 value는 `on`이다. 꺼짐 값도 필요하면 Vue 모델에서 payload를 구성한다. 폼 초기화는 부모 모델을 명시적으로 초기화한다.
- Storybook의 Notification Settings는 변경 즉시 로컬 상태에 반영하는 카드 예제이며 서버 요청은 하지 않는다. 관리자 정책으로 고정된 설정은 disabled와 설명을 함께 제공한다.
- 접근성 기준: [WAI-ARIA Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/).


## 통합 디자인 확인 화면

Storybook `Foundations/Design Guide → Workplace`에서 페이지/카드 표면, 24px 페이지 제목, 16px 카드 제목, 14px 본문, 폼 상태, 즉시 반영 스위치와 액션 계층을 함께 확인한다. neutral/ocean 툴바로 같은 화면의 테마를 비교한다.

폼은 제출 시 검증하고 오류가 표시된 필드는 수정 중 재검증한다. 저장 중에는 컨트롤과 보조 동작을 비활성화하며, 취소는 마지막 저장된 값으로 돌아간다. 저장은 800ms 로컬 데모이며 실제 서버 요청은 하지 않는다. 상태 배너와 선택 표시는 토큰을 사용하는 예시이며 새 공개 컴포넌트가 아니다.


## UITabs

관련된 정보를 같은 화면에서 나누어 보여준다. 페이지 이동용 내비게이션이나 순차 입력 단계에는 사용하지 않는다.

- `items`는 고유하고 안정적인 `value`, 텍스트 `label`, 선택적 `disabled`를 갖는다. `label` prop은 탭 목록 전체의 접근 가능한 이름이다.
- `v-model`은 선택된 탭의 value 문자열이다. 지정하지 않았거나 지정한 항목이 삭제·비활성화되면 첫 활성 탭을 표시한다. 이 fallback은 부모 모델을 자동으로 바꾸지 않는다. 활성 항목이 없으면 패널을 표시하지 않는다.
- `orientation="horizontal"`이 기본이며 탭 목록이 위에 위치한다. `vertical`은 목록을 왼쪽, 본문을 오른쪽에 배치한다. 세로 목록 너비는 최대 12rem, 좁은 화면에서는 전체의 35% 이내이다.
- `#icon="{ item, active }"` 슬롯에 SVG를 제공한다. 아이콘은 텍스트 왼쪽의 16px 영역에 배치하고 8px 간격을 둔다. `currentColor`와 `focusable="false"`를 사용하며 텍스트 라벨을 유지한다.
- `#panel="{ item, active }"` 슬롯은 각 탭의 본문을 제공한다. 모든 패널을 마운트하고 비선택 패널은 hidden 처리해 입력 상태를 보존한다. 숨겨진 패널의 데이터 요청·타이머까지 정지시키지는 않으므로 비용이 큰 작업은 소비 화면에서 active를 확인한다.
- 탭의 최소 높이는 40px, 패딩은 상하 8px·좌우 12px, 텍스트는 14px·굵기 500이다. 패널 패딩은 16px이며 기존 surface·border·foreground 토큰을 사용한다.
- 폴더의 섹션 라벨처럼 탭과 본문을 연결한다. 가로 배치는 탭의 아래쪽, 세로 배치는 탭의 본문 쪽 테두리가 패널 테두리와 1px 겹친다. 선택 탭의 연결 변을 본문과 같은 surface 색으로 채워 한 영역처럼 보이게 한다.
- 선택 탭은 본문과 같은 surface/foreground, 미선택 탭은 옅은 secondary 배경과 muted-foreground를 사용한다. 미선택 탭도 클릭 가능하며, disabled와 구분한다. hover는 secondary-hover를 사용한다.
- 탭은 바깥쪽 모서리만 6px 둥글게 처리하고, 본문과 만나는 변은 직선으로 둔다. 탭 목록과 본문 사이 간격은 없다. 기존 primary 표시선은 사용하지 않는다.
- 포커스는 2px ring outline을 안쪽 4px 위치에 표시해 스크롤 영역에서도 잘리지 않게 한다.
- disabled 탭은 선택과 포커스 이동에서 제외한다. 모든 탭 버튼은 `type="button"`으로 폼 제출을 유발하지 않는다.
- 가로 목록은 좁은 화면에서 줄바꿈 대신 가로 스크롤을 제공한다. 세로 목록은 라벨을 줄바꿈한다. 배치 방향을 화면 폭에 따라 자동으로 변경하지 않는다.
- Tab은 선택 탭으로 진입하고 이후 본문으로 이동한다. 가로는 좌우, 세로는 상하 방향키로 활성 탭 사이를 순환한다. Home/End는 처음/마지막 활성 탭으로 이동한다.
- 방향키는 포커스만 이동한다. Enter·Space 또는 클릭으로 선택을 확정한다. 가로 탭의 상하 키는 브라우저 스크롤 동작을 유지한다.
- 각 탭과 패널에 고유 ID를 부여하고 `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-orientation`을 연결한다. 텍스트만 있는 패널도 접근할 수 있게 패널은 포커스를 받을 수 있다.
- Storybook `Components/UITabs`의 Horizontal, Vertical, Text Only, Overflow에서 비교한다. 테마 툴바로 선택/hover/포커스 상태를 확인한다.
- 접근성 참고: [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## UIDialog

현재 구현: 독립적인 업무별 Vue 컴포넌트를 `useDialog().openDialog()`로 열고 초기 payload를 전달한다. 폼 상태·검증·액션은 업무별 컴포넌트가 소유하고 `complete(result)`로 호출자에게 결과를 전달한다.

- 앱당 `UIDialogProvider` 하나를 테마 영역에 배치한다. `UIDialog`는 열린 업무별 컴포넌트 내부에서 공통 외형으로 사용한다.
- 제목은 필수이며 설명은 선택이다. 제목·본문·액션 사이 구분선은 두지 않는다. 각 영역 패딩은 16px, 제목은 16px/600, 본문은 14px이다.
- 너비는 480px, 화면 가장자리 여백은 최소 16px, 모서리는 6px이다. 높이가 부족하면 본문만 스크롤하고 제목·액션을 유지한다.
- surface·border·foreground와 기존 포커스 토큰을 사용한다. 새 `--ui-overlay` 토큰의 기본값은 `rgb(0 0 0 / 40%)`이며 모달 배경 차폐에 사용한다.
- 액션은 우측 정렬, 간격 8px이다. 취소 ghost → 보조 outline → 주요 filled 순서로 배치한다. 주요 버튼은 하나만 강조하며 좁은 화면에서는 줄바꿈한다.
- 기본 배경 클릭은 취소다. `closeOnBackdrop: false`이면 무시한다. Escape와 명시적 취소는 항상 사용할 수 있다. 모든 입력 폼에 취소 액션을 제공한다.
- 완료는 닫기·해제 후 `onResult`, 취소는 `onCancel(cancel | escape | backdrop)`으로 한 번 전달한다. 결과 처리 완료를 기다리지 않는다. 중복 종료와 이미 열린 상태의 추가 호출은 무시한다.
- payload는 읽기용 초기 데이터로 취급한다. 입력은 별도 로컬 상태에 보관하고 검증 오류는 본문 안에서 입력 필드와 연결해 표시한다. 취소 시 호출자의 데이터를 변경하지 않는다.
- 네이티브 모달의 포커스 격리와 배경 비활성화를 사용하고, 문서 본문 스크롤을 잠근다. 기본 초기 포커스는 첫 조작 요소이며 `autofocus`로 지정 가능하다. 닫으면 존재하는 원래 트리거로 포커스를 복구한다.
- 제목·설명을 접근 가능한 이름·설명으로 연결한다. 열린 다이얼로그 내부 팝업을 body로 Teleport하지 않는다.
- 중첩, 이름 등록, 자동 폼 생성과 비동기 저장 대기는 제공하지 않는다. Storybook에서 입력·결과 전달, 배경 클릭 차단, 긴 본문을 확인한다.

## UITree

현재 구현: 조직·폴더 계층의 단일 선택 트리이다. `items`의 value는 전체 트리에서 고유하며 label은 필수 텍스트이다. 트리의 접근 가능한 이름은 필수 `label` prop으로 지정한다.

- 선택은 `v-model`, 펼침은 `v-model:expanded`(문자열 배열)로 분리한다. 미지정 시 내부 상태를 사용하며 선택 없음·모두 접힘으로 시작한다.
- 행의 최소 높이 40px, 본문 14px/20px, 모서리 6px, 단계별 들여쓰기 20px이다. 긴 라벨은 줄바꿈하고 아이콘은 16px, 아이콘과 라벨 간격은 8px이다. 펼침 표시의 클릭 영역은 최소 24×24px이다.
- 중립 표면에서 hover는 accent, 선택은 selected-background/selected-foreground와 굵기 600을 사용한다. 포커스는 ring 2px 안쪽 outline으로 선택과 구분한다. disabled는 전용 배경·글자색이며 고대비 모드에서는 시스템 색상을 사용한다. 애니메이션은 없다.
- 실제 중첩 tree/treeitem/group 구조로 부모·자식 관계를 전달한다. 자식이 있는 항목만 aria-expanded를 가지며 말단은 펼침 표시가 없다. 각 항목은 label로 이름을 지정해 자손의 텍스트가 이름에 합쳐지지 않는다.
- Tab으로 선택된 가시 항목(없으면 첫 활성 항목)에 진입한다. 위/아래, 좌/우, Home/End로 포커스를 이동하고 Enter/Space로 선택한다. 끝에서 순환하지 않는다. 오른쪽은 펼치기·자식 이동, 왼쪽은 접기·부모 이동이며 RTL에서는 반대이다. 문자 입력으로 가시 라벨의 접두어를 탐색한다.
- 펼침 표시 클릭은 선택을 바꾸지 않으며 행 클릭은 선택만 한다. disabled는 자손에 상속하고 포커스·선택·펼침에서 제외한다. 비활성 상태의 이유는 소비 화면에서 라벨이나 설명으로 제공한다.
- 부모 접힘·삭제·비활성화로 포커스 항목이 사라지면 가장 가까운 활성 조상, 유효한 선택 항목, 첫 활성 항목 순서로 복구한다. 활성 항목이 없으면 트리 자체를 포커스할 수 있다. 트리 밖에 있는 포커스를 가져오지 않는다.
- 접힌 자손의 선택값은 보존한다. 삭제·비활성화된 선택값은 표시하지 않고 부모 모델은 그대로 둔다. 숨겨진 선택 항목을 자동으로 펼치지 않는다.
- icon 슬롯은 `{ item, expanded, selected }`를 받으며 장식만 허용한다. 빈 데이터에는 emptyText를 표시한다. 다중 선택·체크박스·가상 스크롤·지연 로딩·드래그 정렬은 미구현이다.
- Storybook `Components/UITree`에서 조직 선택·아이콘·긴 라벨·빈 상태·비활성을 확인한다. 접근성 참고: [WAI-ARIA Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

## UIDataTable

현재 구현: TanStack Table v8의 Vue 어댑터를 headless 엔진으로 사용한다. 정렬·필터·페이지·행 선택 계산을 검증된 엔진에 맡기고 Vue 렌더링, 네이티브 HTML 의미 구조, 테마와 상태 안내는 패키지가 관리한다. 새 런타임 의존성은 `@tanstack/vue-table`이며 버전을 고정하고 MIT 고지를 보존한다.

- 필수 data·columns·label·getRowId를 받는다. label은 보이는 caption이자 테이블 이름이다. getRowId는 정렬·필터와 무관한 고유 업무 ID를 반환해야 한다. 컬럼은 TanStack ColumnDef이며 accessorKey/accessorFn, header, cell, enableSorting, meta.align(start/center/end)을 사용한다.
- 전체 데이터를 전달하는 클라이언트 처리 방식이다. 단일 컬럼 정렬은 오름차순 → 내림차순 → 해제 순서이며 정렬 버튼과 th의 aria-sort로 상태를 전달한다. 페이지당 기본 10행, 기본 선택지는 10/20/50이고 외부 모델의 사용자 지정 크기도 표시한다.
- searchable의 검색 입력은 문자열·숫자 accessor 값에 대한 대소문자 구분 없는 부분 일치 검색이다. 실제 셀의 장식 텍스트가 아닌 원본 accessor 값으로 검색한다. 컬럼의 enableGlobalFilter=false로 제외할 수 있다. 검색·정렬 변경은 첫 페이지로 이동하고 데이터 감소 시 마지막 유효 페이지로 보정한다.
- sorting·pagination·rowSelection·globalFilter는 각각 v-model을 지원한다. 생략하면 내부 상태를 사용한다. pageIndex는 0부터 시작한다. paginated=false는 전체 결과를 표시한다.
- selectable이면 네이티브 checkbox를 표시한다. 헤더는 **현재 페이지의 선택 가능한 행만** 선택·해제하며 일부 선택은 indeterminate로 표시한다. canSelectRow로 선택 제한, getRowLabel로 checkbox의 업무상 이름을 제공한다. 행 자체는 클릭 액션이 없다.
- 선택은 페이지·검색 이동 후에도 유지하고 요약의 선택 개수는 현재 검색과 관계없이 전달된 전체 데이터 중 유효하고 선택 가능한 행을 센다. 삭제된 ID는 모델에서 자동 제거하지 않으며 다시 나타나면 선택이 복원된다. 소비 화면은 업무가 끝나거나 데이터 범위가 바뀔 때 선택 모델을 초기화한다.
- toolbar 슬롯은 selectedRows(원본 데이터 배열)·clearSelection을 받는다. 선택 전체에 대한 동작은 toolbar, 행 단위 동작은 cell-컬럼ID 슬롯에 둔다. 슬롯 내 버튼은 소비 화면이 loading/error/권한에 맞게 비활성화한다. 셀 슬롯은 row·cell·value를 받으며 특정 셀 슬롯 → 공통 cell 슬롯 → ColumnDef.cell 순으로 렌더링한다.
- 표는 기본 14px/20px, 헤더 굵기 600, 행 높이 최소 기준 44px(내용에 따라 증가), 셀 패딩 상하 8px·좌우 12px이다. caption은 16px/24px·600, 외곽 모서리는 6px이다. 셀의 가로 최소 너비는 112px, 선택 열은 44px이다. 숫자는 meta.align=end로 우측 정렬과 tabular 숫자를 사용한다.
- surface/foreground, 헤더 secondary, 행 구분선 border, hover accent, 선택 selected-background/selected-foreground를 사용한다. 체크 표시로 선택을 함께 전달한다. 색상 토큰을 추가하지 않는다. 그림자·애니메이션은 없다.
- 좁은 화면에서는 표 영역만 가로 스크롤하고 툴바·페이지 조작부는 줄바꿈한다. 표 영역은 접근 가능한 이름과 Tab 포커스를 가져 키보드 스크롤이 가능하다. 셀 전체에 grid 역할이나 별도 방향키 이동을 부여하지 않는다. 정렬 버튼·checkbox·select·페이지 버튼의 네이티브 키보드 동작을 유지한다.
- loading은 기존 행을 숨기고 로딩 문구와 aria-busy를 제공한다. error는 실패 설명과 다시 시도 버튼(retry 이벤트)을 제공한다. 빈 데이터와 검색 결과 없음을 구분한다. 상태 우선순위는 loading → error → 빈 결과 → 행이다. 표 밖의 status에서 로딩·오류·개수 변경을 안내한다.
- 서버 페이지네이션/정렬, 가상 스크롤, 컬럼 이동·리사이즈·숨김 UI, 셀 편집은 제공하지 않는다. 컬럼 header 렌더러에는 정렬 버튼 안에 중첩될 수 있는 버튼·링크를 넣지 않는다.
- Storybook `Components/UIDataTable`의 Employees, Basic, Loading, Empty, No Results, Error, Custom Cells에서 확인한다. 패키지 소비 앱과 Preflight 없는 CSS에서도 검증한다.

## UIChip

현재 구현: 상태·분류·적용된 조건을 짧은 텍스트로 표시한다. 읽기 전용이 기본이며 `removable`일 때만 제거 버튼을 제공한다. 토글 선택이나 내비게이션 기능은 제공하지 않는다. 새 의존성·색상 토큰은 없다.

- 필수 `label`이 보이는 텍스트이며 기본 슬롯으로 대체하지 않는다. 색상과 관계없이 의미를 라벨로 전달한다. 기본 루트는 span이며 자체 role·tabindex·live region을 부여하지 않는다.
- variant는 default(secondary/secondary-foreground + border, filled 배경과 1px 실선 테두리), outline(surface/foreground + border), primary(primary/primary-foreground), success·warning·info(각 background/foreground), destructive(destructive/destructive-foreground)이다. primary는 중요한 분류, 의미색은 실제 상태에만 사용한다.
- 크기는 default 최소 32px, sm 최소 28px이며 두 크기 모두 14px/20px·500을 유지한다. 둥근 pill 형태는 작은 상태·태그 표시를 위한 예외이다. 기본 좌우 패딩 10px, sm 8px, 내부 간격 4px이다.
- 긴 label은 컨테이너 안에서 줄바꿈한다. 높이는 내용에 따라 늘어나며 의미가 숨겨지는 말줄임은 적용하지 않는다. Chip 사이 간격과 줄바꿈은 소비 화면에서 flex-wrap·gap 등으로 작성한다.
- `#icon`은 앞쪽 16px 장식용 슬롯이며 aria-hidden이다. SVG는 currentColor와 focusable=false를 사용하고 버튼·링크를 넣지 않는다.
- removable의 제거 버튼은 네이티브 type=button, 24×24px이다. 기본 접근 가능한 이름은 `${label} 제거`이며 removeLabel로 바꿀 수 있다. 클릭·Enter·Space로 remove(MouseEvent)를 한 번 전달하고 클릭 전파는 중단한다. Chip 자체는 자동으로 사라지지 않는다.
- disabled는 중립 비활성 배경·글자색을 사용하고 제거 버튼을 네이티브 disabled로 처리한다. 라벨은 읽을 수 있으며 버튼은 Tab 탐색과 제거에서 제외한다. 비활성 사유가 필요하면 소비 화면에서 설명한다.
- hover는 제거 버튼의 현재 글자색 테두리로, pressed는 accent/accent-foreground로 표시한다. 포커스는 버튼 안쪽 2px currentColor outline을 사용해 진한 primary·destructive 표면에서도 대비를 유지한다. 고대비 모드는 시스템 경계·포커스 색을 사용한다. 모션은 없다.
- 제거 후 데이터·상태 안내·포커스 복구는 소비 화면 책임이다. 포커스된 Chip이 제거되면 다음 제거 버튼, 이전 제거 버튼, 목록 밖의 입력/초기화 버튼 등으로 이동한다. Storybook Removable은 이 순서와 상태 안내를 구현한다.
- Storybook `Components/UIChip`에서 Playground, Variants, Sizes And Icons, Removable, Long Label을 확인한다. UIDataTable Employees의 상태 셀에도 적용한다. 패키지 소비 앱과 Preflight 없는 구성을 브라우저에서 검증한다.

## UIProgress

현재 구현: 작업 진행률을 표시하는 읽기 전용 가로 막대이다. 실제 진행량은 소비 화면에서 전달하며 타이머·네트워크 요청·완료 이벤트를 자동으로 생성하지 않는다. 새 의존성·색상 토큰은 없다.

- 필수 label은 막대 위에 보이는 작업 이름이다. value는 처리량, max는 전체량(기본 100)이다. value 미지정·null·비유한 숫자는 진행률을 모르는 상태로 표시한다. 0은 확정된 0%이다.
- 유효한 value는 0~max로 제한한다. max가 0 이하이거나 비유한 값이면 100을 사용한다. 계산 결과는 부모 값에 쓰지 않는다. 화면 퍼센트는 소수점을 버려 완료 전 100%로 반올림하지 않는다. 막대 너비와 네이티브 값은 실제 정밀도를 유지한다.
- valueText가 있으면 기본 퍼센트/‘진행 중’을 대체하며 접근 가능한 값 설명에도 사용한다. 사용자 지정 문구는 실제 값과 일치시켜야 한다. showValue=false이면 시각적 값 문구만 숨기고 접근 가능한 이름과 값은 유지한다.
- 기본 막대는 8px, sm은 4px, lg는 12px이다. 라벨·값·설명은 14px/20px이며 라벨은 굵기 500이다. 각 영역 간격은 8px이다. 긴 라벨·설명은 줄바꿈하고 숫자는 tabular 숫자를 사용한다.
- 트랙은 secondary 채움과 border의 1px 안쪽 경계로 배경에서 구분한다. 채움은 primary, success variant는 success-foreground, destructive는 destructive를 사용한다. 색상만으로 완료·오류를 알리지 않고 label 또는 description으로 함께 설명한다. variant는 값이나 진행 여부를 자동으로 바꾸지 않는다.
- 네이티브 progress를 시각적으로만 숨겨 의미를 제공하고, 별도 시각적 막대는 aria-hidden으로 중복 낭독을 방지한다. progress는 고유 ID로 label·description과 연결한다. 불확정 상태에는 value 속성을 제거한다. 조작 컨트롤이 아니므로 Tab 포커스나 키보드 이벤트는 없다.
- 불확정 상태는 40% 너비의 막대를 1.6초 주기로 이동하고 ‘진행 중’ 문구를 표시한다. prefers-reduced-motion에서는 애니메이션 없이 가운데에 고정한다. 확정 상태에는 모션을 적용하지 않는다. RTL에서는 진행 방향을 반전하고 고대비 모드에서는 시스템 경계·Highlight를 사용한다.
- 루트에 전달하는 id·class·style 등은 전체 래퍼에 적용한다. 접근 가능한 작업 이름은 label, 값 설명은 valueText, 보충 설명은 description으로 지정한다.
- 진행률 갱신마다 live region을 사용하지 않는다. 완료·실패 알림과 작업 영역의 aria-busy는 소비 화면이 관리한다. Storybook Interactive는 작업 완료 시에만 별도 status로 안내한다.
- Storybook `Components/UIProgress`의 Playground, Indeterminate, States, Sizes, Custom Value, Interactive, Long Label에서 확인한다. 소비 앱·Preflight 제외·좁은 화면·RTL·모션 줄이기·고대비를 검증한다.

## UICircleProgress

현재 구현: 단계가 정해지지 않은 비동기 작업에 사용하는 불확정 원형 표시이다. 완료 비율·버튼 조작·요청을 제공하지 않는다. 새 의존성·색상 토큰은 없다.

- 필수 `label`은 현재 진행 중인 작업을 구체적으로 설명한다. 선택 `description`은 보충 설명이며 접근 가능한 상태에 연결한다.
- 크기는 sm 16×16px, 기본 32×32px, lg 48×48px이다. track은 secondary, indicator는 primary를 사용하며 원의 선 너비는 4px이다. 고대비 모드에서는 track GrayText와 진행 표시 Highlight를 사용한다.
- 애니메이션은 진행 중인 상태를 전달하는 1.2초 회전이다. prefers-reduced-motion에서는 움직이지 않는 열린 원형 표시로 바꾼다. 다른 색상 variant나 속도 조절 API는 제공하지 않는다.
- SVG는 장식으로 aria-hidden이며 `role=status`, `aria-live=polite` 상태 노드가 작업 이름과 설명을 연결해 ‘로딩 중’을 전달한다. 비대화형이므로 Tab 포커스를 받지 않는다. 같은 영역에서 작업 설명을 화면에 표시하고 별도 live region을 계속 추가하지 않는다.
- 자체 고유 ID를 사용하므로 같은 화면에 여러 표시를 둘 수 있다. class와 일반 id·style은 바깥 래퍼에 전달한다.
- Storybook `Components/UICircleProgress`의 Playground, Sizes, In Context에서 단독 크기와 작업 문맥, 상태 알림을 확인한다. 소비 앱·Preflight 제외·고대비·모션 줄이기에서 검증한다.

## UIDescriptions

현재 구현: 한 건의 상세 정보를 key–value 쌍으로 표시한다. 기본은 라벨 왼쪽·값 오른쪽의 테두리형이다. 네이티브 dl 안에 div별 dt·dd를 묶고 데이터 테이블과 구분한다. 새 의존성·토큰은 없다.

- 필수 label은 보이는 섹션 제목이자 접근 가능한 영역 이름이다. headingLevel(기본 2, 2~6)로 문서 계층에 맞춘다. items는 고유 key·label과 선택적 value(string/number/boolean/null)를 가진다.
- 값이 null·undefined·빈 문자열·공백 문자열이면 emptyValue(기본 ‘미등록’)를 표시한다. 0은 0, false는 ‘아니요’, true는 ‘예’로 표시한다. 날짜·통화·권한별 표시는 소비 화면에서 포맷하거나 슬롯으로 제공한다.
- value-키 슬롯 → 공통 value 슬롯 → 기본 값 렌더링 순서이며 슬롯은 { item, value }를 받는다. 슬롯으로 Chip·링크·버튼을 넣을 수 있고 각 컨트롤의 접근 가능한 이름은 소비 화면이 지정한다. 문자열을 HTML로 실행하지 않는다.
- label 제목은 16px/24px·600, 본문은 14px/22px이며 dt는 굵기 500이다. 라벨 너비는 160px, 셀 패딩은 12px이다. 내용은 위쪽에 맞추고 긴 문자열과 여러 줄 값을 줄바꿈한다.
- 기본 bordered=true: surface 표면, secondary 라벨 배경, border의 1px 외곽·행·라벨/값 구분선, 6px 모서리이다. hover·선택 효과는 없다. bordered=false는 표면과 테두리를 제거하고 간격·텍스트 계층을 유지한다.
- layout=horizontal(기본)은 컴포넌트 컨테이너 너비가 480px 이하이면 자동으로 라벨 위·값 아래로 전환한다. viewport가 넓어도 좁은 카드 내부에서는 전환한다. layout=vertical은 항상 세로 배치한다. CSS container query를 사용하며 RTL에서는 좌우 배치를 반전한다.
- 여러 정보 묶음의 페이지 Grid·Flex·간격은 서비스가 Tailwind로 작성한다. 이 컴포넌트는 한 행당 한 쌍을 표시하며 다중 쌍 컬럼·셀 병합·폼 편집 기능은 제공하지 않는다.
- 빈 items에는 emptyText(기본 ‘표시할 정보가 없습니다.’)를 표시한다. 읽기 전용 정적 정보이므로 목록에 키보드 탐색이나 live region을 추가하지 않는다. 제목과 설명은 의미에 맞는 실제 텍스트로 제공한다.
- Storybook Components/UIDescriptions의 Playground, Borderless, Vertical, Custom Values, Long Values, Narrow Container, Empty에서 확인한다.

## Notify action / UINotifyProvider

현재 구현: `useNotify()`의 notify·dismiss·clear와 UINotifyProvider를 제공한다. 비동기 작업 결과를 짧게 전달하는 비모달 알림이다. 추가 런타임 의존성과 새 토큰은 없다.

- 기본 info, success는 5초 후 닫고 warning·error는 직접 닫을 때까지 유지한다. duration=0은 유지한다. 대기열은 FIFO, 최대 3개 표시이며 대기 시간은 자동 닫기 시간에 포함하지 않는다.
- 위치는 기본 top(위 중앙)이며 provider의 position으로 top·top-left·top-right·bottom·bottom-left·bottom-right를 선택한다. left/right는 RTL에서도 물리적인 좌우이며, 선택한 화면 가장자리에서 16px을 확보한다. 최대 너비 384px이며 좁은 화면에서는 양옆 16px을 확보한다. 높이가 넘치면 알림 영역 안에서 스크롤한다. 카드 간격 12px, 패딩 16px, 모서리 6px, 표면 surface/background·테두리 border·본문 foreground를 사용한다.
- 글자는 14px/22px, 유형·제목은 600이다. 긴 문자열·줄바꿈을 유지하며 말줄임하지 않는다. 시작 경계 4px와 유형 라벨에 info-foreground·success-foreground·warning-foreground·destructive를 사용한다. 의미를 안내/성공/주의/오류 텍스트로 함께 전달한다.
- 닫기는 명확한 텍스트가 있는 네이티브 버튼이다. 키보드 포커스는 ring 2px이며 고대비에서는 시스템 경계를 사용한다. 장식 모션은 없다.
- 영역 hover·포커스·문서 숨김 동안 타이머를 멈추고 남은 시간부터 재개한다. 새 알림은 포커스를 가져가지 않는다. 닫는 알림에 포커스가 있으면 다음 알림의 닫기 또는 원래 호출 요소로 이동한다.
- 표시된 새 알림만 live region으로 안내한다. 오류는 alert, 나머지는 status이다. 화면 카드에는 중복 live role을 붙이지 않는다. 자동 닫기가 부적합한 중요 정보는 duration=0 또는 본문에도 제공한다.
- provider는 앱/테마 루트에 둔다. Teleport 없이 테마를 상속하므로 transform으로 fixed 기준이 바뀌는 부모를 피한다. 네이티브 모달의 top layer 밖 알림은 모달 위에 나오지 않으며 모달 내부 알림은 내부 provider로 제공한다.
- Storybook Actions/Notify와 소비 앱에서 동작을 확인한다. 알림 내용 슬롯·재시도 액션·알림 업데이트 API는 현재 제공하지 않는다.

## Confirm action

현재 구현: `UIDialogProvider` 아래에서 `useConfirm().confirm(options)`를 호출해 boolean Promise로 확인 결과를 받는다. 내부 UIConfirmDialog는 기존 UIDialog·UIButton을 조합하며 별도 모달 스타일·provider·런타임 의존성·컬러 토큰을 추가하지 않는다.

- UIDialog의 너비·표면·테두리·6px 모서리·제목·본문·푸터 패딩·배경 차폐를 그대로 사용한다. 본문은 일반 ui-body 텍스트이며 줄바꿈을 유지한다. 제목과 본문을 aria-labelledby·aria-describedby로 연결한다.
- 액션은 우측 정렬, 취소(ghost) → 확인(default) 순서이다. destructive=true이면 확인에 기존 destructive 버튼을 사용한다. 삭제 대상과 결과는 텍스트로 설명하며 버튼 라벨도 ‘프로젝트 삭제’처럼 구체적으로 지정한다.
- 최초 포커스는 취소 버튼이다. 네이티브 dialog의 모달 포커스 제한과 Escape 취소, 기존 provider의 호출 요소 포커스 복귀를 사용한다. 새로운 애니메이션이나 장식 아이콘은 없다.
- 배경 클릭 닫기는 기본 false로 실수로 닫히는 것을 방지한다. closeOnBackdrop=true일 때만 배경 클릭을 취소로 처리한다. 취소·Escape를 차단하는 옵션은 없다.
- 일반 dialog와 활성 상태를 공유하며 한 번에 하나만 연다. 중복·중첩 호출은 false이며 자동 대기열을 제공하지 않는다. 정상 결과는 모달 제거·포커스 복귀 뒤 전달하고 provider 해제 시 대기 중인 결과는 false로 완료한다.
- 확인만 true이다. 비동기 업무 작업은 확인 이후 호출 화면에서 진행한다. 커스텀 폼·복잡한 검증·창 안의 로딩은 기존 openDialog를 사용한다.
- Storybook Actions/Confirm의 Playground, Destructive, Backdrop Dismiss, Long Message에서 확인한다. 소비 앱·Preflight 제외·좁은 화면·테마·키보드 동작도 검증한다.

## UIList

현재 구현: 제목·설명 중심으로 여러 항목을 읽고 필요한 액션을 실행하는 목록이다. 네이티브 ul/li를 사용하며 list-style을 제거한 환경에서도 목록 의미를 유지하도록 role=list를 명시한다. 새 의존성·토큰은 없다.

- label은 보이는 제목이며 section과 목록의 접근 가능한 이름이다. headingLevel 기본 2, 2~6을 지원한다. items의 key는 목록 내 고유하고 안정적이어야 한다.
- 제목은 ui-title(16px/24px·600), 항목 제목은 14px/22px·500, 설명은 같은 크기의 muted-foreground이다. 설명 위 간격은 4px이며 긴 텍스트·개행은 숨기지 않는다.
- 기본 surface/background 표면·border 1px 외곽 경계·6px 모서리, 행 사이 1px 구분선이다. bordered=false는 외곽·표면만 제거한다. 행 hover·선택 강조는 없다.
- default 행 패딩 16px, sm 12px, 행 내부 영역 간격 12px, 액션 간격 8px이다. 크기를 바꾸어도 글자 크기를 줄이지 않는다.
- leading → 제목/설명 → meta/actions 순서이다. 슬롯에는 item·index를 전달한다. actions는 끝 정렬이며 취소 ghost → 보조 outline → 주요 default 순서를 소비 화면에서 구성한다. 컨테이너 480px 이하에서는 meta/actions가 다음 줄로 내려간다. RTL에서는 시작·끝을 반전한다.
- 제목 링크는 title 슬롯, 작업 버튼은 actions 슬롯으로 제공한다. 행 자체는 조작 요소가 아니며 tabindex·선택 모델을 부여하지 않는다. 아이콘 의미와 컨트롤 라벨은 소비 화면이 제공한다. 장식 아이콘은 aria-hidden으로 처리한다.
- 비어 있으면 emptyText 또는 empty 슬롯을 사용한다. 정적 목록에 live region은 추가하지 않는다. 삭제 후 포커스 이동·비동기 상태·검색·페이지 이동은 소비 화면에서 관리한다.
- Storybook Components/UIList에서 Playground, Compact, Borderless, With Actions, Links, Long Content, Empty, Custom Empty를 확인한다. 소비 앱과 Preflight 없는 환경, 좁은 화면·테마·키보드 사용을 검증한다.

## UITopbar

현재 구현: 서비스 공통 상단 영역을 네이티브 header로 제공한다. 페이지 Grid·Sidebar·본문 폭은 서비스가 구성하며 UITopbar는 자기 내부 배치와 표면을 관리한다. 새 의존성·토큰은 없다.

- main 밖에 배치해 banner landmark를 제공한다. label 기본 ‘상단 바’, navigationLabel 기본 ‘주요 메뉴’이다. title은 서비스 이름으로 표시하며 문서 제목 h1을 생성하지 않는다.
- leading → brand → navigation → search → actions 순서이며 없는 슬롯의 래퍼·nav는 생성하지 않는다. brand 슬롯은 기본 title을 대체한다. DOM과 키보드 순서를 유지한다.
- surface/background 표면, foreground 본문, border 1px 하단 경계이다. 페이지의 연속된 구조이므로 모서리·그림자는 없다. 최소 높이 64px, 세로 패딩 12px·가로 24px, 영역 간격 가로 24px·세로 12px이다. 브랜드는 16px/24px·600, 본문은 14px/22px이다.
- navigation의 직접 자식 링크는 최소 높이 40px·패딩 8px 12px·6px 모서리이다. hover는 accent, 현재 페이지는 primary 글자·600·밑줄로 구분하며 aria-current=page를 소비 화면에서 지정한다. 브랜드·내비게이션 링크 포커스는 ring 2px이다.
- 컨테이너 768px 이하에서는 가로 패딩 16px, nav는 한 줄 전체를 사용하고 검색·액션은 유연하게 줄바꿈한다. 브랜드가 길면 줄바꿈하며 높이는 콘텐츠에 맞춘다. RTL에서는 시작·끝 배치를 반전한다.
- 기본은 문서 흐름에 놓인다. sticky=true일 때만 position:sticky, top:0, z-index:40을 사용하며 notify(1000)와 네이티브 모달 아래에 위치한다. 스크롤 조상·오프셋은 서비스 책임이다.
- 검색은 이름 있는 입력과 필요 시 search form으로 구성한다. 버튼·아이콘의 접근 가능한 이름과 메뉴 상태·이동·검색 실행은 슬롯 소비자가 관리한다. 자동 메뉴 접기·드로어·라우터 의존성은 없다.
- Storybook Layout/UITopbar에서 기본, 통합 업무 화면, 스크롤 고정, 긴 이름을 확인한다. 소비 앱·Preflight 제외·RTL·좁은 화면·테마·키보드 탐색을 검증한다.

## UIDrawer

현재 구현: 네이티브 modal dialog 기반 측면 패널이다. v-model:open으로 제어하고 provider는 필요 없다. 기존 UIDialog의 표면·타이포그래피·버튼 순서를 사용한다. 추가 런타임 의존성·토큰은 없다.

- 오른쪽 기본, side=left는 왼쪽이며 RTL에서도 물리적 방향을 유지한다. 기본 너비 400px, sm 320px, lg 576px, 최대 100vw, 높이 100dvh이다. 화면 가장자리에 붙으므로 모서리를 둥글게 하지 않는다.
- surface/background·foreground·border와 overlay를 사용한다. 패널의 본문 방향 경계만 1px이며 제목·본문·액션 사이 구분선·장식 그림자·애니메이션은 없다.
- 제목 16px/24px·600, 설명 14px/20px muted, 본문 14px/22px이다. 각 영역 패딩은 16px이다. 본문은 남은 높이에서 스크롤하고 header/footer는 유지한다. 액션은 우측 정렬, 간격 8px이다.
- 필수 title로 접근 가능한 이름, description으로 설명을 연결한다. 제목 옆 ‘닫기’ 버튼을 항상 제공한다. Escape와 닫기는 항상 가능하며 배경 클릭은 closeOnBackdrop=true일 때만 닫는다. 내부에서 배경으로 드래그한 클릭은 닫지 않는다.
- 기본 포커스는 닫기 버튼, 본문의 autofocus로 초기 입력을 지정할 수 있다. 모달 격리는 네이티브 dialog에 맡기고 닫기·해제 시 원래 트리거로 복귀한다. 닫힌 슬롯은 해제되며 부모에 저장한 상태만 유지한다.
- UIDialog와 body 스크롤 잠금을 공유해 겹친 모달 중 하나를 닫아도 나머지 잠금을 유지한다. 테마 상속을 위해 제자리 렌더링하며 내부 팝업을 body로 Teleport하지 않는다.
- Layout/UIDrawer의 Playground, Left, Large, Navigation, Long Content, Backdrop Locked 예제와 소비 앱·Preflight 제외·모바일·테마·키보드·모달 수명주기를 검증한다.

## UIFooter

현재 구현: 네이티브 footer 기반 페이지 하단 정보 영역이다. UI 패키지는 내부 스타일을, 소비 화면은 페이지 높이·본문·하단 배치를 관리한다. 추가 의존성·토큰은 없다.

- 기본 이름은 ‘하단 정보’이며 label로 변경한다. main 밖에 배치해 contentinfo landmark를 제공한다. text 또는 기본 슬롯으로 서비스·운영·저작권 정보를 표시하며 연도·회사명을 자동 생성하지 않는다.
- 본문 → navigation → actions 순서이고 빈 슬롯의 래퍼·nav는 생성하지 않는다. navigationLabel 기본 ‘관련 링크’. navigation에는 직접 링크를 넣고 actions는 끝 정렬한다. DOM 순서와 Tab 순서를 유지한다.
- surface/background·muted-foreground와 상단 border 1px을 사용한다. 모서리·그림자는 없다. 본문 14px/22px, 최소 높이 64px, 세로 패딩 12px·가로 24px, 영역 간격 12px/24px이다.
- 링크는 foreground·밑줄, hover는 primary, 포커스는 ring 2px이다. 링크 최소 높이 32px, 세로 패딩 4px이다. 보조 액션은 기존 UIButton outline·ghost를 사용한다.
- 컨테이너 768px 이하에서는 가로 패딩 16px, 본문은 한 줄 전체를 사용하고 링크·액션은 줄바꿈한다. 긴 텍스트·개행을 유지하며 RTL에서는 시작·끝을 반전한다.
- 기본 문서 흐름을 사용하며 fixed/sticky 옵션은 없다. 페이지 높이는 서비스가 flex·min-height 등으로 구성한다. 카드·dialog의 액션 footer와 별도 용도이다.
- Layout/UIFooter의 Playground, With Links, With Actions, Custom Content, Page Layout, Long Text와 소비 앱에서 확인한다. 키보드·테마·좁은 화면·RTL·Preflight 없는 구성을 검증한다.

## 기본 반응형 레이아웃 샘플

현재 구현: Storybook Layout/Basic Layout의 Responsive에서 UITopbar·UIDrawer·UIFooter를 조합한다. 전역 grid 클래스나 새로운 공개 컴포넌트 API를 추가하지 않고 소비 화면의 Tailwind 배치 예제로 제공한다.

- 64rem(기본 1024px) 이상은 16rem(256px) 왼쪽 aside 메뉴를 항상 표시한다. 그 미만에서는 메뉴 버튼과 side=left·size=sm UIDrawer를 사용한다. 동일한 메뉴 데이터와 내비게이션 예제를 공유한다.
- 화면 높이 100dvh, Topbar/가운데 영역/Footer 3행이다. 가운데 영역에 메뉴/본문 2열을 배치하고 각 영역의 min-height를 0으로 설정한다. 본문만 스크롤해 상단·하단·왼쪽 메뉴를 유지한다. 작은 화면에서는 본문 1열이다.
- 데스크톱 aside는 비모달이다. 모바일 Drawer는 기존 포커스 제한·닫기·배경 잠금을 그대로 사용한다. 숨겨진 메뉴를 Tab으로 탐색하지 않도록 조건부 렌더링한다.
- 모드 전환 시 Drawer를 닫고 현재 메뉴 선택은 유지한다. 열린 Drawer에서 넓은 화면으로 바뀌면 현재 데스크톱 링크, 데스크톱 메뉴에 포커스가 있는 채 좁아지면 메뉴 열기 버튼으로 이동한다. 메뉴 선택 후에는 본문으로 이동한다.
- 본문 건너뛰기 링크와 페이지 h1을 제공한다. 실제 라우팅은 소비 앱에서 구현하며 샘플은 로컬 페이지 상태만 바꾼다. 예제 파일은 배포에서 제외한다.
