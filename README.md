# QABoard v0.2.1 — interaction hotfix

GitHub Pages에서 작동하는 정적 HTML/CSS/JS 데모입니다. 서버 로그인과 개인정보 수집은 없습니다.

## 변경 내용
- 프로젝트 목록의 **상세 보기** 버튼을 눌러 상세 화면 열기 → **Edit project**로 이름, 릴리즈, 상태, 진행률 수정
- `New project`, `Create bug`, `Add test case`, `Create test run`, `Edit project` 모달의 **취소** 버튼 작동 수정 (Escape 키도 지원)
- Dashboard 요약 카드 클릭: 전체 테스트 → Test Cases, Pass rate → Pass 필터, Open bugs → 열린 버그 필터, Active projects → 진행 중 프로젝트 목록
- 기존 메뉴 및 브라우저 `localStorage` 저장 유지
- `index.html`에서 버전 쿼리를 추가해 배포 후 오래된 JS/CSS 캐시 문제 완화

## GitHub 웹사이트 업로드
압축을 푼 다음 `index.html`, `README.md`, `src/app.js`, `src/styles.css`를 저장소 루트의 동일한 경로에 덮어쓰세요. ZIP 파일 자체를 올리지 마세요.

## 참고
데모 데이터는 해당 브라우저의 localStorage에 저장됩니다. 실제 개인정보, 회사 데이터 및 고객 정보를 입력하지 마세요.
