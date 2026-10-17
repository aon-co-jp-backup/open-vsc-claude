# PORTING.md — Open VSC Claude

인수인계 메모: 완료한 것, 남은 것, 함정, 절차.

## 완료

- 확장: 스택 선택, Claude 생성, 자유 입력 모드, 업데이트 확인.
- RPoem 게이트웨이의 서브그래프 중계(별도 저장소 RPoem, 커밋 babc658).
- 브라우저 데모 + PWA를 easy-web.tokyo/open-vps-claude에서 공개.
- 12개 언어 문서.

## 남은 일

- VS Code Marketplace / Open VSX 게시(소유자 계정과 토큰 필요, PUBLISHING.md 참조).
- Cosmo Router 실제 실행(개발 PC에 바이너리도 Docker도 없음).
- 실제 Anthropic API 키로 자유 입력 모드 시험.
- 실제 iPhone, iPad, Android 기기에서 시험.
- 원어민의 번역 검토.

## 함정

- 파일이 CRLF일 수 있어 스크립트 치환이 조용히 실패할 수 있습니다. 에디터 도구를 우선 사용하십시오.
- 셸 heredoc의 이스케이프가 \n을 실제 줄바꿈으로 바꿉니다. 보조 스크립트는 먼저 파일로 작성하십시오.
- 앱 내 브라우저는 Service Worker를 차단합니다. PWA는 헤드리스 Chromium(@vscode/test-web의 playwright)으로 시험하십시오.
- 이력을 다시 쓴 저장소에서는 git pull을 하지 마십시오(메타 저장소 참조).
- 저장소 이름은 open-vsc-claude이며, 소유자가 요청한 데모 경로는 /open-vps-claude입니다.

## 릴리스 절차

1. 테스트 실행(compile, test, test:vscode, test:web).
2. package.json 버전을 올리고 npm run package.
3. .vsix와 .sha256을 포함해 gh release create vX.Y.Z(업데이트 기능이 체크섬을 검증).
4. npm run build:demo 후 webpage/를 VPS에 배포.

