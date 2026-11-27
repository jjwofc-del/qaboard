# QABoard v1.0.0 — Workspace Switch & TC Results

## 변경 내역
- Demo Workspace → **Workspace** 명칭 변경
- 흰색 네이티브 선택 목록을 그린/블루 테마의 사용자 정의 드롭다운으로 변경
- Test Case 전용 페이지는 별도 하늘색/파란색 테마 적용
- 중복된 사이드바 **새 TC 작성** 제거, `＋ Add test case` 버튼 유지
- TC 목록의 **보기 / 수정**에서 최근 결과(`Not Run`, `Pass`, `Fail`, `Blocked`) 수정 가능
- 편집한 최근 결과는 TC 전용 목록, 기존 Test Cases 및 현지 브라우저 저장소에 반영
- **Test Run 실행 이력은 별도**이며 TC 최근 결과 편집 시 과거 Test Run 결과를 덮어쓰지 않음

## 주의
- 기존 `qaboard-demo` localStorage 데이터는 삭제하거나 초기화하지 않습니다.
- 배포 전 Settings & Backup에서 JSON 백업을 권장합니다.
- 데이터는 브라우저에 저장되며, 다른 기기나 사용자에게 자동 동기화되지 않습니다.
- 개인정보 입력은 하지 마세요.

# QABoard v0.9.1 — navigation bugfix

- Fixed Demo Workspace navigation for **Reports** and **Settings & Backup**.
- Previously both buttons were outside the `#navigation` click listener, so nothing happened when clicked.
- Navigation now listens on their shared parent `#demo-navigation`.
- No changes to stored localStorage data, export/restore formats, or TC features.
- No backend or personal data collection.

# QABoard v0.7.0 — Portfolio Demo

**QABoard**는 QA 테스트 케이스, 실행 결과, 버그 이슈, 품질 리포트를 한 화면에서 관리하기 위한 정적 웹 포트폴리오 프로젝트입니다. JIRA의 이슈 흐름, TestRail의 테스트 관리, monday.com의 직관적인 현황 표시에서 아이디어를 얻었습니다. 해당 서비스의 공식 제품이나 복제본은 아닙니다.

## 주요 기능

- Projects: 가상 프로젝트 생성, 상세 확인, 수정, 진행률 확인
- Test Cases: 작성, 수정, 스위트·우선순위 관리, 프로젝트 연결 및 필터
- Test Runs: 프로젝트별 케이스를 실행 목록에 가져오기, `Not Run / Pass / Fail / Blocked` 결과 저장
- Bug Management: 이슈 등록·수정·상태 변경·검색·필터·삭제·이력, 실패한 Test Run과 연결
- Dashboard & Reports: 실행 결과와 버그 현황 자동 집계, 프로젝트별 비교, CSV 내보내기
- Settings & Backup (v0.7.0): 브라우저 저장 데이터 JSON 백업·복원, 초기화 확인, 데이터 개수 자동 표시, 개인정보 안내

## 실행 및 배포

- `index.html`을 브라우저에서 열거나 VS Code Live Server로 실행합니다.
- GitHub Pages: `index.html`, `src/` 등을 저장소 **최상위(root)** 에 놓고 Settings → Pages → Deploy from a branch → `main` / `(root)`를 선택합니다.
- npm 설치, API 키, 서버·DB 설정 없이 동작합니다.
- JavaScript와 CSS는 `index.html`에서 `?v=0.7.0` 버전을 참조합니다. 업데이트 후 캐시가 남으면 강력 새로고침하세요.

## 데이터/개인정보/보안

- 모든 기록은 브라우저의 `localStorage` 키 `qaboard-demo`에 저장됩니다. **서버 동기화가 없고 브라우저/기기 간 자동 공유가 되지 않습니다.**
- 앱 자체에는 회원가입, 실제 계정, 고객정보 수집 필드가 없습니다. **자유 입력란에는 누구나 텍스트를 넣을 수 있으므로, 실명·전화·이메일·실제 고객 주문정보·비밀키를 입력하지 마세요.**
- JSON 백업에는 입력한 모든 텍스트가 포함됩니다. 백업 파일은 본인이 보관하며 공개 GitHub 저장소에 올리지 마세요.
- HTML의 원격 Google Fonts 참조를 제거했습니다. GitHub Pages 서비스 자체의 로그·호스팅 정책은 별도입니다.
- 복원은 백업 구조와 ID 중복 등을 확인한 뒤 **교체 확인 버튼을 누른 경우에만** 적용됩니다. 복원 전 현재 데이터 백업을 권장합니다.
- 브라우저 저장소는 사용자 실수·브라우저 데이터 삭제·기기 손실 등으로 소실될 수 있습니다. 중요한 업무 저장소로 사용하지 마세요.
- 정적 포트폴리오 데모이며 인증, 권한, 데이터 암호화 저장, 협업, 감사 보관, 서버 DB, 자동 백업, 상용 서비스 운영 기준을 충족하지 않습니다.

## 정확한 지표 정의

- 프로젝트별 테스트 케이스 건수는 **현재 Test Case에서 연결한 프로젝트**를 기준으로 계산합니다.
- Test Run 통계는 `results`가 있는 실행의 케이스별 결과만 집계합니다. 구버전 샘플 실행은 제외합니다.
- Pass rate = `Pass / (Pass + Fail + Blocked) × 100`; `Not Run`은 제외합니다. 분모가 없으면 `—`로 표시합니다.
- 프로젝트의 수동 Progress 값은 실제 QA Pass rate와 별개입니다.
- CSV는 요약 리포트, JSON은 전체 데이터 복원용입니다.

## 테스트

Node.js가 있다면 다음 검사를 실행할 수 있습니다.

```bash
node --check src/app.js
node test-smoke.cjs
node test-stage6.cjs
node test-stage7.cjs
```

자동 검사는 코드와 주요 데이터 로직 수준이며, 실제 브라우저 UI 조작·접근성·호스팅 통합 검증을 완전히 대체하지 않습니다. `QA_CHECKLIST.md`도 참고하세요.

## 향후 상용화 시 필요한 작업

1. 서버 측 인증 및 RBAC, 조직·프로젝트 접근 경계, 서버 저장소(PostgreSQL 등)
2. API 입력 검증, 감사 기록의 변조 방지, 보안 점검 및 개인정보 처리 정책
3. 데이터 마이그레이션, 백업·복구, 대용량·성능·동시 수정 설계
4. 쇼핑몰에 대한 QA 자동화(CI, Playwright 등) 연동과 증적 관리

이 버전은 **7단계 포트폴리오 데모 기능 구현본**입니다. 실제 쇼핑몰 운영팀의 생산용 QA 저장소라고 주장하지 않습니다.


## v0.8.0 — Projects 카드 + TC 작성 연습장
- Projects: All projects / In progress 통계 카드를 누르면 해당 프로젝트만 같은 페이지에 필터링합니다. Test cases / Tracked bugs 카드는 관련 목록으로 이동합니다.
- 사이드바 **TC 작성 연습**: 사전 조건, 수행 단계, 기대 결과를 작성하여 임시 저장하거나 `Test Cases`에 등록할 수 있습니다.
- 작성한 연습 초안은 `data.tcDrafts`에 저장되므로 기존 `qaboard-demo` 데이터 및 JSON 백업과 함께 보관됩니다. 등록 시 기존 Test Cases 배열에 추가되어 Projects 연결 케이스 수와 메뉴 숫자 등에 반영됩니다.
- **중요:** GitHub Pages에는 서버 DB가 없으므로, 등록은 현재 브라우저의 로컬 데이터에만 반영됩니다. 다른 사람의 화면이나 GitHub 저장소에 자동 동기화되지 않습니다.
- 실제 이름/전화번호/이메일/주문정보 등 개인정보 입력 금지. 연습 데이터만 사용하세요.


## v0.9.0: 작업 공간 분리 및 Test Case 전용 화면

- 사이드바 상단에서 `Demo Workspace` 또는 `Test Case` 선택
- `Test Case` 선택 시 TC 전용 홈(스프레드시트형 전체 목록)으로 전환
- `+ Add test case`에서 상세 입력, 임시 저장, TC 등록
- 등록한 TC는 전용 목록 및 기존 Demo Workspace의 Test Cases에 함께 표시
- 목록에서 TC 수정, 검색, 프로젝트 필터, 임시 저장 이어 작성 가능
- 기존 `qaboard-demo` 브라우저 저장 데이터와 JSON 백업 구조 유지
- 개인정보 및 실제 고객 정보는 입력하지 마세요. 공개 URL의 모든 방문자가 공유하는 DB가 아니라 브라우저별 저장소입니다.
