# QABoard v0.5.2 — Stage 5 Bug Management Complete (Demo)

HTML, CSS, vanilla JavaScript로 만든 포트폴리오용 QA/Test/Bug 관리 데모. **업로드된 v0.5.1 코드를 바탕으로 확장했습니다.** GitHub Pages 정적 호스팅에서 동작하며 서버/계정이 없습니다.

## 5단계 구현 기능

- **버그 CRUD:** Create bug(제목, 프로젝트, 우선순위, 가상 담당자, 설명, 재현 단계) / 상세 보기 / Edit bug / 삭제 확인
- **상태 추적:** Open → In Progress → Resolved → Closed (각 상태는 선택 가능); 목록에서 바로 변경하거나 Edit bug로 변경
- **검색·필터:** ID, 제목, 설명, 재현 단계, 가상 담당자 검색; 상태/우선순위/프로젝트 필터 조합
- **Test Run 연결:** Fail 결과에서 기존 버그 또는 새 버그를 연결; Test Run에서 버그 상세 보기/연결 해제; 버그 상세 화면에서 연결된 실행으로 이동
- **변경 이력:** 버그 생성, 상태 변경, 수정 항목, 테스트 연결/해제 내역을 가상 사용자 `QA Tester 01`로 기록; 기존 샘플 기록은 이전 이력이 없어 빈 상태로 시작
- **안전한 삭제:** 확인창 표시; 삭제 시 연결된 실행 결과에서 버그 ID 참조만 해제 (Pass/Fail 결과는 보존)
- **현황:** 실제 버그 수에 따른 버그 목록 카드/프로젝트별 버그 건수 업데이트. **사이드바 숫자는 기존 샘플 고정값이며 추후 UI 개선 대상입니다.**

## 로컬 실행 및 GitHub Pages 배포

`index.html`, `README.md`, `src/app.js`, `src/styles.css`를 저장소 **최상위 동일 경로**에 업로드하고 커밋합니다. `src` 폴더를 중첩하지 않습니다. GitHub Pages 설정은 `main` / `/(root)`을 유지합니다. `index.html`에서 스타일/스크립트 버전을 0.5.2로 변경하여 캐시 영향을 줄였습니다.

추천 커밋: `feat: complete stage 5 bug management`

## 권장 수동 검증

1. Bug Management > Create bug > 가상 데이터 입력 > 저장 > 상세 보기
2. Edit bug > 변경 저장 > 변경 이력 확인 > 새로고침 후 유지
3. 목록에서 상태 변경 및 검색/상태·우선순위·프로젝트 필터 조합
4. Test Cases에서 프로젝트에 케이스 연결 → Test Runs 새 실행 → Fail → 버그 연결 (기존 또는 신규)
5. Bug Management 상세 보기에서 Linked test results > Test Run 상세 이동
6. Test Run의 버그 연결 해제 시 원래 버그와 테스트 결과가 유지되는지 확인
7. 버그 삭제: **취소 동작**, 확인 시 버그만 삭제하고 실패 테스트 결과 유지
8. 기존 Dashboard, Projects, Test Cases, Test Runs, Reports 및 새로고침 동작 확인

## 데이터 및 개인정보 보호

- 기존과 동일한 브라우저 `localStorage` 키 `qaboard-demo` 유지. 기존 브라우저에 저장된 데이터는 자동 초기화하지 않습니다.
- **실명, 전화번호, 이메일, 실제 쇼핑몰 고객 데이터, 주문 내역, 회사 로그, API 키를 입력하지 마세요.** 공개 데모는 인증/접근제어 기능이 없습니다.
- `localStorage`는 해당 브라우저에만 존재하고 다른 기기/브라우저에서는 공유되지 않습니다.
- `localStorage`는 안전한 업무 데이터 저장소나 개인정보 보호 장치가 아닙니다. 상용화에는 서버, DB, 인증, 권한/테넌트 분리, 백업, 보안 검토가 별도로 필요합니다.
- 데모 데이터를 초기화하려면 개발자 도구에서 `localStorage.removeItem('qaboard-demo')` 실행 후 새로고침하세요. **초기화하면 수동으로 입력한 데모 데이터는 삭제됩니다.**

## 자동 검증

`node --check src/app.js` 및 `node test-smoke.cjs`.
테스트 스크립트는 브라우저 DOM 전체를 실행하는 E2E 테스트가 아니라 주요 데이터 로직의 스모크 테스트입니다. 실제 클릭/배포 검증은 배포 후 실시하세요.
