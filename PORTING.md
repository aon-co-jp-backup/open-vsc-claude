# PORTING.md — Open VSC Claude

引き継ぎメモ: 完了したこと、未了のこと、落とし穴、手順。

## 完了

- 拡張: スタック選択、Claude 生成、自由入力モード、更新確認。
- RPoem ゲートウェイのサブグラフ中継(別リポジトリ RPoem、コミット babc658)。
- ブラウザデモ + PWA を easy-web.tokyo/open-vps-claude で公開。
- 12 言語のドキュメント。

## 未了

- VS Code Marketplace / Open VSX への公開(所有者のアカウントとトークンが必要。PUBLISHING.md 参照)。
- Cosmo Router の実起動(開発 PC にバイナリも Docker も無い)。
- 実際の Anthropic API キーでの自由入力モードの試験。
- 実機の iPhone・iPad・Android での試験。
- 翻訳のネイティブ確認。

## 落とし穴

- ファイルが CRLF の場合があり、スクリプトでの置換が静かに失敗することがある。エディタのツールを使う。
- シェルのヒアドキュメント内のエスケープで \n が本物の改行になる。補助スクリプトは先にファイルへ書く。
- アプリ内ブラウザは Service Worker をブロックする。PWA はヘッドレス Chromium(@vscode/test-web 同梱の playwright)で試験する。
- 書き換え済みリポジトリで git pull をしない(メタリポジトリ参照)。
- リポジトリ名は open-vsc-claude。所有者が指定したデモのパスは /open-vps-claude。

## リリース手順

1. テストを実行(compile、test、test:vscode、test:web)。
2. package.json のバージョンを上げ、npm run package。
3. .vsix とその .sha256 を付けて gh release create vX.Y.Z(更新機能がチェックサムを検証する)。
4. npm run build:demo の後、webpage/ を VPS へ配置。


---

# PORTING.md — Open VSC Claude

Hand-off notes: what is done, what is not, pitfalls and procedures.

## Done

- Extension: stack picker, Claude generation, free-form mode, update check.
- RPoem gateway forwarding to subgraphs (separate repository RPoem, commit babc658).
- Browser demo + PWA at easy-web.tokyo/open-vps-claude.
- Documentation in 12 languages.

## To do

- Publish to the VS Code Marketplace / Open VSX (owner account and token required; see PUBLISHING.md).
- Run the Cosmo Router for real (no binary or Docker on the development PC).
- Test free-form mode with a real Anthropic API key.
- Test on real iPhone, iPad and Android devices.
- Native-speaker review of the translations.

## Pitfalls

- Files may use CRLF; scripted text replacement can silently miss. Prefer the editor tools.
- Escapes inside shell heredocs turn \n into real newlines; write helper scripts to files first.
- The in-app browser blocks service workers; test the PWA with headless Chromium (playwright from @vscode/test-web).
- Never run git pull in the rewritten repositories (see the meta repository).
- The repository is open-vsc-claude; the demo path requested by the owner is /open-vps-claude.

## Release procedure

1. Run the tests (compile, test, test:vscode, test:web).
2. Bump the version in package.json and run npm run package.
3. gh release create vX.Y.Z with the .vsix and its .sha256 (the updater verifies the checksum).
4. npm run build:demo, then deploy webpage/ to the VPS.


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
