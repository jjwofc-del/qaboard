# QABoard v0.5.0 — Bug Management (1차)

## 업데이트
- Bug Management 목록에 **상세 보기** 버튼 추가
- 버그의 제목/프로젝트/우선순위/상태/담당자 확인
- Edit bug: 기존 버그 정보 수정과 선택형 가상 담당자 지정
- 설명과 재현 단계 추가 (선택), 수정 후 새로고침에도 유지
- 기존 `localStorage` 저장 키 `qaboard-demo` 유지. 기존 버그 데이터에 새 설명 필드가 없어도 동작
- 기존의 목록 상태 변경, 프로젝트, 케이스, 테스트 실행, 통계 기능 유지

## GitHub 업로드
저장소 최상위에 `index.html`, `README.md`, `src/app.js`를 같은 경로로 덮어쓰세요. `src/styles.css`는 변경하지 않았습니다.

커밋 메시지: `feat: add bug details and editing`

## 테스트
1. Bug Management → 상세 보기에서 버그 정보 확인
2. Edit bug에서 제목·프로젝트·우선순위·상태·가상 담당자 변경
3. 설명 및 재현 단계 저장
4. 취소 버튼을 누르면 변경하지 않고 닫힘
5. 저장 후 Bug Management 목록에 변경 내용 표시
6. 새로고침 후 변경 내용 유지
7. 기존 Projects / Test Cases / Test Runs / Dashboard 동작 확인

## 개인정보 안내
이 앱은 포트폴리오용 단일 브라우저 데모입니다. 계정이나 서버가 없으며 `localStorage`에 저장합니다. 실명/이메일/전화번호/고객정보/실서비스 로그 등을 넣지 마세요. 공개 GitHub Pages 배포는 인증/접근제어가 없습니다.
