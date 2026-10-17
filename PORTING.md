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

