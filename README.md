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
