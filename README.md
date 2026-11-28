## v1.2.2 — Test Suite 관리 일관화

- 요청서 명칭을 **개발 작업 요청서**로 통일하고 생성 진입점은 Dashboard에만 둡니다. 사용설명법의 설명 및 연결 버튼은 유지합니다.
- Test Case 첫 화면을 **Test Suite**로 표시하고 상단 버튼을 **+ Add Test Suite**로 변경했습니다.
- Suite 상세 화면에서 **+ Add Test Case**로 세부 케이스를 생성합니다.
- 이전 버전의 `기존 TC` 가상 묶음도 수정할 수 있습니다. 정보 저장 시 기존 TC를 손실 없이 정식 Suite로 전환합니다.
- Test Suite 삭제는 확인창을 거칩니다. 포함된 TC·Test Run 이력은 삭제하지 않고 `기존 TC` 묶음으로 보존합니다. 임시 저장 초안도 삭제되지 않습니다.
- 업데이트 전 Settings & Backup의 JSON 내보내기를 권장합니다.

## v1.2.1 · 웹사이트 사용설명법

- WORKSPACE SELECT 드롭다운에 **사용설명법** 메뉴를 추가했습니다.
- Project → Test Case → Test Runs → Bug → Reports → GPT 개발 요청서 → Settings & Backup 순으로 안내합니다.
- 목차, 실제 화면으로 이동하는 버튼 및 이전화면 지원.
- 안내문은 정적 콘텐츠이며 기존 브라우저 QA 데이터나 저장 스키마를 변경하지 않습니다.

## v1.1.8 — 화면 이동 기록 및 오른쪽 상단 이전화면

- 오른쪽 상단에 `← 이전화면` 버튼을 추가했습니다.
- Dashboard → Project 상세 → 연결된 Test Suite 등 여러 단계의 화면 이동을 순서대로 되돌릴 수 있습니다.
- Test Case와 Workspace 사이의 이동도 직전 화면 상태로 복원합니다.
- 이전 화면 기록은 브라우저 탭 메모리에만 저장하며 QA 데이터/localStorage 구조는 변경하지 않습니다.
- 첫 진입에는 이전 기록이 없으므로 버튼을 숨깁니다. 페이지 새로고침 시 방문 기록이 초기화됩니다.

# QABoard v1.1.5 — Project / Test Suite navigation and status filters

## Changes
- Project Details → QA progress → linked test cases is now a clickable control opening the Test Case workspace scoped to that project, displaying its Test Suites (including legacy cases when present).
- Test Case workspace defaults to non-completed-project suites; the selector offers **진행 중인 프로젝트** and **완료된 프로젝트**. Project focus can be cleared to view the entire selected status category.
- Bug Management project filter offers the same two categories. This is **project completion status**, independent of the separate bug status view (Open/In Progress vs Resolved/Closed).
- Legacy Test Cases project filter also uses the two project-state options.
- No localStorage schema migration or data deletion. Complete projects and their suites remain accessible through the completed selector.

## Safety
Before deploying, use Settings & Backup → JSON export. Data remains local to the current browser; do not put personal/customer data into the demo.

## Smoke test
1. Project detail linked cases → Test Case workspace focused project
2. Clear project focus → suites for all noncompleted projects
3. Mark project Completed → suite moves to completed filter
4. Bug list: project filter switches active/completed independently of bug status filter
5. Other areas (Runs, Reports, Backup) remain functional

# QABoard v1.1.1 — Test Suite UI 개선

- 기존 **TC 묶음** 명칭을 **Test Suite**로 변경했습니다.
- Test Suite 목록에서 행 전체를 클릭하거나 Enter/Space로 세부 TC를 엽니다.
- 상단 TC 묶음/세부 TC/프로젝트 연결 TC 요약 카드 3개를 제거했습니다.
- TC 데이터 구조 및 이전 Test Run 결과는 변경하지 않았습니다.
- 입력 데이터는 브라우저 로컬 저장소에 남습니다. 업그레이드 전 Settings & Backup에서 JSON 백업을 권장합니다.

# QABoard v1.1.0 — TC 묶음 / 세부 TC 관리

GitHub Pages에서 바로 배포할 수 있는 정적 웹앱입니다.

## 변경 사항
- Workspace의 중복된 `Test Cases` 메뉴 제거, 프로젝트 오버뷰용 `모든 프로젝트` 메뉴 유지
- Projects 목록 선택: `전체 프로젝트 / 진행 중 / 완료된 프로젝트` 및 각 건수 표시
- Test Case 전용 작업공간에서 `+ Add test case`는 **TC 묶음** 생성
- 묶음은 프로젝트를 지정하며, 그 안에서 `+ Add detail TC`로 **세부 TC** 등록
- 세부 TC 작성 시 프로젝트는 읽기 전용으로 고정되고, Test Runs/Reports/Projects에 같은 데이터로 연결
- 기존 단일 TC는 삭제하지 않고 프로젝트별 `기존 TC` 묶음으로 표시
- 기존 버그/테스트 실행/백업 데이터는 보존. 기존 Test Run 결과는 소급 변경하지 않음

## 주의
입력 내용은 브라우저 localStorage에만 저장됩니다. 이전 데이터를 보호하기 위해 **Settings & Backup → Backup JSON**을 먼저 다운로드해 주세요.
실명, 연락처, 고객 주문정보 등의 개인정보를 입력하지 마세요.

## 테스트
1. Demo Workspace → 모든 프로젝트 → 프로젝트 필터에서 각 건수 확인
2. Test Case → + Add test case → TC 묶음 생성 (프로젝트 지정)
3. 묶음 상세 → Add detail TC → 고정된 프로젝트 표시 확인
4. 세부 TC 등록 → 목록에 행 추가, 재수정/최근 결과 변경, 새로고침 확인
5. 기존 케이스 → `기존 TC` 묶음에서 유지 확인
6. Test Runs, Bug Management, Reports, Backup 기능 회귀 확인


## v1.1.2 — TC and Dashboard refinements
- Edit TC ID in detailed TC edit screen. Duplicate IDs are blocked and matching Test Run case references are updated.
- Edit Test Suite name and default settings using `Test Suite 이름 / 정보 수정` in the Suite detail view.
- Detailed TC table has wider columns, taller rows and slightly larger text. Horizontal scrolling is available.
- Dashboard cards now follow the navigation order: 모든 프로젝트, Test Runs, Bug Management, Reports. Each opens its corresponding area.
- Existing localStorage data is not reset. Export JSON via Settings & Backup before upgrading.


## v1.1.3 개선
- Test Case 첫 화면(Test Suite 목록)에만 글씨 크기·행 높이·열 너비 조정; 목록 가로 스크롤 제거 (좁은 화면은 자동 줄바꿈).
- 세부 TC 목록은 v1.1.1의 표 크기로 복원.
- Projects, Test Cases, Test Runs, Bugs, 세부 TC 목록에서 행을 클릭하면 상세 화면 열기.
- 목록 행의 버튼/드롭다운은 기존 동작을 유지하며 키보드 Enter/Space로도 상세 페이지 열기.
- 저장 데이터 구조를 바꾸지 않아 기존 localStorage 데이터 유지.

## v1.1.4 업데이트
- Dashboard의 Project coverage는 Active 프로젝트만 표시합니다.
- Recent test runs는 행을 클릭하여 Test Run 상세로 이동합니다.
- Workspace의 모든 프로젝트 메뉴를 Project로 변경했습니다.
- Bug Management는 진행 중(Open/In Progress)과 완료(Resolved/Closed) 목록을 분리하며 완료된 버그는 별도 선택으로 조회합니다. 삭제하지 않습니다.
- Bug list와 Test Runs에는 프로젝트 이름 및 프로젝트 키를 함께 표시합니다.
- 기존 브라우저 localStorage 키(`qaboard-demo`)는 변경하지 않았습니다.


## v1.1.6 QA workflow update
See `CHANGELOG-v1.1.6.md` for Test Run-derived results, QA retest workflow, Dashboard action queue and backup notes.


## v1.1.7 — Project-centered QA lists
- Test Runs: Active/Review 프로젝트 기본 표시, Completed 프로젝트는 별도 목록
- 사이드바 숫자: Project=미완료 프로젝트, Test Runs=미완료 프로젝트의 실행, Bugs=미완료 프로젝트의 미종결 버그
- Create Bug: 미완료(Active/Review) 프로젝트만 선택 가능, 저장 시에도 검증
- 프로젝트 상태 변경은 Test Run/Bug의 개별 상태를 자동 변경하지 않습니다.
- 기존 `localStorage` 데이터를 보존하며 서버 동기화는 제공하지 않습니다.


## v1.1.9 — Bug/Reports 필터 정리
- Bug Management: 프로젝트 구분(진행 중/완료) + 버그 상태(미종결/Closed)로 관리하며, 검색과 우선순위 필터는 유지합니다.
- Resolved는 QA 재검증이 필요하므로 미종결 버그로 표시합니다.
- Reports: 진행 중/완료 프로젝트 구분 후 각 그룹 전체 또는 개별 프로젝트를 선택해 실행/버그 통계를 확인하고 CSV로 출력할 수 있습니다.
- 기존 qaboard-demo 데이터 및 v1.1.8 이전화면 기록 기능 유지.


## v1.2.0: 전체 Dashboard + GPT 개발 요청서
- Dashboard는 진행 중인 프로젝트(Active / Review) 전체의 테스트·버그 통계만 집계합니다. 프로젝트 선택 드롭다운을 제거했습니다.
- Project coverage는 프로젝트별 상세 화면으로 연결되며, 최근 Test Runs 클릭도 유지합니다.
- Dashboard의 **GPT 개발 요청서 만들기**에서 TC/Bug를 여러 건 선택한 뒤 Markdown 프롬프트를 생성·수정·복사·다운로드할 수 있습니다.
- 요청서는 실제 ChatGPT에 자동으로 제출되지 않습니다. 최신 QABoard ZIP과 함께 전달해야 개발자가 올바른 소스를 고칠 수 있습니다.
- 프롬프트는 입력 기록만 이용하며 누락된 재현 환경과 실제 증상은 임의로 생성하지 않습니다. 1회 최대 30건을 선택할 수 있습니다.
- 보안: 실계정·고객정보·비밀키가 TC나 버그에 들어있다면 요청서에 포함하기 전에 삭제하세요.
