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
npm run build:demo       # webpage/ : browser demo + PWA
npm run package          # .vsix
node scripts/gen-docs.js # regenerate these documents
```

See [PUBLISHING.md](PUBLISHING.md) for Marketplace / Open VSX publication and [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the host matrix (VS Code 1.85+, VSCodium, web, browser demo) and the host contract.


---

## 🔁 お引越し・再開用メッセージ / Resume message (2026-10-18, Windows 再起動前 / before the Windows restart)

**日本語(次のセッションの Claude へ)**
1. まず `F:\dream-os\vsc\BUILD-REPORT.md` を読む。DreamOS Code(Code-OSS 1.142.0)のビルドは **node / clone / `npm ci` までが完了、パッケージ化(`gulp`)以降が未完了・未検証**。
2. 再開は PowerShell で `wsl -d Ubuntu -- bash /mnt/f/dream-os/vsc/build.sh`(完了印があれば続きから)。終わったら `verify.sh`(Xvfb が要る場合は `wsl -u root apt-get install -y xvfb`)。結果は `BUILD-REPORT.md` に正直に書き、`vsc/` をコミット。`F:\dream-os` の `installer/windows/make-usb.ps1` の未コミット変更は**この作業のものではない**ので巻き込まない。
3. `open-vsc-claude` は v0.1.2 を公開済み(`F:\open-vsc-claude`、デモ `https://easy-web.tokyo/open-vps-claude/`、テスト 4 種が通る)。**未了**: Marketplace/Open VSX 公開(所有者のアカウントとトークンが必要。手順は `PUBLISHING.md`)、Cosmo Router の実起動、実キーでの Claude 生成、実機 iOS/Android、翻訳のネイティブ確認。
4. 秘密(トークン・API キー)はリポジトリに入れない。`F:\` 直下の txt に置き、値を画面・コミットに出さない。
5. 落とし穴: Git Bash は `/mnt/...` を書き換える(PowerShell を使う)、シェルの heredoc で python に `\n` を渡すと本物の改行になる(補助スクリプトは先にファイルへ)、CRLF のファイルは置換が静かに失敗する(Edit ツールを使う)、書き換え済みリポジトリで `git pull` しない。

**English (for the next Claude session)**
1. Read `F:\dream-os\vsc\BUILD-REPORT.md` first. The DreamOS Code (Code-OSS 1.142.0) build is **done through node / clone / `npm ci`; packaging (`gulp`) and later stages are not done and unverified**.
2. Resume from PowerShell: `wsl -d Ubuntu -- bash /mnt/f/dream-os/vsc/build.sh` (stamped stages are skipped), then `verify.sh` (if Xvfb is missing: `wsl -u root apt-get install -y xvfb`). Record the real result honestly in `BUILD-REPORT.md` and commit `vsc/`. The uncommitted change to `installer/windows/make-usb.ps1` in `F:\dream-os` is **not part of this work** — leave it alone.
3. `open-vsc-claude` v0.1.2 is released (`F:\open-vsc-claude`, demo `https://easy-web.tokyo/open-vps-claude/`, all four test suites pass). **Open**: Marketplace / Open VSX publication (needs the owner's account and token; see `PUBLISHING.md`), running the Cosmo Router, Claude generation with a real key, real iOS/Android devices, native review of translations.
4. Never put secrets (tokens, API keys) in repositories; keep them in txt files at the root of `F:\` and never print or commit their values.
5. Pitfalls: Git Bash rewrites `/mnt/...` (use PowerShell); escapes in shell heredocs turn `\n` into real newlines (write helper scripts to files first); CRLF files make scripted replacement fail silently (use the Edit tool); never `git pull` in rewritten repositories.
