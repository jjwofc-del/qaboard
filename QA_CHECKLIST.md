# QABoard v0.7.0 배포 후 점검표

## Stage 7 — 신규 기능

- [ ] Settings & Backup 메뉴가 열린다.
- [ ] Projects, Test Cases, Bugs 사이드바 숫자가 생성/삭제에 따라 변경된다.
- [ ] Settings에서 Backup JSON을 다운로드한다.
- [ ] 백업 파일에 `format`, `version`, `data`와 네 배열이 있다.
- [ ] 신규 데모 데이터를 추가한 후 Restore JSON으로 앞서 저장한 백업을 복원한다.
- [ ] 복원 확인 전에는 기존 데이터가 변하지 않는다.
- [ ] 올바르지 않은 JSON 또는 버전 불일치 백업은 복원되지 않는다.
- [ ] Reset demo 클릭 시 확인창이 뜨고 취소하면 데이터가 유지된다.
- [ ] 백업 후 초기화하면 샘플 데이터로 돌아가고, 복원하면 이전 상태로 돌아온다.
- [ ] 키보드로 메뉴와 주요 버튼을 조작할 수 있고 초점 표시가 보인다.

## 이전 기능 회귀 검사

- [ ] Projects 상세 확인/수정/저장 후 새로고침 유지
- [ ] Test Cases 생성/수정/프로젝트 연결/필터
- [ ] Test Runs 신규 실행/케이스별 Pass/Fail/Blocked 결과/집계
- [ ] Test Runs 목록 QA Result와 Run Status 표시
- [ ] Bugs 등록·수정·검색·필터·이력·삭제·연결 해제
- [ ] Dashboard 프로젝트별 필터·통계
- [ ] Reports CSV 다운로드와 버그/결과 데이터 반영

## 예외·데이터 보호

- [ ] 중요한 기록이 있으면 초기화나 복원 **전에 JSON 백업**한다.
- [ ] 실제 개인정보/고객정보가 입력되거나 ZIP·GitHub에 올라가지 않았는지 확인한다.
- [ ] 다른 브라우저에서는 데이터가 자동으로 공유되지 않는다는 것을 이해한다.
- [ ] 브라우저를 강력 새로고침한 후에도 변경한 데이터가 유지된다.

테스트 실패 시 UI 화면, 동작 순서, 예상/실제 결과만 공유하며 실제 고객 데이터는 공유하지 마세요.


## v1.1.2 checks
- [ ] Edit a detailed TC ID; it appears under the new ID after refreshing.
- [ ] Duplicate TC ID is rejected without losing the current data.
- [ ] Renamed TC ID updates its reference in a previously created Test Run.
- [ ] Test Suite name can be edited from the Suite detail screen.
- [ ] Detailed TC table is wider and easier to read, with horizontal scroll.
- [ ] Dashboard cards appear in the order Projects, Test Runs, Bug Management, Reports and navigate correctly.
