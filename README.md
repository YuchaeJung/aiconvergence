# Handoff: AICIA (AI융합산업협회) Website

## Overview

AICIA (AI Convergence Industry Association / AI융합산업협회) 홈페이지의 디자인 핸드오프 패키지입니다. AICIA는 대한민국의 AI 산업을 대표하는 비영리 산업 협회로, 이 웹사이트는 협회 소개, 사업 안내, 회원사 노출, 회원 가입, 산업 리포트/인사이트 배포를 담당합니다.

**포함 페이지:**
- 메인 랜딩 (Hero, 사업 분야, 회원사, 뉴스, 행사, 인사이트, CTA)
- About (미션, 회장 인사말, 연혁, 임원진)
- Join / 회원가입 (등급별 혜택, 절차, 신청 폼)
- Insights (리포트 아카이브, 뉴스레터 구독)

**핵심 기능 요구사항:**
- 한국어 / 영어 언어 토글 (localStorage 유지)
- 반응형 (데스크톱 우선, 모바일 대응)
- 부드러운 스크롤 리빌 애니메이션
- 회원가입 신청 폼 (백엔드 연동 필요)
- 뉴스레터 구독 (백엔드 연동 필요)

---

## About the Design Files

이 번들에 포함된 파일들은 **HTML로 제작된 디자인 레퍼런스**입니다 — 의도한 룩앤필과 인터랙션을 보여주는 프로토타입이지, 그대로 배포하는 프로덕션 코드가 아닙니다.

개발 담당자는 대상 코드베이스의 기존 환경(React/Next.js, Vue/Nuxt, SvelteKit 등)과 그 코드베이스에 이미 자리 잡은 패턴/라이브러리를 사용해 이 디자인을 **재구현**해야 합니다. 새 코드베이스라면 프로젝트 성격상 가장 적합한 프레임워크를 선택하세요(협회 홈페이지 특성상 SEO/정적 성능이 중요하므로 **Next.js App Router + Tailwind + shadcn/ui**를 권장합니다).

CMS 통합(뉴스/공지, 행사, 리포트, 회원사)이 필요할 것으로 예상되며, Sanity/Contentful/Strapi 중 하나를 고려하세요. 회원 가입 신청과 뉴스레터 구독은 서버 액션 + 이메일 발송(Resend 등) 조합으로 구현할 수 있습니다.

---

## Fidelity

**High-fidelity (hifi)** — 확정된 컬러, 타이포그래피, 스페이싱, 인터랙션이 반영된 픽셀 완성도 디자인입니다.

개발 담당자는 아래 명시된 정확한 토큰(색상 hex, 폰트, 스페이싱, 반경, 그림자)을 코드베이스의 스타일 시스템에 등록하고, 컴포넌트를 픽셀 단위로 재현하세요. 단, 접근성/시맨틱 HTML은 프로덕션 기준으로 강화하세요(제목 계층, aria-label, focus 상태, 키보드 내비게이션 등).

---

## Screens / Views

### 1. Global — Navigation Bar

- **Purpose**: 사이트 전역 내비게이션, 언어 토글, 회원가입 CTA
- **Position**: `position: fixed; top: 0`, 높이 `68px`, `z-index: 100`
- **Behavior**:
  - 초기 상태: 반투명 배경 `rgba(255,255,255,0.72)` + `backdrop-filter: blur(14px)`, 하단 보더 없음
  - 스크롤 > 8px: 배경 `rgba(255,255,255,0.9)`, 하단 `1px solid #e5e8ee` 추가
- **Layout**:
  - 최대폭 `1240px`, 좌우 패딩 `32px`
  - `display: flex; align-items: center; gap: 40px`
  - Left: 브랜드 로고 / Center-flex-1: 메뉴 6개 / Right: 언어토글 + 회원가입 버튼
- **Brand Logo**:
  - `28×28px` 어두운 사각형(`#0b1220`), 라운드 `7px`, 흰색 "AI" 텍스트 (JetBrains Mono, 12px, 700)
  - 옆에 "AI융합산업협회" (Pretendard 600, 16px) + 회색 "AICIA" 서브 (13px, `#8a94a8`)
- **Menu items** (KR / EN): 협회소개/About, 사업분야/Business, 회원사/Members, 인사이트/Insights, 행사/Events, 뉴스/News
  - 각 아이템 `padding: 8px 14px`, `font-size: 14.5px`, `color: #2a3244`
  - Hover: `background: #f7f8fa`, `color: #0b1220`
- **Language toggle**: `pill` 형태, 34px 높이, 3px inner padding, 활성 버튼은 `#0b1220` 배경 + 흰색 텍스트
- **Join button**: 검정 pill 버튼 (`#0b1220`, hover 시 액센트 컬러로 전환)

---

### 2. Homepage — Hero

- **Purpose**: 협회 정체성과 미션의 첫 임팩트, 주요 지표 노출
- **Layout**:
  - `padding: calc(68px + 80px) 0 100px` (nav 높이 + 여백)
  - 배경 그리드: 세로/가로 `1px` 라인, `80px × 80px` 셀, `rgba(11,18,32,0.045)`
  - 중앙 상단 반경형 글로우: 액센트 컬러 22% 혼합, blur `40px`
  - 두 배경 모두 `pointer-events: none`
- **Tag pill** (히어로 상단):
  - 32px 높이, 라운드 999px, 1px `#e5e8ee` 보더, 배경 반투명
  - 좌측 `22×22px` 원형 뱃지 안에 "AI" 액센트 컬러 텍스트
  - 텍스트: "2026 AI+X Top 100 발굴 — 신청 접수 중" / "2026 AI+X Top 100 — Applications open"
- **Headline (h1)**:
  - `font-size: clamp(48px, 7vw, 96px)`, `font-weight: 600`, `letter-spacing: -0.03em`, `line-height: 1.05`
  - `max-width: 14ch`, `text-wrap: balance`
  - 3줄 구성:
    - 1줄: "산업을 잇는" (기본 잉크 컬러)
    - 2줄: "인공지능" (액센트 컬러, `.accent`)
    - 3줄: "미래를 짓다." (외곽선 처리, `-webkit-text-stroke: 1.5px #0b1220; color: transparent`)
  - EN: "Connecting / **industries** / **outline** with AI."
- **Sub headline**: 4~5줄 설명, `font-size: clamp(17px, 1.4vw, 20px)`, `color: #5b6478`, `max-width: 54ch`
- **CTA 2개**:
  - Primary: 액센트 배경 "회원사 가입 신청 →"
  - Outline: `1px solid #d3d8e2` "협회 소개 보기"
- **Meta stats** (하단 그리드 4열):
  - 상단 32px 여백 + `1px solid #e5e8ee` 상단 보더
  - 각 아이템: 숫자 `clamp(28px, 3vw, 40px) / weight 600`, 라벨 `13px / #5b6478`
  - 값: 312+ 회원사 / 27 진행 중 사업 / 14개국 글로벌 파트너십 / 2017 설립

---

### 3. Homepage — Partners Marquee Strip

- **Layout**: 상하 `1px #e5e8ee` 보더, 배경 `#f7f8fa`, 패딩 `40px 0`
- **Label**: JetBrains Mono 11px, letter-spacing `0.18em`, uppercase, `#8a94a8`, 중앙 정렬
- **Marquee**: 무한 좌향 스크롤 (`animation: marquee 40s linear infinite`)
  - 좌우 그라디언트 마스크 (8% / 92% 페이드아웃)
  - 각 아이템 `font-size: 20px`, `color: #5b6478`, gap `60px`
  - JS로 컨텐츠 duplicate 하여 seamless loop
- **Content**: 과학기술정보통신부, NIPA, NIA, ETRI, IITP, KISDI, TTA, 서울 AI 허브, KAIST, SNU AI Center, 대한상공회의소

---

### 4. Homepage — Business (6 pillars)

- **Section header** (`.sec-head`): 좌측 eyebrow + h2, 우측 "전체 사업 보기 →" 링크, `margin-bottom: 60px`
- **Eyebrow**: JetBrains Mono 12px, letter-spacing `0.14em`, uppercase, 액센트 컬러, 24px 언더라인 아이콘 프리픽스
- **Heading**: "AI+X 생태계를 이끄는 6개 사업 영역" — h2 clamp(36, 4.6vw, 60), 2줄
- **Grid**:
  - `grid-template-columns: repeat(3, 1fr)`, gap `1px`, 배경 `#e5e8ee` (grid 라인 효과)
  - 외곽 `1px solid #e5e8ee`, `border-radius: 20px`, overflow hidden
- **Card** (`.biz-card`):
  - 배경 흰색, 패딩 `40px 32px`, min-height `280px`
  - hover: 배경 `#f7f8fa`, 우하단 화살표 버튼이 검정 배경 + 흰색 + `rotate(-45deg)`
  - 내부: 넘버(01~06, mono 12px, `#8a94a8`) / 아이콘 (`44×44px` 라운드10 accent-soft 배경) / h3 (22px) / p (14.5px, `#5b6478`)
  - 우하단 arrow 버튼: `36×36px` 원형, `1px #e5e8ee` 보더
- **6 pillars**:
  1. AI 생태계 조성 / AI ecosystem
  2. 산업계 교류 및 홍보 / Industry exchange
  3. 전문 인력 양성 / Talent development
  4. 정책연구 및 표준화 / Policy & standards
  5. 기술 사업화 / Commercialization
  6. 글로벌 협력 / Global partnership

---

### 5. Homepage — Members Wall

- **Heading**: "AI 사회를 선도하는 312개 회원사"
- **Grid**: `repeat(6, 1fr)`, 외곽 `1px #e5e8ee` 보더 + `border-radius: 20px`, overflow hidden
- **Cell** (`.member`):
  - `aspect-ratio: 1.6/1`, 중앙 정렬
  - 각 셀 우/하단 `1px #e5e8ee` 보더 (6n 우측, 마지막 행 하단 제거)
  - 회사명 15px / 600 / letter-spacing `-0.02em`
  - `<small>` 태그: 10px, `0.1em letter-spacing`, uppercase, `#8a94a8`, 카테고리 라벨 (예: "Foundation model", "AI Silicon")
  - hover: 배경 `#f7f8fa`, 잉크 컬러
- **18개 회원사** (예시 실제 이름):
  네이버클라우드, 카카오브레인, 삼성SDS, LG AI Research, SK텔레콤, KT, Upstage, Rebellions, FuriosaAI, 뤼튼테크놀로지스, 코난테크놀로지, Moloco, 마음AI, Twelve Labs, Sionic AI, Solt·lux, Scatter Lab, Maum.ai

---

### 6. Homepage — News (3 cards)

- **Grid**: `grid-template-columns: 1.4fr 1fr 1fr`, gap `24px`
- **Card** (`.news-card`):
  - `1px #e5e8ee` 보더, `border-radius: 12px`, overflow hidden, 흰색 배경
  - hover: `translateY(-3px)` + shadow
  - Thumb: `aspect-ratio: 16/9`, 그라디언트 배경 + 미세 그리드 오버레이
  - Feat 카드 (첫번째): thumb `aspect-ratio: 16/10`, 어두운 그라디언트 (`#0b1220 → #1e3a8a`), 안에 오버레이 타이틀 (24px, white)
  - Body 패딩 `24px`: meta (12px mono, tag 액센트 컬러) / h4 (17px, feat은 22px) / p (14px, `#5b6478`)
- **3 items** (콘텐츠는 CMS 연동 예정, 초기값):
  1. AI기본법 시행령 초안 공청회 — 2026.07.29 / Policy
  2. 2026 Emerging AI+X Top 100 신청 접수 시작 — 2026.07.22 / Program
  3. 신규 회원사 8곳 승인 — 2026.07.15 / Member

---

### 7. Homepage — Events (list)

- **Layout**: `border-top: 1px solid #e5e8ee`
- **Event row** (`.event`):
  - `grid-template-columns: 100px 1fr auto auto`, gap `32px`
  - 패딩 `28px 4px`, 하단 `1px #e5e8ee` 보더
  - hover: 배경 `#f7f8fa`, 좌우 패딩 `16px` (부드러운 인셋)
- **Date column**:
  - 월(AUG/SEP/OCT) mono 13px
  - Day: display block, 32px, weight 500, `letter-spacing: -0.02em`, Pretendard
  - 연도 + 요일: mono 13px, `#5b6478`
- **Title**: 19px / 600, sub 14px / 400 / `#5b6478`
- **Type badge**: 오프라인(액센트 소프트) / 비공개(회색), 5px 12px 패딩, 12px 폰트, 라운드 999
- **Go arrow**: `40×40` 원형 버튼, hover 시 검정 배경 + 흰색
- **4 events**: 8/14 AIIA 조찬포럼 #52, 9/03 AI+X 컨퍼런스 2026, 9/18 AI 안전 워킹그룹 4차, 10/08 도쿄 글로벌 미션

---

### 8. Homepage — Insights (4 cards grid)

- **Grid**: `repeat(4, 1fr)`, gap `24px`
- **Card** (`.insight`):
  - 패딩 `32px 28px`, `1px #e5e8ee`, `border-radius: 12px`, min-height `220px`
  - hover: 보더 검정, `translateY(-3px)`
  - `kind` (mono 11px 액센트 컬러, uppercase) / h4 (18px) / foot (12px `#8a94a8`, 상단 mt: auto)
- **4 items**: 2026 대한민국 AI 산업 지형도 / AI기본법 시행령 8가지 쟁점 / 국내 파운데이션 모델 시장 / 제조 AI 도입 실증

---

### 9. Homepage — CTA Banner

- **Layout**: `background: #0b1220`, `color: #fff`, `padding: 100px 0`
- **Grid**: `grid-template-columns: 1.4fr 1fr`, gap `60px`, `align-items: center`
- **Glow**: 우하단 액센트 컬러 방사형, blur 60px
- **Content**:
  - Eyebrow "Membership"
  - h2 "AI 산업의 다음 장을, 회원사로서 함께 씁니다."
  - Sub p `rgba(255,255,255,0.7)`, 17px
  - Buttons: Primary(흰색 배경 → hover 액센트) / Outline(반투명)

---

### 10. Homepage — Footer

- **Layout**: `padding: 80px 0 40px`, 상단 `1px #e5e8ee` 보더, 배경 흰색
- **Top grid**: `grid-template-columns: 2fr 1fr 1fr 1fr`, gap `40px`
  - Brand (로고 + 협회 소개 문단, max-width `320px`)
  - Association 컬럼: About / History / Board / Careers
  - Programs 컬럼: Business areas / Events / Reports / Membership
  - Contact 컬럼: 주소, 전화, 이메일
- **Column headers (h5)**: JetBrains Mono 12px, `0.14em letter-spacing`, uppercase, `#8a94a8`
- **Links**: 14.5px, `#2a3244`, hover 액센트 컬러
- **Bottom**: `padding-top: 32px`, 13px `#8a94a8`, 좌측 © 표기 / 우측 Privacy · Terms · Sitemap

---

### 11. About Page

- **Sub-hero**: `padding-top: calc(68px + 100px)`, 배경 `#f7f8fa`, 하단 보더
  - Eyebrow "About AICIA" / h1 clamp(40, 5vw, 72) / lead p
- **Mission section**: 2컬럼 그리드 (1fr / 1.4fr), 4개 미션 블록 (Policy / Standards / Partnership / Talent), 각 블록 상단 `1px` 보더 + 번호 라벨(mono 액센트)
- **Greeting section** (`.greeting`): 배경 `#f7f8fa` 감싼 큰 섹션
  - 초상화 자리 (`.portrait`): `aspect-ratio: 3/4`, 그라디언트 배경 + "회장 사진" placeholder — **실제 이미지 필요**
  - Blockquote: clamp(22, 2.2vw, 30) / weight 500, 미션 요약
  - 서명: Chair / 김선우 · AICIA 회장
- **History timeline** (`#history`):
  - 2컬럼: 좌측 sticky 헤더 / 우측 연도별 그룹
  - 각 연도: `grid-template-columns: 100px 1fr`, 좌측 연도(26px), 우측 성과 리스트
  - 리스트 마커: 6px 원형 액센트 컬러
  - 5개 연도 그룹: 2026 / 2024 / 2022 / 2019 / 2017
- **Board (`#board`)**: 배경 `#f7f8fa`
  - Grid `repeat(4, 1fr)`, gap 24px
  - 카드: 패딩 `28px 24px`, `#f7f8fa` 배경, `border-radius: 12px`
  - role (mono 11px 액센트) / 이름 (20px) / 소속 (14px)
  - 8명: Chair / Vice Chair×2 / Director×3 / Auditor / Secretary General

---

### 12. Join Page

- **Sub-hero**: Eyebrow "Membership" / h1 "AI 산업의 다음 장을..."
- **Tiers section** (`#benefits`):
  - Grid `repeat(3, 1fr)`, gap 24px
  - 카드 3개 (Associate / **Corporate featured** / Founding):
    - 일반 카드: 흰색, `1px #e5e8ee`
    - Featured: 배경 `#0b1220`, 흰색 텍스트, 상단 좌측 "가장 인기" 액센트 뱃지
    - lvl (mono 12px uppercase) / nm (28px) / price (36px Pretendard, +unit) / feature ul (14.5px, 체크 아이콘 SVG 인라인 배경)
  - 가격: ₩1,200,000/년 / ₩4,800,000/년 / 별도 협의
- **Process** (5 steps):
  - Grid `repeat(5, 1fr)`, 각 스텝 좌측 `1px #e5e8ee` 보더 (첫번째 제외)
  - 스텝: STEP 01~05 (mono, 액센트) / h4 17px / p 14px
- **Form section** (`#apply`):
  - Wrap: 배경 `#f7f8fa`, `border-radius: 20px`, 패딩 `80px`
  - Grid `1fr / 1.4fr`, gap `80px`
  - Left: 헤딩, lead, 연락처 블록
  - Right form:
    - Field: label (mono 12px uppercase `#5b6478`) / input (44px 높이, `1px #d3d8e2`, radius 8, focus 시 액센트 링 3px)
    - 2컬럼 배치 반복 (`form-row`), 마지막 textarea + 제출 버튼
    - Submit: 액센트 버튼 "가입 신청 제출 →"
  - **폼 필드**: 회사명, 사업자등록번호, 담당자, 직책, 이메일, 연락처, 희망등급(select 3), 사업영역(select 8), 간단소개(textarea)

---

### 13. Insights Page

- **Sub-hero**: Eyebrow "Insights" / h1 "현장이 만든 산업 지식"
- **Filter bar**: 상하 `1px #e5e8ee` 보더, 패딩 `24px 0`
  - Chip 버튼 6개: 전체(활성) / 연간 리포트 / 정책 브리프 / 시장 분석 / 현장 케이스 / 표준·안전
  - Chip: 8/16 패딩, 라운드 999, 13px, hover 검정 보더, 활성 시 검정 배경 + 흰색
  - **동작**: 목록 필터링 로직 필요 (SPA 시 클라이언트 필터, SSR 시 querystring)
- **Featured report**:
  - Grid `1.1fr / 1fr`, gap 48, 검정 배경, 패딩 48px, 라운드 20
  - 우상단 액센트 글로우
  - Left body: tag(mono 11px 액센트) / h2 clamp(28,3.2vw,44) / p / stats(3열: 92p / 312 / 14) / 버튼 2개
  - Right cover: 3/4 비율의 리포트 커버 mock (그라디언트 + 그리드 + 큰 연도 '26)
- **Reports grid**: `repeat(3, 1fr)`, gap 24
  - 각 카드 cover: 4/3, 컬러별 그라디언트 (c1~c6 6가지: 네이비/시안/인디고/오렌지/그린/퍼플)
  - 커버 내부: tag (mono 11px) + title (22px)
  - Body: foot (mono 12px, PDF 페이지수 / 발행월)
  - 6개 리포트: AI기본법 8쟁점, 파운데이션 모델 시장, 제조 AI ROI, AI 안전 가이드라인 v2, AI 인재 수급 결산, AI 반도체 Kor Report
- **Subscribe**:
  - 배경 `#f7f8fa`, 패딩 60, 라운드 20, 2컬럼
  - Left: 뉴스레터 안내
  - Right: 이메일 input(52px 라운드) + Subscribe 버튼 (52px)

---

## Interactions & Behavior

### Language Toggle
- KR/EN 토글 버튼 클릭 → `document.body.classList.toggle('lang-en')`
- CSS 규칙: `[data-lang="en"] { display: none; }`, `body.lang-en [data-lang="kr"] { display: none; }`, `body.lang-en [data-lang="en"] { display: inline; }`
- **`localStorage`에 `aicia_lang` 키로 저장**, 페이지 로드 시 복원
- 모든 페이지에서 일관되게 동작해야 함
- 실 개발 시: Next.js면 `next-intl` 또는 App Router의 서브 라우팅(`/kr`, `/en`) 사용을 권장

### Scroll Reveal
- `.reveal` 클래스: 초기 `opacity: 0; transform: translateY(24px)`
- IntersectionObserver로 진입 시 `.in` 클래스 추가 → `opacity: 1; transform: none`
- Transition `opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1)`
- `threshold: 0.08`, `rootMargin: '0px 0px -40px 0px'`
- 한 번 트리거 후 `unobserve`

### Nav Scroll State
- `window.scrollY > 8` → `.nav.scrolled` 토글
- 반투명 → 반쯤 불투명 배경, 하단 보더 표시

### Marquee
- CSS `@keyframes marquee` `to { transform: translateX(-50%); }`, 40s linear infinite
- JS로 `.marquee` 내부 innerHTML을 자기 자신에게 concat (seamless loop)

### Hover 상태
- 버튼 primary: `translateY(-1px)` + 액센트 컬러로 배경 전환
- 카드 (news, insight): `translateY(-3px)` + shadow
- Biz card 우하단 arrow: `rotate(-45deg)` + 검정 배경 + 흰색
- Event row: 좌우 인셋 확장 (`padding-left/right: 16px`) + 배경 tint
- Member cell / footer link / menu item: 미세한 배경 및 컬러 변화

### Form 상태 (Join)
- input focus: `border-color: 액센트`, `box-shadow: 0 0 0 3px color-mix(in oklch, 액센트 15%, transparent)`
- 제출: 현재 `alert()` 목업 → **실제 백엔드 엔드포인트로 교체 필요** (`POST /api/join`)
- Validation:
  - 필수: 회사명, 담당자명, 이메일
  - 이메일 형식 체크
  - Success/Error 토스트 UI 필요 (현재 미구현)

### Newsletter subscribe (Insights)
- 이메일 input + POST → **백엔드 연동 필요** (`/api/newsletter`)
- 성공/중복/에러 상태 UI 추가

### Responsive breakpoints
- `@media (max-width: 960px)`:
  - Nav menu 숨김, 햄버거 메뉴 필요 (현재 미구현 — **개발 시 추가**)
  - Section 패딩 `120px → 80px`
  - Hero meta 4열 → 2열
  - Biz grid 3열 → 1열
  - Members wall 6열 → 3열
  - News grid → 1열
  - Insights grid → 2열
  - CTA banner grid → 1열
  - Footer top → 2열
  - Tier grid → 1열
  - Process → 1열 (세로)
  - Form 2컬럼 → 1컬럼

### 접근성 개선 필요 사항 (개발 시)
- 이미지 alt 텍스트 (회장 사진, 이벤트 이미지 등)
- 폼 label과 input 명시적 연결 (`htmlFor`/`id`)
- 언어 전환 시 `<html lang>` 속성도 함께 변경
- Focus 링 명시 (현재 스타일로도 있으나 outline: 0 제거된 곳 재확인)
- Skip to content 링크 추가

---

## State Management

- **`lang`**: `'kr' | 'en'` — localStorage 지속, 전역
- **`navScrolled`**: `boolean` — window scroll 이벤트로 갱신
- **`tweaksOpen`**: `boolean` — Tweaks 패널(디자인 단계 전용, 프로덕션에서는 제거)
- **`filter`** (Insights): 활성 카테고리 chip
- **폼 상태** (Join, Newsletter): controlled input, submitting/success/error 3상태

**데이터 소스** (백엔드/CMS 연결 대상):
- 회원사 목록 (312+, 카테고리 태그)
- 뉴스/공지 (제목, 본문, 카테고리, 발행일, 썸네일)
- 행사 (제목, 날짜, 장소, 유형, 상세 URL)
- 리포트 (제목, 카테고리, 페이지수, 발행일, PDF URL, 커버 컬러 인덱스)
- 임원진 (이름, 역할, 소속)
- 연혁 (연도별 성과 리스트)

---

## Design Tokens

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| `--bg` | `#ffffff` | 기본 배경 |
| `--bg-soft` | `#f7f8fa` | 섹션 alternate, 카드 hover |
| `--bg-mute` | `#eef1f6` | 뮤트 뱃지 |
| `--line` | `#e5e8ee` | 기본 보더 |
| `--line-strong` | `#d3d8e2` | 강조 보더 (input) |
| `--ink` | `#0b1220` | 본문 텍스트, 다크 배경 |
| `--ink-2` | `#2a3244` | 서브 본문 |
| `--ink-3` | `#5b6478` | 캡션, 서브 텍스트 |
| `--ink-4` | `#8a94a8` | 저강조 라벨, mono 텍스트 |
| `--accent` | `#2563eb` | 브랜드 액센트 (Blue 기본) |
| `--accent-2` | `#1d4ed8` | 액센트 hover |
| `--accent-soft` | `#eff4ff` | 액센트 배경 tint |
| `--accent-ink` | `#0b3ea8` | 액센트 tint 위 텍스트 |

**대체 팔레트** (디자인 옵션):
- Indigo: `#4f46e5` / `#4338ca` / `#eef0ff` / `#2a2599`
- Teal: `#0d9488` / `#0f766e` / `#e6fbf7` / `#065f57`
- Graphite: `#334155` / `#1e293b` / `#f1f5f9` / `#0f172a`

### Typography

**폰트 스택**:
- Display / Sans: `"Pretendard", "Inter", ui-sans-serif, system-ui, sans-serif`
- Mono: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
- Serif 옵션: `"Noto Serif KR", "Instrument Serif", serif`
- 대체 산세리프: `"IBM Plex Sans KR"`

**폰트 로딩**:
- Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`
- Google Fonts: Inter, JetBrains Mono, IBM Plex Sans KR, Noto Serif KR
- **프로덕션에서는 self-host + `font-display: swap` 권장**

**Type scale**:
| Style | Size | Weight | Letter-spacing | Line-height |
|-------|------|--------|----------------|-------------|
| h1 | `clamp(48px, 7vw, 96px)` | 600 | `-0.03em` | 1.05 |
| h1 (sub-hero) | `clamp(40px, 5vw, 72px)` | 600 | `-0.03em` | 1.05 |
| h2 | `clamp(36px, 4.6vw, 60px)` | 600 | `-0.025em` | 1.05 |
| h3 | `clamp(22px, 2vw, 28px)` | 600 | `-0.02em` | 1.1 |
| h4 | `18px` | 600 | `-0.01em` | 1.35 |
| body | `16px` | 400 | `-0.005em` | 1.55 |
| lead | `clamp(17px, 1.4vw, 20px)` | 400 | 기본 | 1.55 |
| eyebrow | `12px` mono | 500 | `0.14em` uppercase | — |

### Spacing
- Section padding: `120px 0` (tight `80px 0`)
- Section padding (mobile): `80px 0`
- Container max-width: `1240px`, side padding `32px`
- Card padding: 카드 종류별 `24px`, `28px 24px`, `32px 28px`, `40px 32px`
- Section header margin-bottom: `60px`
- Grid gap: 주로 `24px`, 강조 `32px`, big `60/80px`

### Radius
- `--radius-sm`: 6px
- `--radius`: 12px (카드)
- `--radius-lg`: 20px (섹션 콘테이너)
- `--radius-xl`: 28px (예약)
- pill: 999px (버튼, 뱃지, chip)

### Shadow
- `--shadow-sm`: `0 1px 2px rgba(11,18,32,0.04), 0 1px 1px rgba(11,18,32,0.03)`
- `--shadow`: `0 4px 20px -6px rgba(11,18,32,0.08), 0 2px 6px -2px rgba(11,18,32,0.04)`
- `--shadow-lg`: `0 20px 60px -20px rgba(11,18,32,0.18)`

### Button variants
- `.btn`: 48px 높이, 라운드 999, gap 10, 15px / 500
- `.btn-sm`: 40px 높이, 14px
- Primary / Accent / Outline / Ghost 4종
- 아이콘 화살표: hover 시 `translateX(3px)` (`.arr`)

---

## Assets

**현재 사용된 자산은 모두 CSS / SVG 인라인 / 웹폰트 CDN**입니다.

**필요한 실제 자산** (개발 시 준비):
- **AICIA 로고 파일** (SVG + PNG @2x). 현재는 CSS로 그린 `28×28` 브랜드 마크 사용
- **회장 초상 사진** (About > Greeting) — `aspect-ratio: 3/4`, 라운드 12
- **회원사 로고** (Members Wall) — 현재 텍스트 이름만 표시. 실제 사이트는 그레이 톤 로고 이미지(SVG 우선)를 그리드에 배치
- **뉴스 카드 썸네일** (News section) — 현재는 그라디언트 placeholder
- **행사 이미지** (Events → 상세 페이지에서 사용 예정)
- **리포트 커버 이미지** (Insights) — 현재는 컬러 그라디언트 + 그리드로 mock. 실제로는 각 리포트 커버 디자인 파일 필요
- **OG / social preview 이미지** (메타태그용)
- **파비콘 세트** (16, 32, apple-touch-icon 등)

**아이콘**: 모두 인라인 SVG (Lucide 스타일 stroke=1.7~2). 프로덕션에서는 `lucide-react` 등 아이콘 라이브러리로 교체 권장.

---

## Files

번들 안에 포함된 원본 디자인 파일:

- `AICIA Homepage.html` — 메인 랜딩 페이지
- `about.html` — 협회 소개
- `join.html` — 회원가입
- `insights.html` — 인사이트/리포트
- `assets/styles.css` — 공통 스타일 (모든 페이지 공유)
- `assets/app.js` — 공통 JS (언어 토글, 스크롤 리빌, nav 상태, marquee, 디자인 tweaks)

**Tweaks 관련 코드** (디자인 단계 전용, 프로덕션 이관 시 제거):
- `assets/app.js` 내 Tweaks IIFE
- 각 HTML 하단의 `.tweaks-btn`, `.tweaks-panel` 마크업
- `<script>window.__TWEAK_DEFAULTS__ = ...</script>` 블록
- `styles.css` 내 `.tweaks-*` 규칙

---

## Recommended Implementation Path

1. **프레임워크**: Next.js 14+ App Router
2. **스타일**: Tailwind CSS + 위 디자인 토큰을 `tailwind.config.ts`에 등록 (커스텀 컬러, 폰트, 그림자)
3. **컴포넌트 라이브러리**: shadcn/ui (버튼, 인풋, 폼, 셀렉트, 토스트)
4. **폰트**: `next/font/local` 로 Pretendard self-host + `next/font/google` 로 Inter/JetBrains Mono
5. **i18n**: `next-intl` 또는 라우트 기반 (`/[locale]/...`)
6. **CMS**: Sanity (구조화 데이터: 뉴스, 행사, 리포트, 회원사, 임원진)
7. **폼**: Server Actions + Zod validation + Resend (알림 메일)
8. **애니메이션**: Framer Motion (Reveal) 또는 CSS `@starting-style` 활용
9. **접근성**: Radix 프리미티브 활용 (모달, 셀렉트, 탭)
10. **SEO**: `<Metadata>` API, sitemap.ts, robots.ts, JSON-LD (Organization schema)

---

## Notes

- **텍스트 내용**은 데모 목적으로 실제 AI 업계 회사/기관 이름을 사용했습니다. 프로덕션 반영 전 협회의 정식 승인/파트너십 확인 후 노출하세요.
- 회원사 카테고리 태그(예: "Foundation model", "AI Silicon")도 확정된 분류 체계로 재정의 필요.
- 회장 인사말, 임원진 정보, 연혁 등 실제 데이터는 협회 사무국 확인 후 CMS에 입력.
- **AI+X Top 100**, **AIIA 조찬포럼** 등 프로그램명은 참조 사이트(K-AI)에서 차용 — AICIA 협회의 실제 프로그램명으로 교체 필요.
