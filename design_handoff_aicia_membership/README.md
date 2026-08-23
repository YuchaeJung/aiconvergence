# Handoff: AICIA Membership Signup Flow

## Overview

이 핸드오프는 AICIA(AI융합산업협회) 웹사이트의 **회원가입 기능 (Membership Signup Flow)**에 대한 상세 명세입니다. 이전 정적 홈페이지 위에 실제 동작하는 가입 폼, 접수 완료 페이지, 그리고 사이트 전역에서 로그인 상태를 반영하는 UI를 추가했습니다.

**범위:**
- 회원가입 폼 검증, 제출, 접수번호 발급
- 접수 완료 페이지 (접수번호 복사, 진행 단계 표시, 신청 내역 요약)
- 전역 Nav의 로그인 상태 표시 (프로필 chip + 드롭다운 메뉴)
- 홈페이지 히어로의 라이브 회원사 카운터

**주요 사용자 흐름:**
1. `/join` 진입 → 등급 카드/절차/폼 확인
2. 폼 입력 → 실시간 검증 → 제출 (700ms 로딩)
3. `AICIA-YYYYMMDD-XXXX` 접수번호 발급 → `/join_complete?no=<번호>`로 자동 이동
4. 완료 페이지에서 접수번호 복사, 진행 단계 및 신청 내역 확인
5. 이후 사이트 전역 Nav 우상단에 "회원가입 버튼" 대신 회사명 프로필 chip 표시
6. 홈페이지 히어로의 "312+ 회원사" 카운트가 자동 증가 (313, 314…)

---

## About the Design Files

이 번들에 포함된 파일들은 **HTML로 제작된 디자인 레퍼런스**입니다 — 의도한 룩앤필과 클라이언트 사이드 로직을 보여주는 프로토타입이며, 그대로 배포하는 프로덕션 코드가 아닙니다.

개발 담당자는 대상 코드베이스의 기존 환경(React/Next.js, Vue/Nuxt 등)과 이미 자리잡은 폼/검증 라이브러리, 상태 관리, 인증 시스템을 사용해 이 디자인을 **재구현**해야 합니다. 새 코드베이스라면 **Next.js App Router + Server Actions + Zod validation + Resend(이메일)** 조합을 권장합니다.

**현재 프로토타입의 한계와 프로덕션 요건:**

| 프로토타입 | 프로덕션에서 필요한 것 |
|---|---|
| localStorage에 신청 내역 저장 | 서버 DB (Postgres/Prisma 등) |
| localStorage 세션 | 실제 인증 세션 (NextAuth / 자체 JWT 등) |
| 클라이언트 사이드 접수번호 생성 | 서버에서 원자적으로 발급 |
| `setTimeout(700)` 로딩 시뮬레이션 | 실제 API 호출 + 낙관적 UI |
| 클라이언트만 검증 | 서버 사이드 스키마 검증 (Zod 등) |
| 접수 완료 = 그냥 로컬 저장 | 접수 확인 이메일 발송 + 관리자 알림 |
| Consent 체크 = boolean | 개인정보 처리방침 링크, 동의 이력 저장 |
| 중복 감지 = (email, company) 로컬 매치 | DB 유니크 인덱스 + 서버 검증 |

---

## Fidelity

**High-fidelity (hifi)** — 확정된 컬러, 타이포그래피, 스페이싱, 인터랙션이 반영된 픽셀 완성도 디자인입니다. 폼 검증 메시지, 로딩 상태, 에러/성공 상태, 프로필 드롭다운, 진행 단계 표시 등 인터랙션이 모두 실제 구현되어 있습니다.

개발 담당자는 아래 명시된 정확한 토큰(색상 hex, 폰트, 스페이싱, 반경, 애니메이션 곡선)을 스타일 시스템에 등록하고, 컴포넌트를 픽셀 단위로 재현하세요.

---

## Screens / Views

### 1. `/join` — Application Form Page

**Purpose:** 방문자가 자신의 기업 정보를 입력하여 AICIA 회원가입을 신청하는 페이지.

**전체 구조:** 상단 nav → 서브히어로 → 등급 카드 3개 → 5단계 절차 → **폼 섹션 (초점)** → footer.
이번 핸드오프의 초점은 마지막 **폼 섹션 (`#apply`)** 입니다. 상단부 (등급, 절차)는 기존 About/홈페이지 핸드오프 참고.

#### 1-1. Signed-in Banner (조건부 표시)

- **표시 조건**: 이미 신청 이력이 있는 방문자 (`AICIA.currentMember()` 반환값이 있을 때)
- **Layout**:
  - `display: flex; align-items: center; gap: 16px;`
  - `padding: 16px 20px; margin-bottom: 24px;`
  - `border-radius: 12px; background: #eff4ff (--accent-soft); border: 1px solid rgba(37,99,235,0.25);`
- **좌측 아이콘 원**: `36×36px`, `border-radius: 999px`, `background: #2563eb (--accent)`, 흰색 체크 SVG
- **중앙 텍스트**:
  - 제목 (ttl): "이미 가입 신청이 접수되어 있습니다." / "You've already applied." — 15px / 600 / `#0b3ea8 (--accent-ink)`
  - 서브 (msub): "접수번호 `AICIA-20260823-A1B2` · 회사명" — 13px / `--ink-3`
  - 접수번호는 `<code>` 태그 (JetBrains Mono 12px, 흰색 반투명 배경, 4px radius)
- **우측 버튼**: 40px 높이 outline 버튼 "신청 현황 보기 / View status" → `/join_complete`
- **동작**: 폼 필드는 자동 pre-fill 되어 편집 가능(재신청 케이스 대응)

#### 1-2. 폼 컨테이너 (`.form-wrap`)

- **Layout**:
  - `background: #f7f8fa (--bg-soft); padding: 80px; border-radius: 20px;`
  - `display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start;`
- **좌측 (안내)**:
  - eyebrow "Apply"
  - h2 "신청 폼" (32–44px clamp)
  - lead p (17–20px, `--ink-3`)
  - `.contact` 블록: 상단 `1px solid --line` 보더 + 32px 상단 여백. 강조 라벨 + 이메일/전화/주소, 14px, 라인하이트 1.8

#### 1-3. 폼 필드 (`#join-form`, `<form novalidate>`)

전체: `display: flex; flex-direction: column; gap: 20px;`
2컬럼 행: `.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`

**필드 표준 스타일** (`.field`):
- `display: flex; flex-direction: column; gap: 8px;`
- Label: `font-size: 12px; font-weight: 500; letter-spacing: 0.03em; text-transform: uppercase; color: --ink-3;`
- Input/Select/Textarea:
  - Height 44px (textarea `min-height: 100px`, resizable vertical)
  - `padding: 0 14px` (textarea `12px 14px`)
  - `border: 1px solid --line-strong (#d3d8e2); border-radius: 8px; background: #fff;`
  - `font: inherit; font-size: 15px; color: --ink;`
  - Focus: `border-color: --accent; box-shadow: 0 0 0 3px color-mix(in oklch, --accent 15%, transparent);`, `outline: 0`
- **Error state** (`.field.has-error`):
  - Input `border-color: #dc2626; background: #fef7f7;`
  - Focus shadow: `rgba(220,38,38,0.15)`
  - Error text: 12px, `#b91c1c`, `-2px` 상단 여백

**필드 목록 (순서대로):**

| 순서 | 필드명(name) | 타입 | Label KR / EN | 필수 | 검증 규칙 |
|---|---|---|---|---|---|
| 1 | `company` | text | 회사명 / Company | ✓ | 2–80자 |
| 2 | `bizNo` | text | 사업자등록번호 / Business no. | | `^\d{3}-\d{2}-\d{5}$` (있을 때만) |
| 3 | `contactName` | text | 담당자 성함 / Contact name | ✓ | 2–40자 |
| 4 | `role` | text | 직책 / Role | | — |
| 5 | `email` | email | 이메일 / Email | ✓ | RFC 이메일 형식 |
| 6 | `phone` | text | 연락처 / Phone | | — |
| 7 | `tier` | select | 희망 등급 / Desired tier | | 3 옵션: Associate / **Corporate (기본)** / Founding |
| 8 | `area` | select | 주요 사업 영역 / Business area | | 8 옵션 (아래 참조) |
| 9 | `intro` | textarea | 간단 소개 / Brief introduction | | 최대 500자 |
| 10 | `consent` | checkbox | 개인정보 수집·이용 동의 | ✓ | 반드시 체크 |

**Business area 옵션:** Foundation Model / LLM · AI Silicon / 반도체 · Enterprise AI · AI + 제조 · AI + 금융 · AI + 의료 · Consumer AI · 기타

**Autocomplete 속성**: 각 필드에 적절한 `autocomplete`(organization / name / email / tel / organization-title) 부여.

#### 1-4. Consent Checkbox (커스텀 스타일)

- **Wrapper (`.check`)**: `display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: --ink-2; line-height: 1.5;`
- **Checkbox**:
  - `appearance: none; width: 18px; height: 18px;`
  - Unchecked: `border: 1.5px solid --line-strong; border-radius: 5px; background: #fff;`
  - Checked: `background: --accent; border-color: --accent;`
  - Checked pseudo: 흰색 체크마크 SVG (10×10, `stroke-width: 3.5`)
  - Focus-visible: 3px accent 링 (opacity 0.2)
- **동의 문구**: "개인정보 수집·이용에 동의합니다. (회원 심사 목적) / I consent to the collection and use of personal data for membership review."
- **프로덕션 필수**: 개인정보 처리방침 페이지 링크 추가, 서버에서 동의 이력(IP, 타임스탬프, 문구 버전) 저장

#### 1-5. Form-level Alert (`.form-alert`)

- **위치**: 폼 필드 아래, 제출 버튼 위
- **기본 스타일 (error)**: `padding: 14px 16px; border-radius: 10px; background: #fef7f7; border: 1px solid #fecaca; color: #991b1b; font-size: 14px;`
- **Success 변형** (`.form-alert.success`): `background: --accent-soft; border-color: color-mix(--accent 40%); color: --accent-ink;`
- **표시 케이스**:
  - "입력을 확인한 뒤 다시 시도해 주세요." — 유효성 검증 실패 시
  - "이미 같은 회사·이메일로 접수된 신청이 있습니다." — 중복 감지 시
  - "오류가 발생했습니다. 잠시 후 다시 시도해 주세요." — 예상치 못한 에러

#### 1-6. Submit Button (`[data-submit-btn]`)

- 기본: `.btn.btn-accent` 스타일 (48px 높이, 라운드 999, accent 배경)
- 내부 구성: `<span class="btn-label">텍스트</span>` + 화살표 SVG (`.arr`) + 스피너 SVG (`.spinner`, 기본 hidden)
- **Loading state** (`disabled=true`):
  - 텍스트 opacity 0.7
  - 화살표 숨김 (`arr.hidden = true`)
  - 스피너 표시 + `animation: spin 0.7s linear infinite`
  - 커서 `wait`, opacity 0.7
- **텍스트**: "가입 신청 제출 / Submit application"
- 우측 note (12px, `--ink-4`): "* 개인정보는 회원 심사 목적으로만 사용됩니다. / * Data used only for membership review."

---

### 2. `/join_complete?no=<applicationNo>` — Application Received Page

**Purpose:** 가입 신청 접수 확인, 접수번호 발급, 진행 상태 및 신청 내역 표시.

**두 개의 뷰가 조건부로 렌더링됨:**
- **Success view**: URL의 `?no=<번호>` 또는 현재 세션이 유효할 때
- **Not-found view**: 접수 기록이 없을 때 (예: 새 브라우저, 데이터 삭제 후)

#### 2-1. Success — Complete Hero

- **Layout**: `padding: calc(68px + 100px) 0 80px;` (nav 오프셋 + 여백), 하단 `1px --line` 보더
- **배경 글로우**: 상단 중앙 방사형 accent 22% 혼합, `filter: blur(50px)`, 700×400px
- **콘텐츠**: `max-width: 720px`, 좌측 정렬

**Check Badge (성공 아이콘)**:
- `72×72px; border-radius: 999px; background: --accent; color: #fff;`
- Box-shadow: `0 8px 24px -6px color-mix(--accent 50%);`
- 내부: 32×32 흰색 체크 SVG (stroke-width 2.5)
- **애니메이션**: `@keyframes pop`
  ```css
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
  ```
  `duration: 0.5s; timing: cubic-bezier(0.2, 1.4, 0.4, 1); (스프링 느낌)`

**Eyebrow**: "Application received" (mono 12px accent uppercase, 위 24px 여백)

**Headline (h1)**:
- `font-size: clamp(40px, 5vw, 68px); font-weight: 600; letter-spacing: -0.03em;`
- `max-width: 18ch; text-wrap: balance;`
- KR: "가입 신청이 / 접수되었습니다."
- EN: "Your application / has been received."

**Lead paragraph** (17–20px, `--ink-3`):
- KR: "AICIA 사무국이 접수 내용을 확인한 뒤, **3영업일 이내** {email}로 회신드립니다. 아래 접수번호로 언제든 진행 상황을 조회하실 수 있습니다."
- `<strong>` 부분 볼드, {email}은 신청자 이메일로 치환

**Receipt Card (접수번호 표시)**:
- `display: inline-flex; align-items: center; gap: 14px; padding: 14px 20px;`
- `border: 1px solid --line; border-radius: 12px; background: #fff; box-shadow: --shadow-sm;`
- 좌측 스택:
  - 라벨: "접수번호 / Application no." (mono 11px `--ink-4` uppercase)
  - 번호: mono 18px / 500 / `--ink` (예: `AICIA-20260823-A1B2`)
- **Copy 버튼**:
  - 32px 높이, 라운드 999, `1px --line` 보더, 흰색 배경
  - 아이콘 (12×12 copy SVG) + 텍스트 "복사 / Copy"
  - Hover: 검정 보더, 검정 텍스트
  - **클릭 → 클립보드 복사 → 1.6초간 상태 전환:**
    - 배경 `--accent`, 흰색 텍스트, "복사됨 / Copied"
    - `navigator.clipboard.writeText()` 실패 시 fallback: `Range` + `Selection` API로 텍스트 선택

**CTA Row (버튼 2개)**:
- Primary "홈으로 돌아가기 / Back to home" → `/`
- Outline "최신 리포트 살펴보기 / Browse latest reports" → `/insights`
- 상단 40px 여백, gap 12px, wrap 허용

#### 2-2. Status Track (진행 단계 바)

- **Layout**: `background: --bg-soft; padding: 60px 0;` 하단 `1px --line` 보더
- **Track**: `max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(5, 1fr);`
- **연결선 (::before)**:
  - `position: absolute; top: 22px; left: 10%; right: 10%;`
  - `height: 2px; background: --line; z-index: 0;`
- **Step (5개)**:
  - 각 스텝: `flex-direction: column; align-items: center; gap: 12px; text-align: center; z-index: 1;`
  - **Dot**: `44×44px; border-radius: 999px; background: #fff; border: 2px solid --line;`
    - 내부: mono 13px / 600, `--ink-4`, 텍스트 "02" "03" "04" "05"
  - **`.done`** (완료): dot `background: --accent; border: --accent; color: #fff;`, 체크 SVG (16×16, stroke-width 3)
  - **`.active`** (현재): dot `background: --ink; border: --ink; color: #fff;`, `box-shadow: 0 0 0 6px color-mix(--accent 15%);`
  - 라벨 (13px 500): "신청 접수 / 사무국 확인 / 이사회 승인 / 회비 & 온보딩 / 활동 시작"
  - Active 라벨은 600 / `--ink`
  - 서브라벨 (11px `--ink-4`): 날짜(step 1), "진행 중"(step 2), "분기별"(step 3), "—"(step 4, 5)
- **초기 상태**: Step 1 = done (신청 접수), Step 2 = active (사무국 확인), 나머지 미완료

#### 2-3. Receipt Summary (신청 내역 요약)

- **Layout**: `padding: 100px 0;`
- **Wrap**: `display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;`
- **좌측 카드 (KV table)**:
  - eyebrow "Application summary" + h2 "신청 내역" (28–40px)
  - lead p (수정 문의 안내 + `hello@aicia.or.kr` 링크)
  - `.kv` 컨테이너: `border: 1px solid --line; border-radius: 12px; background: #fff; overflow: hidden;`
  - `.kv-row`: `display: grid; grid-template-columns: 200px 1fr; padding: 16px 20px; gap: 20px; align-items: baseline;` 하단 `1px --line` 보더 (마지막 제외)
  - 키 (`k`): mono 11px, 0.12em letter-spacing, uppercase, `--ink-4`
  - 값 (`v`): 15px, `--ink` — `.mono` 변형은 JetBrains Mono 14px, `.muted` 변형은 `--ink-3` 14px
- **8개 필드**: 회사 / 사업자번호(.mono) / 담당자 / 직책(.muted) / 이메일(.mono) / 연락처(.mono) / 희망 등급 / 사업 영역
- **우측 카드 (Next Steps)**:
  - eyebrow "Next steps" + h2 "앞으로의 절차"
  - `.next-steps { flex; direction: column; gap: 24px; }`
  - 각 `.next-step`: `grid-template-columns: 40px 1fr; gap: 16px; padding: 20px 0;` 상단 `1px --line` (마지막은 하단도 보더)
  - 번호 `.n`: mono 12px accent
  - 제목: 16px / 600
  - 본문: 14px `--ink-3` / line-height 1.55
- **4단계 절차**: 사무국 확인 (3영업일) → 이사회 승인 (분기별) → 회비 & 온보딩 → 활동 시작

#### 2-4. Not-found view (오류/빈 상태)

- **표시 조건**: 접수 기록이 없거나 세션 만료
- **Layout**: `padding: calc(68px + 120px) 0 120px; text-align: center;`
- Eyebrow "No application found" (inline-flex, centered)
- h1 (28–40px): "조회된 신청이 없습니다. / No application found."
- p (`--ink-3`, `max-width: 46ch`, center): 안내 문구
- CTA 버튼 2개 (centered): "가입 신청하기" (accent) + "홈으로" (outline)

---

### 3. Global Nav — Auth Chip (Signed-in State)

**Purpose:** 사이트 전역에서 "이 사용자는 이미 회원가입을 신청했다"는 사실을 명확히 표시하고, 진행 상황 조회 및 로그아웃 진입점을 제공.

**표시 로직**:
- 세션 없음 → 기존 "회원가입 / Join" 버튼 그대로 표시
- 세션 있음 → 회원가입 버튼을 `display: none` 처리하고, 아래 chip을 nav-actions에 삽입

#### 3-1. Auth Chip Button (`.auth-chip-btn`)

- **Layout**:
  - `display: inline-flex; align-items: center; gap: 10px;`
  - `height: 40px; padding: 3px 12px 3px 3px;`
  - `border-radius: 999px; border: 1px solid --line; background: #fff;`
- **Avatar (`.auth-avatar`)**:
  - `30×30px; border-radius: 999px;`
  - `background: --ink; color: #fff;`
  - Text: mono 11px / 700, letter-spacing `-0.02em`
  - 내용: 회사명 앞 2글자 (한글은 초성 조합 상태 그대로, upperCase)
- **Name (`.auth-name`)**:
  - 13.5px / 500, `--ink`, `letter-spacing: -0.01em`
  - 회사명 최대 16자 (초과 시 `…` 트런케이트)
- **Chevron**: 12×12 down-arrow SVG, `--ink-4`
- **Hover**: `border-color: --ink;`

#### 3-2. Auth Menu (드롭다운)

- **Position**: `position: absolute; top: calc(100% + 10px); right: 0;`
- **Layout**:
  - `width: 300px; background: #fff;`
  - `border: 1px solid --line; border-radius: 12px; padding: 8px;`
  - `box-shadow: --shadow-lg; z-index: 110;`
- **Head (`.auth-menu-head`)**:
  - `padding: 14px 14px 16px; border-bottom: 1px solid --line; margin-bottom: 6px;`
  - Company: 15px / 600 / `--ink`
  - Application no.: mono 11px, letter-spacing 0.04em, `--ink-4` (상단 4px 여백)
  - Status pill:
    - `display: inline-flex; align-items: center; gap: 8px;`
    - `padding: 5px 10px; border-radius: 999px; background: --accent-soft; color: --accent-ink; font: 12px/1 500;`
    - Dot: `6×6px; border-radius: 999px; background: --accent; box-shadow: 0 0 0 3px color-mix(--accent 25%);`
    - 라벨: 상태별 KR/EN — "접수됨 · 사무국 확인 중 / Received · under review" (`received`), "심사 중 / In review" (`review`), "승인 완료 / Approved" (`approved`)
- **Menu items (`.auth-menu-item`)**:
  - `display: flex; align-items: center; gap: 10px;`
  - `padding: 10px 14px; border: 0; border-radius: 8px; background: transparent;`
  - `color: --ink-2; font-size: 14px;`
  - Icon 14×14, `--ink-4`
  - Hover: `background: --bg-soft; color: --ink;`
  - **2개 아이템**: "신청 현황 보기 / View application" → `/join_complete`, "로그아웃 / Sign out" → session clear + re-render

#### 3-3. Toggle 동작

- Chip 버튼 클릭 → 메뉴 `hidden` 토글
- 다른 auth chip 열림 시 자동 닫힘
- Chip 외부 클릭 시 자동 닫힘

---

### 4. Homepage Hero — Live Member Counter

- **위치**: 히어로 하단 4열 메타 스트립의 첫 번째 아이템
- **마크업**:
  ```html
  <div class="num">
    <span data-live-count="members">312</span><span style="color:var(--accent)">+</span>
  </div>
  ```
- **동작**:
  - `DOMContentLoaded`에서 `AICIA.memberCount()` 호출 (baseline 312 + localStorage 신청 개수)
  - 결과 문자열을 `[data-live-count="members"]`의 `textContent`에 대입
- **표시 예**: 312 → 313 (+1 가입) → 314 (+2 가입)…
- **프로덕션**: 이 숫자는 서버에서 렌더링해야 함 (SSR 또는 API). 캐싱은 stale-while-revalidate로.

---

## Interactions & Behavior

### Form Validation

**실시간(Live) 에러 클리어링**:
- `form.addEventListener('input')`에서 해당 필드의 `data-error-for` 오류를 즉시 제거
- 사용자가 필드를 수정하면 붉은 상태에서 즉시 벗어남

**Submit 시퀀스**:
1. `event.preventDefault()` + `clearErrors()`
2. FormData → 객체로 변환 (trim, boolean 캐스팅)
3. `validate(data)` → errors 객체
4. errors가 있으면:
   - 각 필드에 `setFieldError(name, msg)` 적용
   - 첫 번째 오류 필드에 `.focus()`
   - form-alert에 "입력을 확인한 뒤 다시 시도해 주세요."
   - 종료
5. errors 없으면:
   - `setLoading(true)` — 버튼 비활성, 스피너 표시
   - `setTimeout(700ms)` 후 `AICIA.register(data)` 호출
   - 성공 → `location.href = /join_complete?no=<applicationNo>`
   - 실패(중복) → `setLoading(false)` + form-alert "이미 같은 회사·이메일로 접수된 신청이 있습니다."
   - 기타 실패 → 일반 오류 메시지

**언어 인지 검증 메시지**:
- 각 오류 메시지는 KR/EN 튜플로 정의됨 (`MESSAGES.required = ['필수 입력 항목입니다.', 'This field is required.']`)
- `t(kr, en)` 함수가 `body.classList.contains('lang-en')`을 기반으로 선택

### Copy-to-clipboard (완료 페이지)

- `navigator.clipboard.writeText(applicationNo)`
- 성공: 버튼에 `.copied` 클래스 (배경 accent, 흰색 텍스트), 라벨 "복사됨 / Copied", 1600ms 후 원복
- 실패(권한 없음/오래된 브라우저): `Range` + `window.getSelection()`으로 접수번호 텍스트 선택 (사용자가 수동 복사)

### Animations

| 요소 | 이름 | Duration | Easing | Trigger |
|---|---|---|---|---|
| Reveal on scroll | `.reveal → .in` | 700ms | `cubic-bezier(0.2, 0.7, 0.2, 1)` | IntersectionObserver (threshold 0.08) |
| Success check pop | `@keyframes pop` | 500ms | `cubic-bezier(0.2, 1.4, 0.4, 1)` (spring) | Mount |
| Spinner | `@keyframes spin` | 700ms | linear infinite | `[data-submit-btn][disabled]` |
| Hover buttons | translate | 180ms | ease | hover |
| Hover cards | translate + shadow | 200ms | ease | hover |
| Copy button state | color/bg swap | 150ms | ease | click |

---

## State Management

### 클라이언트 상태 (localStorage 기반, 프로토타입)

- **`aicia_members`** — Array 형태의 접수 기록 저장소
  ```ts
  type Member = {
    applicationNo: string;    // "AICIA-YYYYMMDD-XXXX"
    company: string;
    bizNo?: string;
    contactName: string;
    role?: string;
    email: string;
    phone?: string;
    tier: 'Associate' | 'Corporate' | 'Founding';
    area: string;
    intro?: string;
    consent: boolean;
    status: 'received' | 'review' | 'approved';
    submittedAt: string;      // ISO
  };
  ```
- **`aicia_session`** — `{ applicationNo: string } | null`
- **`aicia_lang`** — `'kr' | 'en'`
- **`aicia_tweak_defaults`** — 디자인 단계 전용 (프로덕션 제거)

### `window.AICIA` API (전역 헬퍼)

```ts
window.AICIA = {
  readMembers():   Member[];
  currentSession():{ applicationNo: string } | null;
  currentMember(): Member | null;
  memberCount():   number;                    // 312 + members.length
  register(payload): Member;                  // throws { code: 'duplicate', applicationNo } if dup
  signOut():       void;
}
```

**중복 감지 로직**: `email.toLowerCase() === existing.email.toLowerCase() && company.trim() === existing.company.trim()`.

**Application no. 발급**: `AICIA-${YYYY}${MM}${DD}-${randomBase36 4자 upper}`. 프로덕션은 서버에서 원자적으로 발급 필요.

### 페이지 로드 시 상태 반영

- **모든 페이지 nav**: `DOMContentLoaded`에서 auth chip 렌더 (`render()`), 세션 있으면 join CTA 숨김
- **Homepage**: 라이브 카운터 업데이트
- **Join page**: 세션 있으면 signed-in banner 표시 + 폼 pre-fill
- **Join complete page**: URL `?no` 또는 세션 기반으로 record 조회 → 성공 뷰 or not-found 뷰

### 프로덕션 상태 전이

- `received` → `review` (사무국 담당자가 검토 시작)
- `review` → `approved` (이사회 승인)
- `review` → `rejected` (거부, 프로토타입엔 미구현)

---

## Design Tokens

**이 기능은 기존 AICIA 디자인 시스템 토큰을 그대로 사용합니다.** 기존 핸드오프의 `assets/styles.css`에 정의된 CSS 변수를 그대로 상속. 추가된 신규 토큰은 없음.

### 이번 기능에서 명시적으로 사용된 값

| 카테고리 | 값 | 용도 |
|---|---|---|
| Danger red | `#dc2626` / `#b91c1c` / `#991b1b` / `#fef7f7` / `#fecaca` | 필드 에러, form-alert |
| Accent (--accent) | `#2563eb` | Focus 링, submit 버튼, 성공 뱃지, active step |
| Accent soft (--accent-soft) | `#eff4ff` | Signed-in 배너, status pill 배경, success alert |
| Accent ink (--accent-ink) | `#0b3ea8` | Accent 배경 위 텍스트 |
| Ink (--ink) | `#0b1220` | 아바타 배경, active step dot |
| Border radius | 5px (checkbox), 8px (input/menu-item), 10px (form-alert), 12px (banner/receipt/kv), 999px (chip/pill/badge) |
| Font (mono) | JetBrains Mono, `letter-spacing: 0.12–0.14em`, uppercase | 접수번호, 라벨, KV 키 |
| Font (avatar) | JetBrains Mono 11px / 700, `-0.02em` | 프로필 아바타 이니셜 |
| Font (application no.) | JetBrains Mono 18px / 500 | 접수번호 대형 표시 |

### 신규 CSS 유틸리티 클래스

- `.auth-chip`, `.auth-chip-btn`, `.auth-avatar`, `.auth-name`, `.auth-menu`, `.auth-menu-head`, `.auth-menu-company`, `.auth-menu-meta`, `.auth-menu-status`, `.auth-menu-item`
- `.field-error`, `.field.has-error`, `.check`, `.form-alert`, `.form-alert.success`
- `.already-applied`, `.already-applied .ico`, `.already-applied .ttl`, `.already-applied .msub`
- `.check-badge`, `.receipt`, `.receipt .copy-btn`, `.copy-btn.copied`
- `.status-track`, `.status-step`, `.status-dot`, `.status-step.done`, `.status-step.active`
- `.kv`, `.kv-row`, `.next-steps`, `.next-step`
- `[data-submit-btn]`, `[data-live-count]`, `[data-signed-in-banner]`, `[data-form-alert]`

---

## Assets

이 기능에서 신규로 필요한 이미지 자산은 없습니다. 아이콘은 모두 inline SVG (Lucide-style stroke).

**사용된 아이콘 (모두 currentColor)**:
- 체크마크 (success badge, checkbox, done step): `<polyline points="20 6 9 17 4 12">`
- 화살표 우향 (CTA, arrow buttons): `M5 12h14M13 5l7 7-7 7`
- 복사 (clipboard): `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>`
- 시계/현황 (auth menu): `<path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="4"/>`
- 로그아웃: `<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>`
- Chevron down (chip): `<polyline points="6 9 12 15 18 9"/>`
- 스피너: `<circle cx="12" cy="12" r="9" stroke-opacity="0.25"/><path d="M21 12a9 9 0 00-9-9"/>` (회전)

**프로덕션 권장**: `lucide-react` 또는 유사 아이콘 라이브러리로 교체.

---

## Accessibility Notes

- 모든 form input에 `id` + `for` 연결된 `<label>` 존재
- Signed-in banner: 새 정보 표시 시 `aria-live="polite"` 추가 권장 (프로토타입 미포함)
- Auth menu: 접근성 강화를 위해 `role="menu"`, `role="menuitem"`, `aria-expanded` 추가 권장
- Consent checkbox: `:focus-visible` 3px 링 있음
- Copy 성공 시 스크린리더 알림 (`aria-live`) 추가 권장
- Success check pop 애니메이션은 `prefers-reduced-motion`을 존중하도록 개선 필요:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .check-badge { animation: none; }
    .reveal { transition: none; opacity: 1; transform: none; }
  }
  ```

---

## Files

**이번 기능이 추가/변경한 파일:**

- `join.html` — 폼 마크업 대폭 확장, 실시간 검증 스크립트 하단 추가, 신규 스타일 (검증/consent/alert/banner/spinner)
- `join_complete.html` — 신규 페이지 (성공/not-found 두 뷰)
- `AICIA Homepage.html` — 히어로 카운터에 `data-live-count="members"` 훅 추가
- `assets/app.js` — `window.AICIA` 인증 API, nav auth chip 렌더러, 라이브 카운터 훅 추가
- `assets/styles.css` — auth chip / menu 스타일 신규 (Hero 섹션 위쪽에 추가)

**기존 유지 (참고용, 이번 번들엔 미포함)**: `about.html`, `insights.html`.

---

## Recommended Implementation Path (프로덕션)

1. **프레임워크**: Next.js 14 App Router
2. **폼**: `react-hook-form` + `zod` (스키마 재사용: 클라이언트 & 서버 검증 모두)
3. **제출**: Server Action (`'use server'`) + Prisma DB 저장
4. **접수번호 발급**: DB unique 시퀀스 또는 서버 side ULID/CUID
5. **이메일**: Resend (신청자 접수 확인 + 사무국 알림)
6. **세션**: NextAuth (이메일 매직링크) — "접수번호 조회" UX와 자연스럽게 연결됨
7. **접수 상태 관리**: 관리자 대시보드 (별도 프로젝트 또는 `/admin`)
8. **`/join_complete`**: `[?no=<applicationNo>]` 쿼리 파라미터로 서버에서 record 조회 → 없으면 not-found 뷰 (SSR)
9. **회원사 카운트**: `/api/members/count`를 SSG + revalidate 60s, 홈페이지에서 서버 컴포넌트로 fetch
10. **개인정보 처리방침**: 별도 페이지 (`/privacy`) + consent 문구에 링크

### Zod 스키마 예시

```ts
import { z } from 'zod';

export const JoinApplicationSchema = z.object({
  company: z.string().trim().min(2).max(80),
  bizNo: z.string().regex(/^\d{3}-\d{2}-\d{5}$/).optional().or(z.literal('')),
  contactName: z.string().trim().min(2).max(40),
  role: z.string().trim().max(80).optional(),
  email: z.string().email(),
  phone: z.string().trim().max(30).optional(),
  tier: z.enum(['Associate', 'Corporate', 'Founding']),
  area: z.enum([
    'Foundation Model / LLM',
    'AI Silicon / 반도체',
    'Enterprise AI',
    'AI + 제조',
    'AI + 금융',
    'AI + 의료',
    'Consumer AI',
    '기타',
  ]),
  intro: z.string().max(500).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: '동의가 필요합니다.' }),
  }),
});
```

### DB 스키마 예시 (Prisma)

```prisma
model MembershipApplication {
  id             String   @id @default(cuid())
  applicationNo  String   @unique             // "AICIA-YYYYMMDD-XXXX"
  company        String
  bizNo          String?
  contactName    String
  role           String?
  email          String
  phone          String?
  tier           Tier
  area           String
  intro          String?
  consentVersion String                        // 개인정보 처리방침 문구 버전
  consentAt      DateTime
  consentIp      String?
  status         ApplicationStatus @default(received)
  submittedAt    DateTime @default(now())
  reviewedAt     DateTime?
  approvedAt     DateTime?
  @@unique([email, company])                   // 중복 방지
}

enum Tier { Associate Corporate Founding }
enum ApplicationStatus { received review approved rejected }
```

---

## Notes for Reviewers / QA

- **테스트 시나리오**:
  1. 빈 폼 제출 → 필수 필드 에러 3개 (company, contactName, email) + consent 에러 표시
  2. 잘못된 이메일 → 이메일 필드 에러
  3. 잘못된 사업자번호 형식 (예: "123") → bizNo 필드 에러
  4. 정상 제출 → 스피너 → 자동 이동 → 접수번호 표시
  5. 동일 이메일+회사로 재제출 → form-alert "이미 접수된 신청이 있습니다"
  6. 다른 회사명으로 재제출 → 새 접수번호 발급 (별도 케이스)
  7. 홈으로 이동 → 히어로 카운트 +1 확인, nav 우상단 프로필 chip 확인
  8. 프로필 chip 클릭 → 드롭다운 → "신청 현황" 클릭 → 완료 페이지 이동
  9. 드롭다운 "로그아웃" → chip 사라지고 "회원가입" 버튼 복귀
  10. `/join_complete` 직접 방문 (세션 없음) → "조회된 신청이 없습니다" 뷰
  11. `/join_complete?no=<유효번호>` → 해당 신청 뷰
  12. KR/EN 토글 시 모든 문구 및 검증 메시지가 언어에 맞춰 전환되는지

- **알려진 제약**:
  - 접수번호는 클라이언트에서 생성되므로 이론상 충돌 가능 (프로토타입 한정)
  - localStorage 삭제 시 신청 이력 소실
  - 이메일 발송 없음 (프로덕션 필수)
