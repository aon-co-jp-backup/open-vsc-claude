# CLAUDE.md — Open VSC Claude

供在此儲存庫工作的 Claude Code 工作階段使用的說明。

## 結構

- src/catalog.ts：技術堆疊目錄與 GraphQL + Cosmo 範本；src/restTemplates.ts：REST 範本
- src/webview.ts：介面 HTML，擴充功能與瀏覽器示範共用
- src/extension.ts：命令與擴充功能主機端；src/claude.ts：Anthropic API
- src/update.ts + updateLogic.ts：GitHub 發行版更新（含 SHA-256 驗證）
- scripts/：瀏覽器示範、Web 擴充功能套件、PWA 與文件產生腳本

## 規則

1. 切勿顯示、記錄或提交機密（API 金鑰、權杖、SSH 金鑰）；它們存放於儲存庫之外的本機 .txt。
2. Cosmo 方式僅使用 GraphQL：產生的專案中沒有 REST 端點，也沒有 Node.js 工具。
3. Webview 必須符合 CSP：禁止內嵌 style 屬性（單元測試會檢查）。
4. 每次提交前執行 npm test、npm run test:vscode、npm run test:web，並在真實瀏覽器中驗證介面變更。
5. 明確說明已驗證與未驗證的內容；在完成之前，不要宣稱已執行 Cosmo Router 或已發布到 Marketplace。

## 指令

```
npm install
npm run compile          # tsc
npm test                 # unit tests: every selectable combination, webview CSP, notices, updater logic
npm run test:vscode      # real VS Code (set VSCODE_EXE to Code.exe / code)
npm run test:web         # browser VS Code (web extension) through @vscode/test-web
npm run test:leptos      # generated Rust + Leptos (trunk) frontend in real Chromium: direct and through the RPoem gateway (needs Rust, trunk, Python)
npm run build:demo       # webpage/ : browser demo + PWA
npm run package          # .vsix
node scripts/gen-docs.js # regenerate these documents
```

## 狀態

- 已驗證：單元測試（129 種組合）、真實 VS Code、瀏覽器版 VS Code（Web 擴充功能）、附檢查碼的更新、RPoem 轉送、瀏覽器示範與離線 PWA。
- 未驗證：執行 Cosmo Router、以真實金鑰進行 Claude 產生、真實 iPhone/iPad/Android 裝置、Marketplace 發布。

