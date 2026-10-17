# CLAUDE.md — Open VSC Claude

이 저장소에서 작업하는 Claude Code 세션을 위한 지침입니다.

## 구성

- src/catalog.ts: 스택 카탈로그와 GraphQL + Cosmo 템플릿. src/restTemplates.ts: REST 템플릿
- src/webview.ts: UI HTML(확장과 브라우저 데모가 공유)
- src/extension.ts: 명령과 확장 호스트 측. src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: GitHub 릴리스 업데이트(SHA-256 검증 포함)
- scripts/: 브라우저 데모, 웹 확장 번들, PWA, 문서 생성 스크립트

## 규칙

1. 비밀 정보(API 키, 토큰, SSH 키)를 출력·로그·커밋하지 않습니다. 저장소 밖의 로컬 .txt에 둡니다.
2. Cosmo 방식은 GraphQL만 사용합니다. 생성물에 REST 엔드포인트나 Node.js 도구를 넣지 않습니다.
3. Webview는 CSP를 지켜야 합니다. 인라인 style 속성 금지(단위 테스트가 검사).
4. 커밋 전에 npm test, npm run test:vscode, npm run test:web을 실행하고 UI 변경은 실제 브라우저에서 확인합니다.
5. 확인한 범위와 확인하지 않은 범위를 명확히 밝힙니다. Cosmo Router 실행이나 Marketplace 게시는 완료 전에는 완료라고 말하지 않습니다.

## 명령

```
npm install
npm run compile          # tsc
npm test                 # unit tests: every selectable combination, webview CSP, notices, updater logic
npm run test:vscode      # real VS Code (set VSCODE_EXE to Code.exe / code)
npm run test:web         # browser VS Code (web extension) through @vscode/test-web
npm run build:demo       # webpage/ : browser demo + PWA
npm run package          # .vsix
node scripts/gen-docs.js # regenerate these documents
```

## 상태

- 확인됨: 단위 테스트(129가지 조합), 실제 VS Code, 브라우저 VS Code(웹 확장), 체크섬 검증 업데이트, RPoem 중계, 브라우저 데모와 오프라인 PWA.
- 미확인: Cosmo Router 실행, 실제 키로 Claude 생성, 실제 iPhone/iPad/Android 기기, Marketplace 게시.

