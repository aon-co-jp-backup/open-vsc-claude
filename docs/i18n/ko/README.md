# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

VS Code 확장: 언어·프레임워크 스택을 선택해 생성된 코드를 미리 보고, Claude로 개선해 프로젝트로 저장합니다.

- 라이브 데모: https://easy-web.tokyo/open-vps-claude/
- 소스 코드: https://github.com/aon-co-jp/open-vsc-claude
- 라이선스: MIT

## 기능

- 방식 선택: GraphQL + WunderGraph Cosmo(Node.js·REST 불필요), TypeScript + Node.js + REST, 또는 원하는 구성을 글로 설명.
- 프런트엔드(HTML5+CSS3+JS, 실험적 Rust+Leptos, TypeScript, React), DB(없음 / SQLite / PostgreSQL), 게이트웨이(Cosmo Router / RPoem / 없음), 백엔드(Python+FastAPI, Rust+Poem, Node.js+Express)를 고를 수 있습니다.
- 생성된 모든 파일을 줄 번호와 함께 미리 보고, 복사하거나 에디터에서 열 수 있습니다. 선택을 바꾸면 즉시 갱신됩니다.
- "Claude로 생성/수정"은 요청에 맞춰 프로젝트를 편집합니다(Anthropic API 키 필요).
- 폴더에 저장(덮어쓰기 확인 포함). 브라우저 데모에서는 zip을 내려받을 수 있습니다.
- UI와 주의 사항은 영어·일본어·중국어(간체/번체)·한국어를 지원하며, 수동 설치본은 업데이트 확인을 지원합니다.

## 지원 환경

순수 JavaScript 패키지 하나이며 네이티브 코드는 없습니다.

| 환경 | 사용 방법 |
| --- | --- |
| Windows / macOS / Linux | VS Code 확장(데스크톱) |
| Android (phone, tablet) / iPhone / iPad | 브라우저 VS Code(vscode.dev / github.dev)의 웹 확장, 또는 홈 화면에 추가한 브라우저 데모(PWA, 오프라인 가능) |
| * | 라이브 데모: https://easy-web.tokyo/open-vps-claude/ |

## 사용 방법

1. 명령 팔레트에서 "Open VSC Claude: Open Stack Picker"를 실행합니다.
2. 스택을 선택하면 미리보기가 즉시 갱신됩니다.
3. Claude 생성을 쓰려면 API 키를 불러온("Load Anthropic API Key from a .txt file") 뒤 Ctrl+Enter를 누릅니다.

## 주의 사항

- 생성된 코드는 출발점일 뿐입니다. 운영 사용 전에 검토·테스트·보안 조치를 하십시오. 보증은 없습니다.
- Claude 생성은 선택한 스택, 파일, 요청을 Anthropic API로 전송합니다. 비밀 정보나 개인 정보를 넣지 마십시오.
- API 키, 토큰, SSH 개인 키는 저장소 밖의 로컬 .txt 파일에 보관하고 커밋하거나 채팅에 붙여넣지 마십시오.
- RPoem 게이트웨이는 루트 필드 단위 라우팅만 지원합니다(여러 서브그래프에 걸친 쿼리는 거부). Rust + Leptos는 실험적입니다.
- 5개 언어의 전체 주의 사항은 선택 화면과 확장 README에 표시됩니다.

