# QABoard v0.4.1 — Test Run 결과 변경 오류 수정

## 변경 사항
- Test Runs 상세 화면의 `Change Result` 드롭다운을 클릭할 때 Test Cases 상세 화면으로 잘못 이동하던 오류를 수정했습니다.
- 원인: 클릭 이벤트 처리기가 `data-case-id` 속성을 가진 모든 요소를 테스트 케이스 상세 버튼으로 취급했습니다. Test Run의 `select`에도 같은 속성이 있어 잘못 이동했습니다.
- 수정: 테스트 케이스 상세 화면 이동 이벤트는 `button[data-case-id]`에만 반응하도록 제한했습니다.
- GitHub Pages에서 기존 JavaScript 캐시를 피하도록 `index.html`의 스크립트 버전을 `0.4.1`로 변경했습니다.

## 업로드
기존 저장소 루트에 `index.html`, `README.md`, `src/app.js`를 같은 경로로 덮어쓰기합니다. `src/styles.css`는 변경하지 않았습니다.

## 배포 확인
1. Test Runs에서 신규 실행의 상세 보기로 이동합니다.
2. Change Result 드롭다운을 클릭해도 Test Runs 상세 화면에 남아 있어야 합니다.
3. Pass, Fail, Blocked 중 하나로 바꾸면 결과와 집계가 갱신되어야 합니다.
4. 새로고침 후 결과가 보존되는지 확인합니다.
5. Test Cases에서 기존 `상세 보기 →` 버튼이 여전히 작동하는지 확인합니다.

데모 데이터는 현재 브라우저의 localStorage에만 저장됩니다. 실제 개인정보를 입력하지 마세요.
