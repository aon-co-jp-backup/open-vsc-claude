# CLAUDE.md — Open VSC Claude

このリポジトリで作業する Claude Code セッション向けの指示です。

## 構成

- src/catalog.ts: スタックのカタログと GraphQL + Cosmo テンプレート。src/restTemplates.ts: REST テンプレート
- src/webview.ts: UI の HTML(拡張とブラウザデモで共有)
- src/extension.ts: コマンドと拡張ホスト側。src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: GitHub リリースの更新(SHA-256 検証つき)
- scripts/: ブラウザデモ・Web 拡張バンドル・PWA・ドキュメントの生成

## ルール

1. 秘密情報(API キー・トークン・SSH 鍵)を表示・ログ出力・コミットしない。リポジトリ外のローカル .txt に置く。
2. Cosmo 方式は GraphQL のみ。生成物に REST エンドポイントや Node.js のツールを入れない。
3. Webview は CSP に適合させる。インライン style 属性は禁止(単体テストで検査)。
4. コミット前に npm test・npm run test:vscode・npm run test:web を実行し、UI の変更は実ブラウザで確認する。
5. 確認した範囲としていない範囲を明記する。Cosmo Router の実行や Marketplace 公開は、実施するまで「完了」と言わない。

## コマンド

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

## 状況

- 確認済み: 単体テスト(129 通り)、実際の VS Code、ブラウザ版 VS Code(Web 拡張)、チェックサム付き更新、RPoem の中継、ブラウザデモとオフライン PWA。
- 未確認: Cosmo Router の実行、実際のキーでの Claude 生成、実機の iPhone/iPad/Android、Marketplace 公開。


---

# CLAUDE.md — Open VSC Claude

Instructions for Claude Code sessions working on this repository.

## Layout

- src/catalog.ts: stack catalog and GraphQL + Cosmo templates; src/restTemplates.ts: REST templates
- src/webview.ts: the UI HTML, shared by the extension and the browser demo
- src/extension.ts: commands and the extension host side; src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: GitHub release updater with SHA-256 check
- scripts/: browser demo, web-extension bundle, PWA and docs builders

## Rules

1. Never print, log or commit secrets (API keys, tokens, SSH keys); they live in local .txt files outside the repository.
2. The Cosmo style is GraphQL only: no REST endpoints and no Node.js tooling in generated projects.
3. The webview must stay CSP-safe: no inline style attributes (a unit test enforces it).
4. Run npm test, npm run test:vscode and npm run test:web before every commit; verify UI changes in a real browser.
5. State clearly what was and was not verified; do not claim the Cosmo Router run or the Marketplace publication until they are done.

## Commands

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

## Status

- Verified: unit tests (129 combinations), real VS Code, browser VS Code (web extension), updater with checksum, RPoem forwarding, browser demo and offline PWA.
- Not verified: running the Cosmo Router, Claude generation with a real key, real iPhone/iPad/Android devices, Marketplace publication.

