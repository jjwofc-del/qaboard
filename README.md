# QABoard v0.4.2 — Test Runs 목록 결과 요약 개선

## 변경 사항
- Test Run의 **QA RESULT**와 **RUN STATUS**를 목록에서 분리해 표시합니다.
- QA RESULT는 각 실행의 테스트 케이스 결과를 반영합니다: 실패가 하나라도 있으면 Fail, 실패가 없고 Blocked가 있으면 Blocked, 모두 Pass면 Pass, 일부 Pass이고 미실행이 남아 있으면 Partial, 모두 미실행이면 Not Run.
- RUN STATUS는 별개로 In Progress / Completed를 유지합니다. 즉 모든 케이스가 Fail 또는 Blocked로 기록되어도 실행 자체는 Completed일 수 있습니다.
- 기존 케이스별 결과가 없는 샘플 Test Run은 Sample로 표시하고 통계는 보존합니다.
- Test Run 상세 화면에서도 QA 결과를 확인할 수 있습니다.
- 기존 localStorage 키 `qaboard-demo`는 변경하지 않았습니다.

## GitHub 업로드
저장소 루트에 `index.html`, `README.md`, `src/app.js` 파일을 동일 경로로 덮어쓰세요. `src/styles.css`는 변경하지 않았습니다.

## 검증 시나리오
1. 프로젝트에 연결된 테스트 케이스 2개 이상으로 Test Run을 만듭니다.
2. 처음에는 QA RESULT=Not Run, RUN STATUS=In Progress인지 확인합니다.
3. 일부 케이스를 Pass로 변경하면 QA RESULT=Partial인지 확인합니다.
4. 하나를 Fail로 변경하면 QA RESULT=Fail인지 확인합니다.
5. 모두 Pass로 변경하면 QA RESULT=Pass, RUN STATUS=Completed인지 확인합니다.
6. 저장/새로고침 후 값이 보존되는지 확인합니다.
7. 기존 Test Cases / Projects / Bugs 화면이 정상인지 확인합니다.

**데이터 안내:** 가상 데이터만 입력하세요. 브라우저 localStorage에만 저장되고 서버 전송은 없습니다.
