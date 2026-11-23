# UI 스타일 가이드

사내 업무 화면은 빠른 탐색, 정확한 입력, 반복 작업의 일관성을 우선합니다. 서비스는 화면 배치·반응형·비즈니스 동작을 관리하고, 패키지는 컴포넌트의 크기·타이포그래피·상태 표현을 관리합니다. CSS 연결은 [README](./README.md#서비스에-연결하기)를 참고합니다.

## 크기와 타이포그래피

아래 px 값은 루트 글꼴 16px 기준입니다. 표의 높이와 기본 글자 크기는 `rem` 또는 Tailwind 기본 스케일을 사용하므로 서비스의 루트 글꼴 크기에 비례합니다.

| 버튼·한 줄 입력 크기 | 높이 | 사용처 |
| --- | --- | --- |
| `sm` | 32px | 테이블·툴바의 반복 조작 |
| `default` | 36px | 일반 폼과 카드 액션 |
| `lg` | 48px | 터치 중심 또는 넓은 조작 영역 |

- 같은 행의 버튼과 입력은 같은 크기를 사용합니다. 기본 간격은 8px입니다. 아이콘 전용 버튼은 같은 높이 스케일을 사용하고, 정사각형이 필요하면 높이에 맞는 너비를 Tailwind로 지정합니다. SVG는 16px로 표시하며 텍스트가 없는 버튼에는 `aria-label`을 제공합니다.
- 기본 컨트롤과 본문은 14px(0.875rem), 카드 제목은 16px, 페이지 제목은 24px, 보조 메타 정보는 12px입니다. 제목의 HTML 계층을 유지하면서 `ui-h1`~`ui-h6`, `ui-title`, `ui-subtitle`, `ui-body`, `ui-body-lg`, `ui-caption`, `ui-label`을 적용합니다. [타이포그래피 클래스](./src/styles/typography.css)
- 일반 컨트롤과 카드는 모서리 6px를 사용합니다. 간격은 4·8·12·16·24·32px를 출발점으로 삼고, 폼 그룹에는 24px를 기본으로 합니다. 카드 액션은 우측에 취소(`ghost`), 보조(`outline`), 주요(`default`) 순서로 둡니다. 주요 액션은 그룹당 하나입니다.

## 테마

서비스의 CSS에서 `:root` 또는 테마 컨테이너에 `--ui-*` 색상 변수를 재정의합니다. 배경과 그 위의 글자색은 함께 조정합니다. 화면은 중립색을 기본으로 하고, `primary`는 주요 액션과 선택에, 성공·주의·오류에는 각 의미색을 씁니다.

```css
:root {
  --ui-primary: #0369a1;
  --ui-primary-foreground: #ffffff;
  --ui-ring: #0284c7;
}
```

| 역할 | 토큰 |
| --- | --- |
| 화면·표면·텍스트 | `--ui-page-background`, `--ui-background`, `--ui-foreground`, `--ui-muted-foreground`, `--ui-surface` |
| 액션과 선택 | `--ui-primary` / `--ui-primary-foreground`, `--ui-secondary` / `--ui-secondary-foreground`, `--ui-accent` / `--ui-accent-foreground`, `--ui-selected-background` / `--ui-selected-foreground` |
| 경계·포커스·차폐 | `--ui-border`, `--ui-control-border`, `--ui-control-border-hover`, `--ui-ring`, `--ui-overlay` |
| 비활성 | `--ui-disabled-background` / `--ui-disabled-foreground` |
| 의미색 | `--ui-destructive` / `--ui-destructive-foreground`, `--ui-success-background` / `--ui-success-foreground`, `--ui-warning-background` / `--ui-warning-foreground`, `--ui-info-background` / `--ui-info-foreground` |

기본 색상은 [토큰 소스](./src/styles/tokens.css)에 있습니다. `--ui-surface`를 생략하면 `--ui-background`를 사용합니다. 선택적 상태 변수 `--ui-primary-hover`, `--ui-primary-pressed`, `--ui-secondary-hover`, `--ui-accent-pressed`, `--ui-destructive-hover`, `--ui-destructive-pressed`를 생략하면 현재 테마 색상으로 계산합니다. [Tailwind 매핑](./src/styles/index.css)

일반 텍스트 4.5:1, 포커스 표시 3:1을 프로젝트 검토 기준으로 사용합니다. 일반·hover·선택·비활성·오류를 인접 색상과 함께 확인합니다. Storybook의 neutral은 패키지 기본 테마이며 ocean은 색상 재정의 예제입니다.

## 폼과 액션

- 라벨은 입력과 연결합니다. 필수 여부와 입력 형식은 입력 전에 안내하고, 오류 문구에는 원인과 고치는 방법을 담습니다. 제출 후 첫 오류 입력으로 포커스를 옮기고, 오류가 여러 개면 각 입력으로 이동하는 요약을 제공할 수 있습니다.
- 필드 값으로 해결 가능한 서버 오류는 해당 필드에 연결합니다. 연결 실패처럼 폼 전체에 해당하는 오류는 별도 안내를 표시하고 입력값을 보존합니다. 저장 중 중복 제출을 막고, 취소는 마지막 저장값이나 초기값을 복원합니다. 미저장 편집에서 이탈할 때는 계속 편집하거나 변경을 버릴 수 있게 합니다.
- 상태는 색상과 문구를 함께 사용합니다. 화면에 남아야 하는 안내는 `UIAlert`, 짧은 작업 결과는 알림을 사용합니다. 필수 안내는 본문이나 입력 도움말에 두고 툴팁은 보충 설명에 사용합니다.

| 입력 | 사용 기준 |
| --- | --- |
| `UISwitch` | 조작 직후 반영되는 켜기·끄기 설정 |
| `UICheckbox` | 저장할 예·아니요 값 또는 독립적으로 여러 항목 선택 |
| `UIRadioGroup` | 소수의 상호 배타적 항목을 한눈에 비교 |
| `UISelect` | 접힌 목록에서 검색 없이 단일 항목 선택 |
| `UICombobox` | 이름·코드로 검색해 단일 항목 선택 |

## 데이터 화면

- 검색 조건의 편집값과 적용값을 구분합니다. 검색 적용·초기화 시 첫 페이지를 표시합니다. URL 공유가 필요하면 적용한 필터·정렬·페이지 중 공유 가능한 값만 넣습니다. 상세에서 돌아올 때 목록을 복원한 후 스크롤과 행 포커스를 복원합니다.
- 로딩, 처음부터 데이터 없음, 검색 결과 없음, 오류와 권한 제한을 구분해 다음 행동을 제시합니다. 로딩 자리에는 필요에 따라 `UISkeleton`을 사용하고, 진행량을 아는 작업은 `UIProgress`로 표시합니다. 표의 가로 스크롤은 표 영역에 둡니다.
- 달력상의 날짜·연월과 실제 발생 시각을 구분합니다. 실제 발생 시각은 서비스 기준 시간대로 표시하고 필요한 경우 시간대를 함께 씁니다. 같은 단위의 수치는 우측 정렬하며 단위·소수점 자리수를 맞춥니다. 미입력·미집계는 숫자 0과 구분합니다. 말줄임한 업무 데이터는 상세 링크나 펼치기로 전체를 읽을 수 있게 합니다.

업무 화면의 조합은 Storybook `Patterns`에서, 서버 조회와 선택 연동은 [README의 데이터 테이블 안내](./README.md#데이터-테이블)에서 확인합니다.

## 접근성과 모션

- 키보드 탐색과 포커스 표시를 확인합니다. 모달 닫기 후에는 가능한 경우 호출 위치로 돌아갑니다. 정보와 상태를 색상만으로 전달하지 않습니다.
- 상태를 따라가는 데 필요한 모션을 짧게 사용합니다. 아코디언 열기·닫기와 Drawer 열기는 180ms입니다. 시스템에서 동작 줄이기를 켜면 상태 변화가 즉시 반영되고 로딩 모션은 정지합니다.

## 브라우저 검증

자동 회귀는 Playwright Chromium을 기준으로 하며 Storybook, 소비 앱, Preflight를 제외한 배포 CSS를 확인합니다. 실제 배포 브라우저·OS가 정해지면 날짜·연월·시간의 네이티브 선택기 표시, 입력·삭제, 키보드 조작과 경계·간격 제약을 확인합니다. 연월 입력이 텍스트로 대체되는 환경에서는 서비스가 `YYYY-MM` 형식 안내와 검증을 제공합니다.
