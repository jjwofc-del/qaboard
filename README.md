# QABoard v0.4.0 — Test Runs 첫 단계

GitHub Pages에서 실행 가능한 HTML/CSS/JavaScript QA 포트폴리오 데모입니다.

## 이번 릴리즈
- Test Runs 목록에서 `상세 보기`로 실행 정보 확인
- **새 Test Run 생성 시** 선택 프로젝트에 연결된 Test Cases를 스냅샷으로 포함
- 각 케이스에 `Not Run`, `Pass`, `Fail`, `Blocked` 결과 기록
- 결과 집계 및 완료 상태 자동 갱신 (`Not Run`이 없으면 Completed)
- localStorage (`qaboard-demo`) 저장, 새로고침 시 유지
- 기존 프로젝트·테스트 케이스·버그·리포트 화면 그대로 유지

## 주의
- 기존에 저장된 RUN-006 / RUN-007 / RUN-008 같은 **과거 샘플 실행**은 케이스별 결과가 없으므로 상세 화면에서 **읽기 전용 요약**으로 표시. 기존 값은 초기화하거나 가짜 케이스와 연결하지 않습니다.
- 새 실행을 생성하려면 해당 프로젝트에 먼저 Test Case 한 개 이상 연결해야 합니다.
- 실행 생성 시의 케이스 목록을 보존합니다. 이후 Test Case 수정은 기존 실행의 케이스 이름/목록을 바꾸지 않습니다.
- 결과는 `localStorage`에만 저장됩니다. 브라우저/기기 간 동기화 또는 사용자 인증이 없습니다.
- 포트폴리오용 가상 프로젝트와 테스트 데이터만 사용하고, 실제 개인정보·고객정보는 입력하지 마세요.

## 실행 및 업데이트
`index.html`을 브라우저로 열거나 GitHub Pages에 루트 `index.html`, `src/`, `README.md`를 업로드하세요.
커밋 메시지: `feat: record test case results in test runs`
