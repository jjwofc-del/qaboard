# QABoard v0.3.0 — 테스트 케이스 상세 보기·수정

기존 GitHub Pages 정적 사이트(HTML/CSS/JavaScript) 기반을 유지합니다.

## 이번 기능
- Test Cases 표에 **상세 보기** 버튼 추가
- 상세 페이지에서 케이스 제목, ID, Suite, 우선순위, 마지막 결과 확인
- **Edit test case**로 제목, Suite, 우선순위, 사전 조건, 테스트 단계, 예상 결과 수정
- 저장 후 상세 페이지 즉시 반영, 새로고침 시 브라우저 localStorage에서 유지
- **취소**, **Escape**, 목록 돌아가기 기능 유지
- 기존 프로젝트 상세/수정, Dashboard 지표 링크, 버그 등록 및 상태 변경 유지

## GitHub 업로드
ZIP 압축을 푼 뒤 루트의 `index.html`, `README.md`, `src` 폴더를 GitHub 저장소 루트의 동일한 경로로 업로드합니다. `src/app.js`와 `src/styles.css`를 교체하고 `index.html`의 버전 쿼리도 반영해야 합니다.

## 유의 사항
이 사이트는 브라우저에만 저장하는 데모입니다. 실제 고객 정보, 개인정보, 회사 기밀은 입력하지 마세요. 쇼핑몰에 대한 실제 자동화 테스트나 서버 기반 협업은 아직 지원하지 않습니다. 기존 `qaboard-demo` 저장 키를 그대로 사용해 브라우저에 저장된 이전 데이터는 유지됩니다.
