# CLAUDE.md — Open VSC Claude

供在本仓库工作的 Claude Code 会话使用的说明。

## 结构

- src/catalog.ts：技术栈目录和 GraphQL + Cosmo 模板；src/restTemplates.ts：REST 模板
- src/webview.ts：界面 HTML，扩展与浏览器演示共用
- src/extension.ts：命令与扩展宿主端；src/claude.ts：Anthropic API
- src/update.ts + updateLogic.ts：GitHub 发行版更新（含 SHA-256 校验）
- scripts/：浏览器演示、Web 扩展包、PWA 与文档生成脚本

## 规则

1. 切勿显示、记录或提交机密（API 密钥、令牌、SSH 密钥）；它们保存在仓库之外的本地 .txt 中。
2. Cosmo 方式仅使用 GraphQL：生成的项目中没有 REST 端点，也没有 Node.js 工具。
3. Webview 必须符合 CSP：禁止内联 style 属性（单元测试会检查）。
4. 每次提交前运行 npm test、npm run test:vscode、npm run test:web，并在真实浏览器中验证界面改动。
5. 明确说明已验证和未验证的内容；在完成之前，不要声称已运行 Cosmo Router 或已发布到 Marketplace。

## 命令

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

## 状态

- 已验证：单元测试（129 种组合）、真实 VS Code、浏览器版 VS Code（Web 扩展）、带校验和的更新、RPoem 转发、浏览器演示与离线 PWA。
- 未验证：运行 Cosmo Router、使用真实密钥的 Claude 生成、真实 iPhone/iPad/Android 设备、Marketplace 发布。

