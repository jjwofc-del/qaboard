# QABoard v0.6.0 — Stage 6 Dashboard & Reports

실제 버그와 테스트 실행 데이터로 통계를 만드는 포트폴리오용 정적 QA 관리 웹사이트입니다. v0.5.2 전체 기능을 유지하며 GitHub Pages에서 작동합니다.

## 새 기능
- Dashboard와 Reports에서 전체 프로젝트 또는 한 프로젝트 선택
- 프로젝트별 등록된 테스트 케이스, 신규 Test Run의 Pass/Fail/Blocked/Not Run 집계
- 실행한 케이스 중 Pass 비율 표시. **Pass rate = Pass / (Pass + Fail + Blocked) × 100**, Not Run은 제외
- Open/In Progress/Resolved/Closed 버그 분포 및 프로젝트별 품질 표
- 최근 등록된 신규 Test Run 표시 (기존 허위 시각/정적 activity 제거)
- Reports CSV 내보내기 (로컬에서 생성, CSV 수식 삽입 방어)
- 테스트 실행 기록이 없는 경우 Pass rate는 0%가 아닌 `—`로 표시
- v0.4 이전 샘플 Test Run의 집계 숫자는 케이스별 근거가 없으므로 제외하고 제외 개수를 안내

## 데이터 정책
- 기존 `qaboard-demo` localStorage 키 그대로 사용. 저장 데이터 마이그레이션이나 초기화 없음.
- 서버로 어떠한 데이터도 전송하지 않음. 예시/가상 정보만 입력할 것. GitHub Pages 정적 환경.
- 프로젝트 진행률은 수동 관리값이며 QA 실행 결과와 자동 연결하지 않음.
- 사이드바 건수는 기존 데모 고정값 유지. 후속 UI 정리에서 처리.
- Test Case의 `status` 값과 개별 Test Run 결과를 혼합 집계하지 않음.

## 배포
ZIP 압축 해제 후 `index.html`, `README.md`, `src/` 폴더를 GitHub 저장소 루트에 업로드. `main` 브랜치 GitHub Pages `/(root)` 설정 유지. 커밋: `feat: add data-driven dashboard and QA reports`.

## 수동 검증
1. Dashboard 프로젝트 필터 변경 시 Test Cases / Open Bugs 수 일치
2. Test Runs에서 결과 수정 후 Dashboard와 Reports에 Pass/Fail/Blocked 변화 확인
3. 아직 실행 결과 없는 프로젝트를 선택하면 Pass rate `—` 표시
4. Reports 프로젝트별 집계와 선택 필터 동작 확인
5. CSV 출력 후 엑셀 등에서 열어 프로젝트별 통계 확인
6. 새로고침 후 저장된 결과 및 다른 메뉴 그대로 유지
