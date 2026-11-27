> Latest translations / 翻訳の最新版: [0-LATEST-TRANSLATIONS.md](0-LATEST-TRANSLATIONS.md)

# Open VSC Claude

[English](README.md) · [日本語](docs/i18n/ja/README.md) · [简体中文](docs/i18n/zh-CN/README.md) · [繁體中文（台灣）](docs/i18n/zh-TW/README.md) · [한국어](docs/i18n/ko/README.md) · [Русский](docs/i18n/ru/README.md) · [Українська](docs/i18n/uk/README.md) · [Deutsch](docs/i18n/de/README.md) · [Italiano](docs/i18n/it/README.md) · [Français](docs/i18n/fr/README.md) · [العربية](docs/i18n/ar/README.md) · [فارسی](docs/i18n/fa/README.md)

A VS Code extension: pick a language/framework stack, preview the generated code, refine it with Claude and save it as a project.

- Live demo: https://easy-web.tokyo/open-vps-claude/
- Source code: https://github.com/aon-co-jp/open-vsc-claude
- License: MIT

## Features

- Pick a style: GraphQL + WunderGraph Cosmo (no Node.js, no REST), TypeScript + Node.js + REST, or describe any stack in your own words.
- Choose the frontend (HTML5+CSS3+JS, experimental Rust+Leptos, TypeScript, React), database (none / SQLite / PostgreSQL), gateway (Cosmo Router / RPoem / none) and backend (Python+FastAPI, Rust+Poem, Node.js+Express).
- Preview every generated file with line numbers; copy it or open it in an editor. Changing a selection updates the preview instantly.
- "Generate / refine with Claude" edits the project from your request (an Anthropic API key is required).
- Save to a folder (with overwrite confirmation) or, in the browser demo, download a zip.
- UI and notices in English, Japanese, Chinese (Simplified / Traditional) and Korean; update check for sideloaded installs.

## Supported platforms

One pure-JavaScript package, no native code.

| Platform | How to use |
| --- | --- |
| Windows / macOS / Linux | VS Code extension (desktop) |
| Android (phone, tablet) / iPhone / iPad | VS Code in the browser (vscode.dev / github.dev) with the web extension, or the browser demo added to the home screen (PWA, works offline) |
| Any modern browser | Live demo: https://easy-web.tokyo/open-vps-claude/ |

## Usage

1. Run "Open VSC Claude: Open Stack Picker" from the Command Palette.
2. Choose the stack; the preview updates immediately.
3. For Claude generation, load your API key ("Load Anthropic API Key from a .txt file") and press Ctrl+Enter.

## Notices

- Generated code is a starting point; review, test and secure it before production use. No warranty.
- Claude generation sends the selected stack, files and your request to the Anthropic API; keep secrets and personal data out of them.
- API keys, tokens and SSH private keys: keep them in a local .txt file outside any repository; never commit them or paste them into chat.
- The RPoem gateway routes by root field only (queries mixing subgraphs are rejected); Rust + Leptos is experimental.
- The full notices in five languages are shown in the picker and in the extension README.

<!-- notices-in-5-languages -->
<details><summary>English — Notices</summary>

- Generated code is a starting point. Review, test and secure it before any production use; no warranty is given.
- "Generate with Claude" sends the selected stack, the current files and your request to the Anthropic API. Do not put secrets or personal data in the files or the request.
- Your Anthropic API key is stored in VS Code SecretStorage on this machine only. Never commit keys, passwords or private SSH keys to a repository.
- API usage is billed to your own Anthropic account.
- Experimental: Rust + Leptos frontend, RPoem gateway (root-field routing only; queries mixing several subgraphs are rejected). Cosmo Router config is pre-composed; re-run "wgc router compose" after changing the GraphQL schema.
- Files are written only to the folder you choose; existing files with the same name are overwritten.
- VPS / rental-server automatic read-write keys (SSH private and public keys): save them on a local drive as <file name>.txt (outside any repository) and tell Claude Code to read that file. Because Claude reads it, its contents are sent to the Anthropic API — use a dedicated, least-privilege key you can revoke, and never paste key contents into chat or commit the file.
- Creating a GitHub token (for pushing from Claude Code): GitHub → profile icon → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token (https://github.com/settings/personal-access-tokens/new). Set a short expiration, choose "Only select repositories" and pick just the repository, then under Repository permissions set Contents = Read and write (Metadata stays Read-only). Click Generate, copy the token (shown only once), save it as <file name>.txt outside the repository, and never paste it into chat. Revoke it on the same page when no longer needed.
- Anthropic API key (needed for "Generate with Claude"): create it in the Claude Console (https://console.anthropic.com/settings/keys → Create Key), copy it once, and save it as <file name>.txt on a local drive, outside any repository, with the key alone on the first line. Then run "Open VSC Claude: Load Anthropic API Key from a .txt file" (or the "load key from txt" button) and pick that file: the key moves into VS Code SecretStorage and the file is not modified. Delete or revoke the key when no longer needed.

</details>

<details><summary>日本語 — 注意書き</summary>

- 生成されるコードは出発点です。本番利用の前に、必ず確認・テスト・セキュリティ対策を行ってください。動作の保証はありません。
- 「Claude で生成・改変」は、選択したスタック・現在のファイル・要望を Anthropic API へ送信します。秘密情報や個人情報をファイルや要望に含めないでください。
- Anthropic API キーは、この PC の VS Code SecretStorage にのみ保存されます。キー・パスワード・SSH 秘密鍵をリポジトリへコミットしないでください。
- API の利用料金は、ご自身の Anthropic アカウントに請求されます。
- 実験的機能: Rust + Leptos フロント、RPoem ゲートウェイ(ルートフィールド単位の振り分けのみ。複数サブグラフにまたがるクエリは拒否)。Cosmo Router の設定は事前生成済みです。GraphQL スキーマを変更したら「wgc router compose」を再実行してください。
- ファイルは選択したフォルダにのみ書き込まれ、同名の既存ファイルは上書きされます。
- VPS(レンタルサーバー)の自動読み書き用の秘密鍵・公開鍵は、ローカルドライブに「ファイル名.txt」として保存し(リポジトリの外に置く)、CLAUDE にそのファイルを読ませてください。CLAUDE が読むと内容が Anthropic API に送信されるため、取り消し可能で権限を最小にした専用の鍵を使い、鍵の内容をチャットに貼ったりファイルをコミットしたりしないでください。
- GitHub トークンの作り方(Claude Code から push する場合): GitHub → 右上のアイコン → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token(https://github.com/settings/personal-access-tokens/new)。有効期限は短めにし、「Only select repositories」で対象リポジトリだけを選び、Repository permissions の Contents を「Read and write」にします(Metadata は Read-only のまま)。Generate token を押し、表示されたトークン(一度しか表示されません)をコピーして、リポジトリの外に「ファイル名.txt」として保存してください。チャットには貼らないでください。不要になったら同じ画面で失効させます。
- Anthropic API キー(「Claude で生成・改変」に必要): Claude Console(https://console.anthropic.com/settings/keys → Create Key)で作成し、一度だけ表示されるキーをコピーして、リポジトリの外のローカルドライブに「ファイル名.txt」として保存します(1行目にキーだけを書く)。その後「Open VSC Claude: Load Anthropic API Key from a .txt file」(または画面の「キーを txt から読込」ボタン)でそのファイルを選ぶと、キーが VS Code の SecretStorage に移り、ファイル自体は変更されません。不要になったらファイルを削除し、キーを失効させてください。

</details>

<details><summary>简体中文 — 注意事项</summary>

- 生成的代码仅作为起点。用于生产环境前，请务必审查、测试并做好安全加固；不提供任何担保。
- “使用 Claude 生成/修改”会把所选技术栈、当前文件和您的需求发送到 Anthropic API。请勿在文件或需求中包含机密信息或个人数据。
- Anthropic API 密钥仅保存在本机的 VS Code SecretStorage 中。切勿将密钥、密码或 SSH 私钥提交到代码仓库。
- API 使用费用由您自己的 Anthropic 账户承担。
- 实验性功能：Rust + Leptos 前端、RPoem 网关（仅按根字段路由，跨多个子图的查询会被拒绝）。Cosmo Router 配置已预先生成；修改 GraphQL 模式后请重新运行“wgc router compose”。
- 文件只会写入您选择的文件夹，同名的现有文件将被覆盖。
- VPS（租用服务器）自动读写所用的 SSH 私钥和公钥：请以“文件名.txt”保存到本地磁盘（放在任何代码仓库之外），并让 Claude 读取该文件。由于 Claude 会读取其内容，内容将发送至 Anthropic API——请使用可随时吊销、权限最小的专用密钥，切勿把密钥内容粘贴到聊天中或提交该文件。
- 创建 GitHub 令牌（用于从 Claude Code 推送）：GitHub → 右上角头像 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token（https://github.com/settings/personal-access-tokens/new）。设置较短的有效期，选择“Only select repositories”并仅选中目标仓库，在 Repository permissions 中将 Contents 设为“Read and write”（Metadata 保持只读）。点击 Generate token，复制令牌（仅显示一次），以“文件名.txt”保存到仓库之外，切勿粘贴到聊天中。不再需要时在同一页面吊销。
- Anthropic API 密钥（“使用 Claude 生成/修改”所需）：在 Claude Console（https://console.anthropic.com/settings/keys → Create Key）创建，复制仅显示一次的密钥，以“文件名.txt”保存到仓库之外的本地磁盘（第一行只写密钥）。然后运行“Open VSC Claude: Load Anthropic API Key from a .txt file”（或界面中的“从 txt 读取密钥”按钮）并选择该文件：密钥会存入 VS Code SecretStorage，文件本身不会被修改。不再需要时请删除文件并吊销密钥。

</details>

<details><summary>繁體中文（台灣） — 注意事項</summary>

- 產生的程式碼僅作為起點。用於正式環境前，請務必審查、測試並做好安全強化；不提供任何保證。
- 「使用 Claude 產生/修改」會將所選技術堆疊、目前檔案與您的需求傳送至 Anthropic API。請勿在檔案或需求中包含機密資訊或個人資料。
- Anthropic API 金鑰僅儲存於本機的 VS Code SecretStorage。切勿將金鑰、密碼或 SSH 私密金鑰提交至程式碼儲存庫。
- API 使用費用由您自己的 Anthropic 帳戶負擔。
- 實驗性功能：Rust + Leptos 前端、RPoem 閘道（僅依根欄位路由，跨多個子圖的查詢會被拒絕）。Cosmo Router 設定已預先產生；變更 GraphQL 結構描述後請重新執行「wgc router compose」。
- 檔案只會寫入您選擇的資料夾，同名的既有檔案將被覆寫。
- VPS（租用伺服器）自動讀寫所用的 SSH 私密金鑰與公開金鑰：請以「檔名.txt」儲存於本機磁碟（置於任何程式碼儲存庫之外），並讓 Claude 讀取該檔案。由於 Claude 會讀取其內容，內容將傳送至 Anthropic API——請使用可隨時撤銷、權限最小的專用金鑰，切勿將金鑰內容貼到聊天中或提交該檔案。
- 建立 GitHub 權杖（用於從 Claude Code 推送）：GitHub → 右上角大頭貼 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token（https://github.com/settings/personal-access-tokens/new）。設定較短的有效期限，選擇「Only select repositories」並僅選取目標儲存庫，在 Repository permissions 將 Contents 設為「Read and write」（Metadata 維持唯讀）。按下 Generate token，複製權杖（僅顯示一次），以「檔名.txt」儲存於儲存庫之外，切勿貼到聊天中。不再需要時於同一頁面撤銷。
- Anthropic API 金鑰（「使用 Claude 產生/修改」所需）：於 Claude Console（https://console.anthropic.com/settings/keys → Create Key）建立，複製僅顯示一次的金鑰，以「檔名.txt」儲存於儲存庫之外的本機磁碟（第一行只寫金鑰）。接著執行「Open VSC Claude: Load Anthropic API Key from a .txt file」（或介面中的「從 txt 讀取金鑰」按鈕）並選擇該檔案：金鑰會存入 VS Code SecretStorage，檔案本身不會被修改。不再需要時請刪除檔案並撤銷金鑰。

</details>

<details><summary>한국어 — 주의 사항</summary>

- 생성된 코드는 출발점일 뿐입니다. 운영 환경에 사용하기 전에 반드시 검토, 테스트 및 보안 조치를 하십시오. 어떠한 보증도 제공되지 않습니다.
- "Claude로 생성/수정"은 선택한 스택, 현재 파일, 요청 내용을 Anthropic API로 전송합니다. 파일이나 요청에 비밀 정보나 개인 정보를 포함하지 마십시오.
- Anthropic API 키는 이 PC의 VS Code SecretStorage에만 저장됩니다. 키, 비밀번호, SSH 개인 키를 저장소에 커밋하지 마십시오.
- API 사용 요금은 본인의 Anthropic 계정으로 청구됩니다.
- 실험적 기능: Rust + Leptos 프런트엔드, RPoem 게이트웨이(루트 필드 단위 라우팅만 지원하며 여러 서브그래프에 걸친 쿼리는 거부됨). Cosmo Router 설정은 사전 생성되어 있으며, GraphQL 스키마를 변경하면 "wgc router compose"를 다시 실행하십시오.
- 파일은 선택한 폴더에만 기록되며, 같은 이름의 기존 파일은 덮어씁니다.
- VPS(임대 서버) 자동 읽기/쓰기용 SSH 개인 키와 공개 키는 로컬 드라이브에 "파일이름.txt"로 저장하고(저장소 밖에 두기) Claude가 해당 파일을 읽도록 하십시오. Claude가 읽으면 내용이 Anthropic API로 전송되므로, 폐기 가능하고 권한이 최소인 전용 키를 사용하고 키 내용을 채팅에 붙여넣거나 파일을 커밋하지 마십시오.
- GitHub 토큰 만들기(Claude Code에서 push할 때): GitHub → 오른쪽 위 프로필 아이콘 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token(https://github.com/settings/personal-access-tokens/new). 만료 기간을 짧게 설정하고 "Only select repositories"에서 대상 저장소만 선택한 뒤, Repository permissions의 Contents를 "Read and write"로 설정합니다(Metadata는 읽기 전용 유지). Generate token을 누르고 표시된 토큰(한 번만 표시됨)을 복사해 저장소 밖에 "파일이름.txt"로 저장하십시오. 채팅에 붙여넣지 마십시오. 더 이상 필요 없으면 같은 화면에서 폐기하십시오.
- Anthropic API 키("Claude로 생성/수정"에 필요): Claude Console(https://console.anthropic.com/settings/keys → Create Key)에서 만들고, 한 번만 표시되는 키를 복사해 저장소 밖의 로컬 드라이브에 "파일이름.txt"로 저장하십시오(첫 줄에 키만 작성). 그런 다음 "Open VSC Claude: Load Anthropic API Key from a .txt file"(또는 화면의 "txt에서 키 불러오기" 버튼)을 실행해 그 파일을 선택하면 키가 VS Code SecretStorage로 옮겨지며 파일 자체는 변경되지 않습니다. 필요 없어지면 파일을 삭제하고 키를 폐기하십시오.

</details>

## Development

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

See [PUBLISHING.md](PUBLISHING.md) for Marketplace / Open VSX publication and [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the host matrix (VS Code 1.85+, VSCodium, web, browser demo) and the host contract.


---

## 🔁 お引越し・再開用メッセージ / Resume message (2026-10-18)

**日本語(次のセッションの Claude へ)**
1. まず `F:\dream-os\vsc\BUILD-REPORT.md` を読む。DreamOS Code(Code-OSS 1.142.0、WSL2 の Ubuntu で `build.sh`)は、**node・clone・`npm ci` が完了し、`gulp vscode-linux-x64-min` も compile / bundle / minify / `package-linux-x64` まで成功**している(出力は `~/dream-vsc/VSCode-linux-x64`)。ただし**最後の工程 `prepareBuiltInCopilotRipgrepShim` が「Copilot SDK directory not found」で失敗**して終わっており、原因は**未調査**(調べ始めた `vsc/inspect.sh` の結果は未取得)。**`open-vsc-claude` の同梱・`verify.sh` は未実行なので「ビルドできた」とはまだ言えない**。
2. 次の手: (a) `wsl -d Ubuntu -- bash /mnt/f/dream-os/vsc/inspect.sh`(PowerShell)で、`build/gulpfile.vscode.ts` の Copilot 関連の配線と `extensions/copilot/node_modules/@github/copilot` の有無を確認、(b) DreamOS Code は GitHub Copilot を同梱する必要が無いので、Copilot の組み込みと最終工程を外す(`build.sh` の `package` 段階の前にソースを調整、または失敗後の出力をそのまま使う)方針を、**原因を確かめてから**選ぶ、(c) `build.sh` の bundle 段階(拡張同梱・`product-overlay.json`)→ `verify.sh`(Xvfb が要るなら `wsl -u root apt-get install -y xvfb`)、(d) 結果を `BUILD-REPORT.md` に正直に書いて `vsc/` をコミット。`-ci` 系タスクは事前工程が前提で単独では失敗する(`vscode-linux-x64-min` を使う、修正済み)。
3. `open-vsc-claude` は v0.1.2 を公開済み(`F:\open-vsc-claude`、デモ `https://easy-web.tokyo/open-vps-claude/`、テスト 4 種が通る、VS Code 1.85 / VSCodium 1.140 / Web 拡張ホストで確認)。**未了**: Marketplace / Open VSX 公開(所有者のアカウントとトークンが必要。手順は `PUBLISHING.md`)、Cosmo Router の実起動、実キーでの Claude 生成、実機 iOS/Android、翻訳のネイティブ確認。RPoem の外部サブグラフ中継は `babc658` で反映済み。 Leptos(trunk)テンプレートは `npm run test:leptos` で自動テスト済み(直接・RPoem経由とも成功)。RPoem 本体への Leptos 取り込みは**非推奨**と評価(`RPoem/docs/leptos-evaluation.md`、所有者への確認事項あり)。
4. 秘密(トークン・API キー)はリポジトリに入れない。`F:\` 直下の txt に置き、値を画面・コミットに出さない。
5. 落とし穴: Git Bash は `/mnt/...` を書き換える(PowerShell を使う)、PowerShell の引用符内の `|` や `$変数` は WSL に渡る前に解釈される(処理は `.sh` に書く)、シェルの heredoc で python に `\n` を渡すと本物の改行になる(補助スクリプトは先にファイルへ)、CRLF のファイルは置換が静かに失敗する(Edit ツールを使う)、書き換え済みリポジトリで `git pull` しない。

**English (for the next Claude session)**
1. Read `F:\dream-os\vsc\BUILD-REPORT.md` first. DreamOS Code (Code-OSS 1.142.0, `build.sh` in WSL2 Ubuntu): **node, clone and `npm ci` are done, and `gulp vscode-linux-x64-min` got through compile / bundle / minify / `package-linux-x64`** (output in `~/dream-vsc/VSCode-linux-x64`). But the **last step `prepareBuiltInCopilotRipgrepShim` failed with "Copilot SDK directory not found"**, and the cause is **not investigated yet** (the result of `vsc/inspect.sh`, started to look into it, was never read). **Bundling `open-vsc-claude` and `verify.sh` have not run, so do not claim it builds yet.**
2. Next: (a) from PowerShell run `wsl -d Ubuntu -- bash /mnt/f/dream-os/vsc/inspect.sh` to see how `build/gulpfile.vscode.ts` wires Copilot and whether `extensions/copilot/node_modules/@github/copilot` exists, (b) DreamOS Code has no need to ship GitHub Copilot, so choose — **after confirming the cause** — to drop the built-in Copilot and that final step (adjust the source before the `package` stage in `build.sh`, or reuse the already packaged output), (c) run `build.sh`'s bundle stage (extension + `product-overlay.json`), then `verify.sh` (if Xvfb is missing: `wsl -u root apt-get install -y xvfb`), (d) record the real result in `BUILD-REPORT.md` and commit `vsc/`. The `-ci` tasks assume earlier stages and fail alone (use `vscode-linux-x64-min`; already fixed).
3. `open-vsc-claude` v0.1.2 is released (`F:\open-vsc-claude`, demo `https://easy-web.tokyo/open-vps-claude/`, all four test suites pass; verified on VS Code 1.85, VSCodium 1.140 and the web extension host). **Open**: Marketplace / Open VSX publication (owner account + token; see `PUBLISHING.md`), running the Cosmo Router, Claude generation with a real key, real iOS/Android devices, native review of translations. RPoem's external-subgraph forwarding is in (`babc658`). The Leptos (trunk) template is covered by `npm run test:leptos` (direct and through RPoem both pass). Adopting Leptos inside RPoem itself is **not recommended** (`RPoem/docs/leptos-evaluation.md`; open question for the owner).
4. Never put secrets (tokens, API keys) in repositories; keep them in txt files at the root of `F:\` and never print or commit their values.
5. Pitfalls: Git Bash rewrites `/mnt/...` (use PowerShell); `|` and `$vars` inside quoted PowerShell strings are interpreted before reaching WSL (put logic in a `.sh`); escapes in shell heredocs turn `\n` into real newlines (write helper scripts to files first); CRLF files make scripted replacement fail silently (use the Edit tool); never `git pull` in rewritten repositories.

## API 方針: REST 全廃・gRPC / Connect へ (2026-11-04)

### 日本語
- **REST は全廃する。新しい API は REST で作らない。** ブラウザや `curl` から呼ぶ API は **Connect の単純呼び出し**(`POST /<パッケージ>.<Service>/<Method>`、`content-type: application/json`、本文は JSON)、サービス間は **gRPC / gRPC-web**(RPoem の管理API `open_runo.admin.v1.Admin` と同じ流儀)。ストリーミングは、必要になってから。
- **既存の REST は、触るときに順に移す。** 移したら旧 REST の経路は消す。移行が終わるまで残るが、**新規には追加しない**。
- **JSON は RS-JSON に統一**する(読み込みは `from_str_secure` / `parse_secure` でサイズ・深さ・重複キーの上限つき、書き出しは `rust_json::fast`)。ブラウザの WASM に `prost` は入れない(サイズが増えるため)。
- **例外(自分たちの API ではなく、相手の規格が決めているもの)**: ACME、OAuth/OIDC のコールバック、第三者(GitHub など)からの Webhook、ヘルスチェック、静的ファイル配信、OTLP など。これらは規格どおりの HTTP を受ける。
- 参考実装: `RPoem`(`open_runo.admin.v1.Admin`)、`open-easy-web`(`server/src/connect.rs`、`proto/open_easy_web/admin/v1/admin.proto`)。
- ※ このリポジトリのコードが既に方針どおりかどうかは、各リポジトリの現状による。この節は方針の記録であり、コードの変更を意味しない。

### English
- **REST is being abolished. New APIs are not built as REST.** APIs called from browsers or `curl` use **Connect unary calls** (`POST /<package>.<Service>/<Method>`, `content-type: application/json`, JSON body); service-to-service calls use **gRPC / gRPC-web** (the same style as RPoem's admin API `open_runo.admin.v1.Admin`). Streaming only when it is actually needed.
- **Existing REST endpoints are migrated one by one, when they are touched.** The old REST route is removed once migrated. Until migration is finished they remain, but **no new ones are added**.
- **JSON is unified on RS-JSON**: reading with `from_str_secure` / `parse_secure` (size, depth and duplicate-key limits), writing with `rust_json::fast`. `prost` is not put into browser WASM (it would grow the binary).
- **Exceptions (shapes dictated by someone else's standard, not our own API)**: ACME, OAuth/OIDC callbacks, webhooks from third parties (e.g. GitHub), health checks, static file serving, OTLP, and so on. These accept plain HTTP as the standard requires.
- Reference implementations: `RPoem` (`open_runo.admin.v1.Admin`) and `open-easy-web` (`server/src/connect.rs`, `proto/open_easy_web/admin/v1/admin.proto`).
- Note: whether the code in a given repository already follows this policy depends on that repository. This section records the policy; it does not mean the code has been changed.

### Deutsch (KI-Übersetzung, redaktionell überarbeitet; noch nicht von Muttersprachlern geprüft)
- **REST wird vollständig abgeschafft; neue APIs entstehen nicht mehr als REST.** APIs, die aus dem Browser oder per `curl` aufgerufen werden, verwenden **unäre Connect-Aufrufe** (`POST /<Paket>.<Service>/<Methode>`, `content-type: application/json`, JSON-Body). Zwischen Diensten kommen **gRPC bzw. gRPC-web** zum Einsatz, im selben Stil wie die Admin-API von RPoem (`open_runo.admin.v1.Admin`). Streaming wird erst ergänzt, wenn es tatsächlich gebraucht wird.
- **Bestehende REST-Endpunkte werden schrittweise umgestellt, und zwar immer dann, wenn man ohnehin an ihnen arbeitet.** Sobald ein Endpunkt umgestellt ist, wird die alte REST-Route entfernt. Bis zum Abschluss der Migration bleiben die übrigen bestehen, es werden aber **keine neuen mehr hinzugefügt**.
- **JSON wird einheitlich über RS-JSON verarbeitet**: Gelesen wird mit `from_str_secure` bzw. `parse_secure` (mit Obergrenzen für Größe, Verschachtelungstiefe und doppelte Schlüssel), geschrieben mit `rust_json::fast`. `prost` wird nicht in das Browser-WASM aufgenommen, da es die Datei vergrößern würde.
- **Ausnahmen (Schnittstellen, deren Form ein fremder Standard vorgibt und die nicht zu unserer eigenen API gehören)**: ACME, OAuth/OIDC-Callbacks, Webhooks von Drittanbietern (z. B. GitHub), Health-Checks, die Auslieferung statischer Dateien, OTLP und Ähnliches. Diese nehmen, wie vom jeweiligen Standard verlangt, gewöhnliches HTTP entgegen.
- Referenzimplementierungen: `RPoem` (`open_runo.admin.v1.Admin`) und `open-easy-web` (`server/src/connect.rs`, `proto/open_easy_web/admin/v1/admin.proto`).
- Hinweis: Ob der Code eines einzelnen Repositorys diese Richtlinie bereits erfüllt, hängt vom jeweiligen Repository ab. Dieser Abschnitt dokumentiert lediglich die Richtlinie; er besagt nicht, dass der Code schon angepasst wurde.

### Русский (перевод выполнен с помощью ИИ и отредактирован; носителями языка пока не проверен)
- **От REST мы полностью отказываемся; новые API больше не создаются в стиле REST.** API, к которым обращаются из браузера или через `curl`, используют **унарные вызовы Connect** (`POST /<пакет>.<Service>/<Method>`, `content-type: application/json`, тело запроса — JSON). Для взаимодействия между сервисами применяются **gRPC и gRPC-web** — в том же стиле, что и административный API RPoem (`open_runo.admin.v1.Admin`). Потоковая передача данных добавляется лишь тогда, когда в ней действительно возникает необходимость.
- **Существующие REST-эндпоинты переводятся поэтапно — по мере того, как с ними приходится работать.** После перевода старый REST-маршрут удаляется. Пока миграция не завершена, оставшиеся эндпоинты сохраняются, но **новые не добавляются**.
- **Работа с JSON унифицирована на основе RS-JSON**: чтение — через `from_str_secure` или `parse_secure` (с ограничениями на размер, глубину вложенности и повторяющиеся ключи), запись — через `rust_json::fast`. `prost` в браузерный WASM не включается, поскольку это увеличило бы размер файла.
- **Исключения (интерфейсы, форму которых определяет чужой стандарт, а не наш собственный API)**: ACME, обратные вызовы OAuth/OIDC, вебхуки сторонних сервисов (например, GitHub), проверки работоспособности, раздача статических файлов, OTLP и тому подобное. Такие интерфейсы принимают обычный HTTP, как того требует соответствующий стандарт.
- Эталонные реализации: `RPoem` (`open_runo.admin.v1.Admin`) и `open-easy-web` (`server/src/connect.rs`, `proto/open_easy_web/admin/v1/admin.proto`).
- Примечание: соответствует ли код конкретного репозитория этой политике, зависит от самого репозитория. Данный раздел лишь фиксирует политику и не означает, что код уже изменён.

## API 方針の補足: 用語の整理と使い分け (2026-11-04)

### 日本語
**1つに統一するものではなく、別の層の話です。** 「REST の代わり」になるのは Connect・gRPC・GraphQL だけで、WASM は画面を作る技術です。

| 用語 | 何か | REST の代わりか |
|---|---|---|
| REST | URL と HTTP メソッドで操作を表す API の作り方 | 全廃する側 |
| **Connect** | `POST /サービス名/メソッド名` に JSON を送る形式。`curl` でもブラウザの `fetch` でも呼べる | はい(**採用**) |
| **gRPC** | 同じ「サービス/メソッド」の考え方を、バイナリ(protobuf)と HTTP/2 で行う形式。速く、ストリーミングも得意 | はい(**サービス同士に採用**) |
| gRPC-web | gRPC のブラウザ向けの変形版 | はい(必要なら) |
| GraphQL | 欲しい項目を問い合わせる形式 | 一部だけ(**問い合わせ(読み取り)専用**) |
| WASM | Rust をブラウザの中で動かす仕組み | いいえ(画面を作る技術) |

- **ブラウザの画面や `curl` から呼ぶ API は Connect**(POST、JSON を RS-JSON で読み書き)。ブラウザの WASM は素の gRPC を話せず、Connect なら `fetch` のままで、`prost` を足さずに済む(画面のサイズも増えない)。
- **サービス同士の通信(サーバー間、重い処理、ストリーミング)は gRPC。** 多くは Connect で足りるので、ストリーミングが必要になった所だけ gRPC に上げる。
- **GraphQL は、まとめて問い合わせたいときの読み取り専用。** 書き込み(操作)には使わない。
- **WASM は画面を作る技術として、そのまま使う。** 画面から呼ぶ API が Connect になっただけ。
- 外部の規格が形を決めるもの(ACME、OAuth のコールバック、第三者の Webhook、ヘルスチェック、静的ファイル、OTLP)は、規格どおりの HTTP のまま。
- **迷ったら Connect。**

### English
**These are not alternatives to unify; they sit at different layers.** Only Connect, gRPC and GraphQL can replace REST; WASM is a way to build the UI.

| Term | What it is | Replaces REST? |
|---|---|---|
| REST | API style that expresses operations through URLs and HTTP methods | The thing being abolished |
| **Connect** | `POST /Service/Method` with a JSON body; callable from `curl` and from a browser `fetch` | Yes (**adopted**) |
| **gRPC** | The same service/method idea over binary (protobuf) and HTTP/2; fast, good at streaming | Yes (**for service-to-service**) |
| gRPC-web | A browser-friendly variant of gRPC | Yes (if needed) |
| GraphQL | A query language: ask for exactly the fields you want | Partly (**read-only queries**) |
| WASM | Runs Rust inside the browser | No (a UI technology) |

- **APIs called from browser screens or `curl` use Connect** (POST, JSON read and written with RS-JSON). Browser WASM cannot speak plain gRPC; with Connect it stays a `fetch`, and `prost` is not needed (the binary does not grow).
- **Service-to-service calls (server to server, heavy work, streaming) use gRPC.** Connect is enough in most places; move a call to gRPC only where streaming is actually needed.
- **GraphQL is read-only**, for queries that gather several pieces of data. It is not used for writes (operations).
- **WASM stays as the way to build the UI.** The API it calls simply became Connect.
- Interfaces whose shape an outside standard dictates (ACME, OAuth callbacks, third-party webhooks, health checks, static files, OTLP) stay plain HTTP.
- **When in doubt, use Connect.**

### Deutsch (KI-Übersetzung, sprachlich überarbeitet; noch nicht von Muttersprachlern geprüft)
**Es geht nicht darum, eine einzige Technik auszuwählen – die Begriffe liegen auf unterschiedlichen Ebenen.** Als Ersatz für REST kommen nur Connect, gRPC und GraphQL in Frage; WASM dagegen ist eine Technik, mit der die Benutzeroberfläche gebaut wird.

| Begriff | Was ist das? | Ersatz für REST? |
|---|---|---|
| REST | Ein API-Stil, bei dem Operationen über URLs und HTTP-Methoden ausgedrückt werden | wird abgeschafft |
| **Connect** | `POST /Dienst/Methode` mit JSON im Body; aufrufbar mit `curl` ebenso wie mit `fetch` im Browser | ja (**gewählt**) |
| **gRPC** | Dasselbe Prinzip aus Dienst und Methode, aber über binäres protobuf und HTTP/2; schnell und gut für Streaming geeignet | ja (**zwischen Diensten**) |
| gRPC-web | Eine für den Browser angepasste Variante von gRPC | ja (bei Bedarf) |
| GraphQL | Abfragesprache, mit der man genau die benötigten Felder anfordert | teilweise (**nur für lesende Abfragen**) |
| WASM | Führt Rust-Code direkt im Browser aus | nein (Technik für die Oberfläche) |

- **APIs, die von Browseroberflächen oder per `curl` aufgerufen werden, verwenden Connect** (POST; JSON wird mit RS-JSON gelesen und geschrieben). WASM im Browser kann kein reines gRPC sprechen. Mit Connect bleibt es bei einem gewöhnlichen `fetch`, und `prost` ist nicht nötig – die WASM-Datei wird dadurch nicht größer.
- **Für die Kommunikation zwischen Diensten (Server zu Server, rechenintensive Aufgaben, Streaming) wird gRPC eingesetzt.** In den meisten Fällen reicht Connect aus; auf gRPC wird nur dort umgestellt, wo Streaming tatsächlich gebraucht wird.
- **GraphQL dient ausschließlich lesenden Abfragen**, wenn mehrere Informationen gebündelt abgefragt werden sollen. Für Schreibzugriffe (Operationen) wird es nicht verwendet.
- **WASM bleibt die Technik für die Oberfläche.** Geändert hat sich lediglich, dass die aufgerufene API nun auf Connect beruht.
- Schnittstellen, deren Form durch einen externen Standard festgelegt ist (ACME, OAuth-Callbacks, Webhooks von Drittanbietern, Health-Checks, statische Dateien, OTLP), bleiben gewöhnliches HTTP.
- **Im Zweifel: Connect.**

### Русский (перевод выполнен с помощью ИИ и литературно отредактирован; носителями языка пока не проверен)
**Это не варианты, из которых нужно выбрать один, а технологии разных уровней.** Заменить REST могут только Connect, gRPC и GraphQL; WASM же — это способ создания пользовательского интерфейса.

| Термин | Что это | Заменяет REST? |
|---|---|---|
| REST | Стиль построения API, при котором операции выражаются через URL и HTTP-методы | отменяется |
| **Connect** | `POST /Сервис/Метод` с телом в формате JSON; вызывается как из `curl`, так и из браузерного `fetch` | да (**выбран**) |
| **gRPC** | Тот же принцип «сервис — метод», но поверх двоичного формата protobuf и HTTP/2; работает быстро и хорошо подходит для потоковой передачи | да (**для связи между сервисами**) |
| gRPC-web | Адаптированный для браузера вариант gRPC | да (при необходимости) |
| GraphQL | Язык запросов: клиент запрашивает ровно те поля, которые ему нужны | частично (**только запросы на чтение**) |
| WASM | Позволяет выполнять код на Rust прямо в браузере | нет (технология для интерфейса) |

- **API, которые вызываются из браузерных интерфейсов или через `curl`, строятся на Connect** (POST; JSON читается и записывается через RS-JSON). Браузерный WASM не умеет работать с «чистым» gRPC. С Connect достаточно обычного `fetch`, а `prost` не требуется — размер WASM-файла не увеличивается.
- **Для обмена между сервисами (сервер — сервер, ресурсоёмкие задачи, потоковая передача) применяется gRPC.** В большинстве случаев достаточно Connect; на gRPC переходят только там, где потоковая передача действительно необходима.
- **GraphQL используется только для чтения**, когда нужно получить сразу несколько связанных данных. Для записи (операций) он не применяется.
- **WASM по-прежнему остаётся технологией для интерфейса.** Изменилось лишь то, что вызываемый им API теперь построен на Connect.
- Интерфейсы, форма которых задана внешним стандартом (ACME, обратные вызовы OAuth, вебхуки сторонних сервисов, проверки работоспособности, статические файлы, OTLP), остаются обычным HTTP.
- **Если есть сомнения — выбирайте Connect.**

## Versionless API の方針 / Versionless API policy (2026-11-25)
**日本語**: このリポジトリのAPIは **Versionless**(URL・パッケージ名に `v1` 等を付けず、互換性を壊さず足すだけで進化させる)。欄は足すだけ・足す欄は省略可能・知らない欄は無視・名前変更は新名を足して旧を非推奨に(期限は既定で6か月以上、使用0を確認してから削除)・enumは未知の値を許容・安全上の緊急修正は例外。既存の `.v1` は呼び出し側を壊さないよう当面残し、版なしの別名を追加して段階的に畳む。詳細・出典は [`runo/API-POLICY.md`](https://github.com/aon-co-jp/runo/blob/main/API-POLICY.md) 末尾。適用はこれから順に行う。
**English**: This repository's APIs are **Versionless**: no `v1` in URLs or package names; evolve by adding only, without breaking compatibility. Only add fields, new fields are optional, ignore unknown fields, rename by adding the new name and deprecating the old (default deadline 6 months or more, remove only after confirming zero use), tolerate unknown enum values, emergency security fixes are the exception. Existing `.v1` names stay for now so callers do not break; a versionless alias is added and `.v1` is retired in stages. Details and sources: the end of [`runo/API-POLICY.md`](https://github.com/aon-co-jp/runo/blob/main/API-POLICY.md). Rollout is step by step.

## 完成まで作り切る方針 / Finish everything policy (2026-11-27)
**日本語**: 全リポジトリで、**未確認は自動で確認し、未実施は実施し、未了は完成させる**(確認を求めず進める)。使用頻度が低いと判断される機能や、**1から作り直す大規模開発になる内容でも、やめずに最後まで開発・TEST・DEBUGする**(別の方式で済ませない、後回しにしない)。進め方: 調査(英語・日本語の検索とGitHub) → 設計 → 実装 → 実機/実データで確認 → 失敗は原因を直して再試験 → README・CLAUDE・PORTING・POLICY を日英で更新 → push。「できた」と書くのは実測した範囲だけ、確認できなかった所は「未確認」と正直に書く。例外(確認を取る): 元に戻せない削除、秘密の公開、所有者の認証・決済・実機操作が要るもの、利用者のシステム設定の変更。
**English**: In every repository, **verify what is unverified, do what is not yet done, and finish what is unfinished** automatically, without asking. Even features that look rarely used, or work that means **a large rewrite from scratch, are developed, tested and debugged to the end** (no substituting another approach, no postponing). Method: research (English and Japanese search plus GitHub) -> design -> implement -> verify on real devices or data -> fix causes and retest on failure -> update README, CLAUDE, PORTING and POLICY in Japanese and English -> push. Write "done" only for what was measured, and say "unverified" honestly for the rest. Exceptions that still need confirmation: irreversible deletions, publishing secrets, anything needing the owner's authentication, payment or real-device actions, and changes to the user's system settings.